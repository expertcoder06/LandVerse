const Footer = () => {
  return (
    <footer className="bg-[#0c0e16] full-width py-12 border-t border-[#464751]/15">
      <div className="flex flex-col md:flex-row justify-between items-center px-8 max-w-7xl mx-auto gap-8">
        <div className="text-lg font-bold text-white font-headline">LandVerse</div>
        <div className="flex flex-wrap justify-center gap-8">
          <a className="font-['Manrope'] text-xs tracking-widest uppercase text-slate-500 hover:text-[#00E5FF] hover:translate-x-1 transition-all opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
          <a className="font-['Manrope'] text-xs tracking-widest uppercase text-slate-500 hover:text-[#00E5FF] hover:translate-x-1 transition-all opacity-80 hover:opacity-100" href="#">Terms of Service</a>
          <a className="font-['Manrope'] text-xs tracking-widest uppercase text-slate-500 hover:text-[#00E5FF] hover:translate-x-1 transition-all opacity-80 hover:opacity-100" href="#">Security Audit</a>
          <a className="font-['Manrope'] text-xs tracking-widest uppercase text-slate-500 hover:text-[#00E5FF] hover:translate-x-1 transition-all opacity-80 hover:opacity-100" href="#">Documentation</a>
        </div>
        <div className="font-['Manrope'] text-xs tracking-widest uppercase text-slate-600">
          © 2024 LandVerse. The Digital Architect. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
