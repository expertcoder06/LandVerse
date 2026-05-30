const HowItWorks = () => {
  return (
    <section className="py-32 bg-surface-container-low overflow-hidden">
      <div className="max-w-7xl mx-auto px-8">
        <div className="text-center mb-20">
          <h2 className="font-headline text-4xl font-bold mb-4">The Digital Transformation</h2>
          <div className="h-1 w-20 bg-primary mx-auto rounded-full"></div>
        </div>
        <div className="relative">
          {/* Connection Line (Desktop) */}
          <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-outline-variant/30 to-transparent -translate-y-1/2"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-12 relative z-10">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-primary/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(143,245,255,0.2)]">
                <span className="font-headline font-bold text-primary">01</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Upload Land</h4>
              <p className="text-xs text-on-surface-variant px-4">Submit deeds and documentation for digital intake.</p>
            </div>
            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-secondary/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(172,137,255,0.2)]">
                <span className="font-headline font-bold text-secondary">02</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Verify</h4>
              <p className="text-xs text-on-surface-variant px-4">De-centralized verification of legal boundaries.</p>
            </div>
            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(143,245,255,0.4)] -mt-2">
                <span className="material-symbols-outlined text-on-primary text-3xl" data-icon="auto_awesome">auto_awesome</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Mint NFT</h4>
              <p className="text-xs text-on-surface-variant px-4 font-bold">Your land is now a secure on-chain asset.</p>
            </div>
            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-secondary/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(172,137,255,0.2)]">
                <span className="font-headline font-bold text-secondary">04</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Buy/Sell</h4>
              <p className="text-xs text-on-surface-variant px-4">Trade instantly on the LandVerse marketplace.</p>
            </div>
            {/* Step 5 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-surface-container-highest border border-primary/40 flex items-center justify-center mb-6 shadow-[0_0_15px_rgba(143,245,255,0.2)]">
                <span className="font-headline font-bold text-primary">05</span>
              </div>
              <h4 className="font-headline font-bold mb-2">Transfer</h4>
              <p className="text-xs text-on-surface-variant px-4">Seamless ownership migration via smart-contract.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
