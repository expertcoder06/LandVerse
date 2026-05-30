const Navbar = () => {
  return (
    <nav className="bg-[#0c0e16]/40 backdrop-blur-xl docked full-width top-0 sticky z-50 shadow-[0_20px_40px_rgba(0,0,0,0.4)]">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-7xl mx-auto">
        <div className="text-2xl font-black tracking-tighter text-[#00E5FF] font-headline">LandVerse</div>
        <div className="hidden md:flex items-center space-x-10">
          <a className="font-['Space_Grotesk'] tracking-wide uppercase text-sm font-bold text-[#00E5FF] border-b-2 border-[#00E5FF] pb-1" href="#">Explore</a>
          <a className="font-['Space_Grotesk'] tracking-wide uppercase text-sm font-bold text-slate-400 hover:text-white transition-colors" href="#">How It Works</a>
          <a className="font-['Space_Grotesk'] tracking-wide uppercase text-sm font-bold text-slate-400 hover:text-white transition-colors" href="#">Features</a>
        </div>
        <button className="bg-gradient-to-r from-primary to-primary-container text-on-primary-container px-6 py-2 rounded-full font-headline font-bold text-sm tracking-wider uppercase scale-95 active:scale-90 transition-transform hover:shadow-[0_0_20px_rgba(0,238,252,0.4)]">
          View Demo
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
