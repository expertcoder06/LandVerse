import { Link } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';

const Hero = () => {
  const [loaded, setLoaded] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 150);

    const handleMouse = (e) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width - 0.5) * 20,
        y: ((e.clientY - rect.top) / rect.height - 0.5) * 20,
      });
    };

    const el = heroRef.current;
    if (el) el.addEventListener('mousemove', handleMouse);
    return () => {
      clearTimeout(timer);
      if (el) el.removeEventListener('mousemove', handleMouse);
    };
  }, []);

  return (
    <header
      id="hero"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 z-0 opacity-40">
        <div className="absolute inset-0 hero-gradient"></div>
        <img
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out"
          style={{
            transform: `translate(${mousePos.x * 0.3}px, ${mousePos.y * 0.3}px) scale(1.05)`,
          }}
          data-alt="Abstract 3D digital grid representing blockchain nodes and glowing connecting lines in a dark cosmic environment with cyan and purple hues"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuBzzReZpt3CJFlcOWZNpdHaDyJJfbT7MD_N2t0cmtU3mn-IVztKO3655FJUpml6j90b1xx39Rkg9xGjxGvmptK8Tlt1o2OqYy1ydyH4RKbzthmzvu29Kc1VOjVuKBBqQtedqDvIxtoQcAIdD5YbsTnCZzRA0Nw8bYJEd0tf3yNWqwUWs1njbVf9V94o7fZNUeh9vcnYiWiyAUyzwv6DRkRQ-zN9At1b2Ri06ii_rmYonnTEepkCfFqrRypv-vndvnrft3GO6EMDljFG"
          alt="Hero background"
        />
      </div>

      {/* Floating orbs that respond to mouse */}
      <div
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-[100px] animate-float-slow pointer-events-none"
        style={{ transform: `translate(${mousePos.x * -0.5}px, ${mousePos.y * -0.5}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-secondary/10 rounded-full blur-[80px] animate-float pointer-events-none"
        style={{ transform: `translate(${mousePos.x * 0.4}px, ${mousePos.y * 0.4}px)` }}
      />

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 text-center">
        {/* Badge */}
        <div
          className={`inline-flex items-center space-x-2 bg-surface-container-high/50 px-4 py-1.5 rounded-full mb-8 border border-outline-variant/10 transition-all duration-700 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-tertiary animate-pulse"></span>
          <span className="font-label text-[10px] tracking-[0.2em] uppercase text-on-surface-variant">
            Blockchain Verified Registry
          </span>
        </div>

        {/* Headline */}
        <h1
          className={`font-headline text-5xl md:text-7xl font-bold tracking-tight mb-6 max-w-5xl mx-auto leading-[1.1] text-glow transition-all duration-1000 delay-200 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          LandVerse – A Secure,{' '}
          <span className="text-primary italic relative">
            Transparent
            <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-primary/0 via-primary to-primary/0 animate-shimmer" />
          </span>{' '}
          &amp; NFT-Powered Land Ownership Ecosystem
        </h1>

        {/* Subtitle */}
        <p
          className={`text-on-surface-variant text-lg md:text-xl max-w-2xl mx-auto mb-10 font-light transition-all duration-1000 delay-400 ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          Transforming physical land into trusted digital assets. Secure your future through automated,
          immutable blockchain architecture.
        </p>

        {/* CTAs */}
        <div
          className={`flex flex-col sm:flex-row items-center justify-center gap-6 transition-all duration-1000 delay-[600ms] ${
            loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}
        >
          <Link
            to="/register"
            className="btn-shimmer w-full sm:w-auto px-10 py-4 rounded-lg bg-gradient-to-br from-primary to-primary-container text-on-primary-container font-headline font-bold uppercase tracking-widest text-sm hover:translate-y-[-3px] transition-all duration-300 shadow-lg shadow-primary/10 hover:shadow-xl hover:shadow-primary/20"
          >
            Explore Platform
          </Link>
          <a
            href="#demo"
            className="w-full sm:w-auto px-10 py-4 rounded-lg bg-transparent text-secondary border border-outline-variant/20 font-headline font-bold uppercase tracking-widest text-sm hover:bg-surface-container-high hover:border-secondary/40 transition-all duration-300 text-center group"
          >
            <span className="inline-flex items-center gap-2">
              View Demo
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform duration-300">
                arrow_forward
              </span>
            </span>
          </a>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant/40">
          Scroll to Explore
        </span>
        <div className="w-6 h-10 rounded-full border border-primary/30 flex items-start justify-center p-1.5">
          <div className="w-1 h-2.5 rounded-full bg-primary animate-scroll-indicator" />
        </div>
      </div>
    </header>
  );
};

export default Hero;
