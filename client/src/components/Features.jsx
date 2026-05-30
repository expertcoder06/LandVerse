const Features = () => {
  return (
    <section className="py-32 bg-surface relative">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1 */}
          <div className="glass-card p-8 rounded-lg group hover:bg-surface-container-high transition-all duration-500">
            <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="token">token</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">NFT-based Land Ownership</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Each land parcel is minted as a unique NFT, providing verifiable proof of ownership directly on the ledger.
            </p>
          </div>
          {/* Card 2 */}
          <div className="glass-card p-8 rounded-lg group hover:bg-surface-container-high transition-all duration-500">
            <div className="w-14 h-14 rounded-md bg-secondary/10 flex items-center justify-center mb-6 text-secondary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="contract">contract</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">Smart Contract Transactions</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Execute escrow and title transfers automatically with self-verifying protocols that eliminate middlemen.
            </p>
          </div>
          {/* Card 3 */}
          <div className="glass-card p-8 rounded-lg group hover:bg-surface-container-high transition-all duration-500">
            <div className="w-14 h-14 rounded-md bg-tertiary/10 flex items-center justify-center mb-6 text-tertiary group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="admin_panel_settings">admin_panel_settings</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">Tamper-proof Records</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Our distributed ledger ensures that records cannot be altered, providing absolute security for your assets.
            </p>
          </div>
          {/* Card 4 */}
          <div className="glass-card p-8 rounded-lg group hover:bg-surface-container-high transition-all duration-500">
            <div className="w-14 h-14 rounded-md bg-primary-fixed/10 flex items-center justify-center mb-6 text-primary-fixed group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-3xl" data-icon="distance">distance</span>
            </div>
            <h3 className="font-headline text-xl font-bold mb-4">Geo-tagged Verification</h3>
            <p className="text-on-surface-variant text-sm leading-relaxed">
              Precise GPS integration allows for instant verification of land boundaries through decentralized oracle networks.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
