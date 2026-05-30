const TrustSection = () => {
  return (
    <section className="py-20 bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-2xl" data-icon="hub">hub</span>
            <span className="font-headline font-bold uppercase tracking-widest text-xs">Built on Blockchain</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-2xl" data-icon="verified_user">verified_user</span>
            <span className="font-headline font-bold uppercase tracking-widest text-xs">Secure &amp; Transparent</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-2xl" data-icon="account_balance">account_balance</span>
            <span className="font-headline font-bold uppercase tracking-widest text-xs">Government-ready Infrastructure</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
