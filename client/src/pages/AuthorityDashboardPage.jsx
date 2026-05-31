import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const SIDEBAR_ITEMS = [
  { icon: 'dashboard', label: 'Dashboard', id: 'dashboard' },
  { icon: 'how_to_reg', label: 'KYC Requests', id: 'kyc' },
  { icon: 'verified_user', label: 'Land Verifications', id: 'land' },
  { icon: 'report_problem', label: 'Fraud Alerts', id: 'fraud' },
  { icon: 'terminal', label: 'System Logs', id: 'logs' },
];

function AuthorityDashboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [caseStatus, setCaseStatus] = useState('pending'); // 'pending' | 'approved' | 'rejected' | 'changes'

  const [adminDetails, setAdminDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Supabase dynamic state variables
  const [stats, setStats] = useState({
    kycCount: 0,
    landCount: 0,
    fraudCount: 0
  });
  const [pendingProperties, setPendingProperties] = useState([]);
  const [activePropertyIndex, setActivePropertyIndex] = useState(0);

  const fetchStats = async () => {
    try {
      const { count: kycPending } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('kyc_status', 'pending');

      const { count: landPending } = await supabase
        .from('properties')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      const { count: failedTxs } = await supabase
        .from('transactions')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'failed');

      setStats({
        kycCount: kycPending || 0,
        landCount: landPending || 0,
        fraudCount: failedTxs || 0
      });
    } catch (err) {
      console.error('Error fetching statistics:', err);
    }
  };

  const fetchPendingProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*, profiles:owner_id(*)')
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setPendingProperties(data || []);
      setActivePropertyIndex(0);
    } catch (err) {
      console.error('Error fetching pending properties:', err);
    }
  };

  const loadDashboardData = async () => {
    await Promise.all([fetchStats(), fetchPendingProperties()]);
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        // Get active auth user
        const { data: { user }, error: userError } = await supabase.auth.getUser();

        if (userError || !user) {
          console.warn('No active session, redirecting to /login');
          navigate('/login');
          return;
        }

        // Query adminstartator table
        const { data: admin, error: adminError } = await supabase
          .from('adminstartator')
          .select('*')
          .eq('id', user.id)
          .single();

        if (adminError || !admin) {
          console.log('Admin record not found in adminstartator, searching profiles as fallback', adminError);
          // Query profiles as fallback
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (profile && profile.role === 'authority') {
            setAdminDetails({
              id: profile.id,
              full_name: profile.full_name,
              role: profile.role,
              email: user.email
            });
          } else {
            console.error('User is not authorized as authority in profiles', profileError);
            setError('Access Denied: You do not have authority privileges.');
            await supabase.auth.signOut();
            navigate('/login');
            return;
          }
        } else {
          setAdminDetails(admin);
        }

        // Load the live Supabase dynamic data
        await loadDashboardData();
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        setError('Error establishing server connection.');
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (err) {
      console.error('Error during sign out:', err);
      navigate('/login');
    }
  };

  const handleAction = async (status, feedback = '') => {
    const activeProperty = pendingProperties[activePropertyIndex];
    if (!activeProperty) return;

    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('No authenticated user session found.');

      const updatePayload = {
        status: status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : 'changes_requested',
        verified_at: new Date().toISOString(),
        verified_by: user.id
      };

      if (feedback) {
        updatePayload.rejection_reason = feedback;
      } else if (status === 'changes') {
        updatePayload.status = 'changes_requested';
        updatePayload.rejection_reason = 'Feedback or changes requested.';
      } else if (status === 'rejected') {
        updatePayload.rejection_reason = 'Property rejected due to boundary/validation issues.';
      }

      // Update property
      const { error: propError } = await supabase
        .from('properties')
        .update(updatePayload)
        .eq('id', activeProperty.id);

      if (propError) throw propError;

      // Update application
      const { data: landApp } = await supabase
        .from('land_applications')
        .select('id')
        .eq('property_id', activeProperty.id)
        .eq('status', 'pending')
        .maybeSingle();

      if (landApp) {
        await supabase
          .from('land_applications')
          .update({
            status: updatePayload.status,
            reviewed_by: user.id,
            reviewed_at: new Date().toISOString(),
            authority_feedback: feedback || (status === 'approved' ? 'Approved by Registrar Authority.' : 'Status changed by authority.')
          })
          .eq('id', landApp.id);
      }

      alert(`Property successfully ${status === 'changes' ? 'marked for changes' : status}!`);
      setCaseStatus(status);
      await loadDashboardData();
    } catch (err) {
      console.error('Registry decision execution error:', err);
      alert(err.message || 'Failed to update property verification status.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-surface font-body overflow-x-hidden selection:bg-primary/30 min-h-screen flex page-enter">
      {/* SideNavBar Shell */}
      <aside className="fixed left-0 top-0 h-screen w-72 flex flex-col z-40 bg-surface-container shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
        <div className="p-8">
          <Link to="/dashboard" className="text-2xl font-display font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
            LandVerse
          </Link>
          <p className="font-label uppercase tracking-widest text-[0.65rem] text-on-surface-variant mt-1">Registry Authority</p>
        </div>
        <nav className="flex-1 mt-4">
          <div className="space-y-1">
            {SIDEBAR_ITEMS.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-8 py-4 transition-colors duration-200 text-left
                    ${isActive 
                      ? 'bg-primary/10 text-primary border-r-4 border-primary font-bold' 
                      : 'text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface'
                    }`}
                >
                  <span className="material-symbols-outlined" style={isActive ? { fontVariationSettings: "'FILL' 1" } : {}}>{item.icon}</span>
                  <span className="font-headline tracking-wide">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
        <div className="p-6">
          <button className="w-full py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_4px_20px_rgba(143,245,255,0.2)] active:scale-95 transition-transform duration-150">
            New Entry
          </button>
          <div className="mt-8 flex items-center justify-between px-2 w-full">
            <div className="flex items-center gap-3 min-w-0">
              <div className="relative flex-shrink-0">
                <img
                  alt="Admin User Avatar"
                  className="w-10 h-10 rounded-full object-cover border border-primary/20"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA9hvVavHZPZy4sIdE-YmZwBGRvoZfxz6Vl-Jpfb5V7_oiRLmPOFr53wq414lM9ImLTpeGKxDgizvlgDQVxCHefit2WVW5XNaDG-1FGMXqep0p55l7BXWgpyUmzAc4bevNVFuoK45bVboiOzhb4irzA71FQHpKnIkcAAbflS87hrMZGGEDhAmzKTr_Es3ne533ZBNlJjsK23f9tC25ODTSZeybLPDjulD16eFXaK0YLDg1h-mlxX_9Yfu5g2Jf60pyImgnaTpqdhJm6"
                />
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-tertiary rounded-full border-2 border-surface-container shadow-sm animate-pulse"></div>
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-on-surface truncate pr-1" title={loading ? 'Loading...' : (adminDetails?.full_name || 'Admin User')}>
                  {loading ? 'Loading...' : (adminDetails?.full_name || 'Admin User')}
                </p>
                <p className="text-[0.7rem] text-on-surface-variant uppercase tracking-tighter truncate" title={loading ? 'Registrar' : (adminDetails?.role === 'authority' ? 'Chief Registrar' : adminDetails?.role || 'Registrar')}>
                  {loading ? 'Registrar' : (adminDetails?.role === 'authority' ? 'Chief Registrar' : adminDetails?.role || 'Registrar')}
                </p>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              title="Sign Out"
              className="text-on-surface-variant hover:text-error transition-all p-2 rounded-full hover:bg-error/10 flex items-center justify-center cursor-pointer flex-shrink-0"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          </div>

        </div>
      </aside>

      {/* Main Content Area */}
      <main className="ml-72 flex-grow min-h-screen flex flex-col">
        {/* TopNavBar Shell */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-12 h-20 bg-surface/40 backdrop-blur-xl">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative w-96">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">search</span>
              <input
                className="w-full bg-surface-container-lowest border-none rounded-sm py-2.5 pl-12 pr-4 text-sm focus:ring-1 focus:ring-primary/50 text-on-surface placeholder:text-on-surface-variant/50 transition-all outline-none"
                placeholder="Search transactions, properties, or identities..."
                type="text"
              />
            </div>
          </div>
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-6">
              <button className="text-on-surface-variant hover:text-primary transition-all relative">
                <span className="material-symbols-outlined">notifications</span>
                <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border-2 border-surface-dim"></span>
              </button>
              <button className="text-on-surface-variant hover:text-primary transition-all">
                <span className="material-symbols-outlined">settings</span>
              </button>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/20"></div>
            <div className="flex items-center gap-3">
              <span className="font-headline text-lg font-bold gradient-text">Authority Panel</span>
              <div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center ghost-border">
                <span className="material-symbols-outlined text-sm">shield</span>
              </div>
            </div>
          </div>
        </header>

        <section className="p-12 space-y-12 max-w-7xl mx-auto flex-grow">
          {/* Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                id: 'kyc',
                icon: 'how_to_reg',
                label: 'Pending KYC Requests',
                value: stats.kycCount,
                change: stats.kycCount > 0 ? `${stats.kycCount} Pending` : 'Stable',
                status: stats.kycCount > 0 ? 'urgent' : 'stable',
                colorClass: 'text-primary',
                bgClass: 'bg-primary/10',
              },
              {
                id: 'land',
                icon: 'verified_user',
                label: 'Pending Land Verifications',
                value: stats.landCount,
                change: stats.landCount > 0 ? 'Action Required' : 'Cleared',
                status: stats.landCount > 0 ? 'urgent' : 'stable',
                colorClass: 'text-secondary',
                bgClass: 'bg-secondary/10',
              },
              {
                id: 'fraud',
                icon: 'report_problem',
                label: 'Failed Transaction Alerts',
                value: stats.fraudCount,
                change: stats.fraudCount > 0 ? 'Attention' : 'Secure',
                status: stats.fraudCount > 0 ? 'urgent' : 'stable',
                colorClass: 'text-error',
                bgClass: 'bg-error/10',
              },
            ].map((card) => (
              <div
                key={card.id}
                className="surface-container-low p-8 rounded-lg relative overflow-hidden group hover:bg-surface-container-high transition-all duration-300 border border-outline-variant/15 cursor-pointer hover-lift"
              >
                <div className="flex justify-between items-start mb-6">
                  <div className={`p-3 ${card.bgClass} rounded-md`}>
                    <span className={`material-symbols-outlined ${card.colorClass}`}>{card.icon}</span>
                  </div>
                  <span
                    className={`flex items-center gap-1 text-[0.7rem] font-label
                      ${card.status === 'up' || card.status === 'urgent' ? 'text-error' : 'text-on-surface-variant'}`}
                  >
                    {(card.status === 'up' || card.status === 'urgent') && <span className="material-symbols-outlined text-[1rem]">trending_up</span>}
                    {card.change}
                  </span>
                </div>
                <p className="font-label uppercase text-[0.7rem] text-on-surface-variant tracking-[0.2em]">{card.label}</p>
                <h3 className="text-4xl font-display font-bold mt-2">{card.value}</h3>
                <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                  <span className={`material-symbols-outlined text-8xl ${card.colorClass}`}>{card.icon}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Land Review Panel */}
          <div className="space-y-6">
            <div className="flex items-end justify-between px-2">
              <div>
                <span className="text-primary font-label text-[0.7rem] tracking-widest uppercase">Critical Action Required</span>
                <h2 className="text-3xl font-display font-bold mt-1">Land Review Panel</h2>
              </div>
              <div className="flex items-center gap-4 text-on-surface-variant text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></div>
                  Live Ledger Sync
                </div>
                {pendingProperties.length > 0 && (
                  <span>Case #{pendingProperties[activePropertyIndex]?.id.substring(0, 8).toUpperCase()}</span>
                )}
              </div>
            </div>

            {pendingProperties.length > 0 ? (
              <div className="grid grid-cols-12 gap-8">
                {/* Verification Queue Sidebar (shows if > 1 items are in queue) */}
                {pendingProperties.length > 1 && (
                  <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 bg-surface-container-low p-6 rounded-lg border border-outline-variant/10">
                    <p className="font-label uppercase text-[0.65rem] text-on-surface-variant tracking-wider px-2">Verification Queue ({pendingProperties.length})</p>
                    <div className="flex flex-col gap-2 max-h-[480px] overflow-y-auto">
                      {pendingProperties.map((prop, idx) => (
                        <button
                          key={prop.id}
                          onClick={() => setActivePropertyIndex(idx)}
                          className={`p-4 rounded-md text-left transition-all border flex flex-col gap-1 active:scale-95 cursor-pointer
                            ${idx === activePropertyIndex
                              ? 'bg-primary/10 border-primary/30 text-primary font-bold shadow-md shadow-primary/5'
                              : 'bg-surface-container hover:bg-surface-container-high border-outline-variant/10 text-on-surface'
                            }`}
                        >
                          <span className="text-sm truncate font-display">{prop.name}</span>
                          <span className="text-[10px] font-mono text-on-surface-variant">Plot: {prop.plot_number}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Left Content: Property & Details */}
                <div className={`col-span-12 ${pendingProperties.length > 1 ? 'lg:col-span-6' : 'lg:col-span-8'} glass-card rounded-lg p-10 border border-primary/5`}>
                  <div className="flex flex-col md:flex-row justify-between gap-12">
                    <div className="space-y-10 flex-1">
                      {/* Owner Section */}
                      <div className="flex items-center gap-6">
                        <img
                          alt="Owner Avatar"
                          className="w-16 h-16 rounded-full object-cover border border-outline-variant/15"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCm7gAMTnBgnEoGSIlB1WXRjNlzvLmP98IuvjRK1s5pGm-A_VpvKKZjTZDI43rR-SWsA2mkZUyzcVcbqyHbPUoooILnYDyvDNE4ofoe8lVN-9ZQVuyVcf4DCoUGvOpRscPgP1DMPfHu_zVhsmscVKTi3t3Te8TOyxDMsN7MZMnPd1yQI-xNDM17AskdsJt8AjUeKgkFG2a2zctRfJCJWzlHGq5oCJEyVD5BOODxiec7gzM0g2XWPvyzaZq-1kjyJyvpbrh5yecpOPEn"
                        />
                        <div>
                          <p className="font-label uppercase text-[0.6rem] text-on-surface-variant tracking-[0.2em]">Owner Details</p>
                          <h4 className="text-2xl font-display font-bold">
                            {pendingProperties[activePropertyIndex]?.profiles?.full_name || 'Anonymous User'}
                          </h4>
                          <p className="font-label text-xs font-mono text-primary/70 mt-1">
                            ID: {pendingProperties[activePropertyIndex]?.profiles?.wallet_address 
                              ? `${pendingProperties[activePropertyIndex].profiles.wallet_address.substring(0, 7)}...${pendingProperties[activePropertyIndex].profiles.wallet_address.substring(38)}`
                              : 'No Connected Wallet'}
                          </p>
                        </div>
                      </div>
                      {/* Specs Section */}
                      <div className="grid grid-cols-2 gap-8 py-8 border-y border-outline-variant/10">
                        <div>
                          <p className="font-label uppercase text-[0.6rem] text-on-surface-variant tracking-[0.2em]">Plot Reference</p>
                          <p className="text-xl font-headline font-bold mt-1">
                            #{pendingProperties[activePropertyIndex]?.plot_number || 'N/A'}
                          </p>
                        </div>
                        <div>
                          <p className="font-label uppercase text-[0.6rem] text-on-surface-variant tracking-[0.2em]">Total Area</p>
                          <p className="text-xl font-headline font-bold mt-1">
                            {pendingProperties[activePropertyIndex]?.area?.toLocaleString()} {pendingProperties[activePropertyIndex]?.area_unit}
                          </p>
                        </div>
                      </div>
                      {/* Documents Section */}
                      <div>
                        <p className="font-label uppercase text-[0.6rem] text-on-surface-variant tracking-[0.2em] mb-4">Document Gallery</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="surface-container p-4 rounded-md flex items-center justify-between border border-outline-variant/15 hover:bg-surface-container-highest transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-primary/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-primary">description</span>
                              </div>
                              <span className="text-sm font-medium">Title Deed</span>
                            </div>
                            <a
                              href={pendingProperties[activePropertyIndex]?.title_deed_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[0.7rem] uppercase font-label font-bold text-primary hover:underline"
                            >
                              View File
                            </a>
                          </div>
                          <div className="surface-container p-4 rounded-md flex items-center justify-between border border-outline-variant/15 hover:bg-surface-container-highest transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded bg-secondary/5 flex items-center justify-center">
                                <span className="material-symbols-outlined text-secondary">verified</span>
                              </div>
                              <span className="text-sm font-medium">Ownership Proof</span>
                            </div>
                            <a
                              href={pendingProperties[activePropertyIndex]?.ownership_proof_url}
                              target="_blank"
                              rel="noreferrer"
                              className="text-[0.7rem] uppercase font-label font-bold text-secondary hover:underline"
                            >
                              View File
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Map Section */}
                    <div className="w-full md:w-80 space-y-4">
                      <p className="font-label uppercase text-[0.6rem] text-on-surface-variant tracking-[0.2em]">Geospatial Preview</p>
                      <div className="aspect-square w-full rounded-lg overflow-hidden relative group border border-outline-variant/20">
                        <img
                          alt="Geospatial Map"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCOJOGV7JNQXaM0gwFdcXYg4QgXeqeICK4swRAx5_GT5BAONNpVbxaJ8ppuqepbPOkOdwoAKKGj_jlBlIMyJJB1uiwKDGnIugbHrGFELbZEJTWrZPCah6T15gTZCo7o3kZbZBNWtqyfooZgSV7--U7G0jUkw_3DNHrbj0ASFE3vdDFGgnWr4hb9yFfJK7IB9vEoy75pWyMyzUf9dsvzxNkUnDfG4pL8PhMAmmjrOffgML38gD3_JYa02qDhMlg31q8qbuXLgAO02LxX"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent"></div>
                      </div>
                      <div className="flex items-center gap-2 text-[0.6rem] font-mono text-on-surface-variant justify-center bg-surface-container-lowest py-2 rounded">
                        {pendingProperties[activePropertyIndex]?.latitude}° N, {pendingProperties[activePropertyIndex]?.longitude}° W
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Sidebar: Decision Hub */}
                <div className="col-span-12 lg:col-span-4 flex flex-col gap-8">
                  <div className="surface-container p-8 rounded-lg border border-outline-variant/15 flex-grow flex flex-col justify-center space-y-6">
                    <h3 className="text-xl font-display font-bold">Registry Decision</h3>
                    <p className="text-on-surface-variant text-sm leading-relaxed">
                      Review all associated metadata and blockchain hash verification before final submission. Approved records are immutable on the MainNet.
                    </p>
                    <div className="space-y-4 pt-4">
                      <button
                        onClick={() => handleAction('approved')}
                        className="w-full py-4 rounded-md bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold shadow-[0_4px_30px_rgba(0,238,252,0.3)] hover:brightness-110 active:scale-95 transition-all btn-shimmer cursor-pointer"
                      >
                        Approve Property
                      </button>
                      <button
                        onClick={() => handleAction('changes')}
                        className="w-full py-4 rounded-md border border-outline-variant/15 text-on-surface font-bold hover:bg-surface-variant active:scale-95 transition-all cursor-pointer"
                      >
                        Request Changes
                      </button>
                      <button
                        onClick={() => handleAction('rejected')}
                        className="w-full py-4 rounded-md bg-error/10 text-error border border-error/20 font-bold hover:bg-error hover:text-on-error active:scale-95 transition-all cursor-pointer"
                      >
                        Reject Entry
                      </button>
                    </div>
                  </div>
                  {/* Secondary Info Card */}
                  <div className="surface-container-low p-6 rounded-lg border-l-4 border-secondary/50">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="material-symbols-outlined text-secondary text-sm">info</span>
                      <p className="text-xs font-bold uppercase tracking-widest text-secondary">Provisional Alert</p>
                    </div>
                    <p className="text-xs text-on-surface-variant">
                      Ensure the GPS Polygon boundaries do not overlap with neighboring surveyed properties. Check title deed hash integrity against local archives.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="w-full">
                <div className="flex flex-col items-center justify-center p-16 text-center bg-surface-container-low rounded-lg border border-outline-variant/15 shadow-2xl relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent pointer-events-none" />
                  <div className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6 border border-success/20 text-success">
                    <span className="material-symbols-outlined text-4xl">verified</span>
                  </div>
                  <h4 className="text-2xl font-display font-bold mb-2">Registry Queue Cleared</h4>
                  <p className="text-on-surface-variant max-w-md mx-auto font-body text-sm leading-relaxed">
                    There are no pending land registration requests in the queue at the moment. All submitted land deeds have been verified and integrated into the ledger.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Background Decorator Auras */}
      <div className="fixed top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 blur-[120px] pointer-events-none rounded-full animate-float-slow"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-secondary/5 blur-[100px] pointer-events-none rounded-full animate-float"></div>
    </div>
  );
}

export default AuthorityDashboardPage;
