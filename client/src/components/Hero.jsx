const Hero = () => {
  return (
    <header className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 hero-gradient"></div>
        <img
          className="w-full h-full object-cover"
          data-alt="Abstract 3D digital grid representing blockchain nodes and glowing connecting lines in a dark cosmic environment with cyan and purple hues"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzzReZpt3CJFlcOWZNpdHaDyJJfbT7MD_N2t0cmtU3mn-IVztKO3655FJUpml6j90b1xx39Rkg9xGjxGvmptK8Tlt1o2OqYy1ydyH4RKbzthmzvu29Kc1VOjVuKBBqQtedqDvIxtoQcAIdD5YbsTnCZzRA0Nw8bYJEd0tf3yNWqwUWs1njbVf9V94o7fZNUeh9vcnYiWiyAUyzwv6DRkRQ-zN9At1b2Ri06ii_rmYonnTEepkCfFqrRypv-vndvnrft3GO6EMDljFG"
          alt="Hero background"
        />
      </div>
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        <div className="inline-flex items-center space-x-2 bg-surface-container-high/50 px-4 py-1.5 rounded-full mb-8 border border-outline-variant/10">
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">Blockchain Verified Registry</span>
        </div>
        <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1] text-glow">
          LandVerse – A Secure, <span className="text-primary italic">Transparent</span> &amp; NFT-Powered Land Ownership Ecosystem
        </h1>
        <p className="text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light">
          Transforming physical land into trusted digital assets. Secure your future through automated, immutable blockchain architecture.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <button className="w-full sm:w-auto px-10 py-4 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm hover:translate-y-[-2px] transition-all shadow-lg shadow-primary/10">
            Explore Platform
          </button>
          <button className="w-full sm:w-auto px-10 py-4 rounded-lg bg-transparent text-secondary border border-outline-variant/20 font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-container-high transition-all">
            View Demo
          </button>
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">Scroll to Explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-primary to-transparent"></div>
      </div>
    </header>
  );
};

export default Hero;
