import { useState, useEffect, useRef } from 'react';
import logo from '../assets/images/logo.png';

export default function TheStandard() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeStatIndex, setActiveStatIndex] = useState(-1);
  const [animatedStats, setAnimatedStats] = useState([0, 0, 0, 0]);
  const containerRef = useRef(null);
  const statsRefs = useRef([]);

    useEffect(() => {       
    const timer = setTimeout(() => {
        setIsLoaded(true);
    }, 100); // Slight delay to trigger animations
    return () => clearTimeout(timer);
  }
, []);

  const statsData = [
    { value: 850, suffix: '+', label: 'Vehicles Hand-Selected' },
    { value: 45, suffix: ' Years', label: 'Industry Excellence' },
    { value: 12, suffix: ' Brands', label: 'Curated Premium Marques' },
    { value: 2.8, suffix: 'M+ Hours', label: 'Crafted Per Vehicle', isDecimal: true }
  ];

  // Animate number counting
  const animateNumber = (index, target, isDecimal = false) => {
    const duration = 1500;
    const startTime = Date.now();

    const animate = () => {
      const progress = Math.min((Date.now() - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const newValue = isDecimal 
        ? parseFloat((target * easeOut).toFixed(1))
        : Math.floor(target * easeOut);

      setAnimatedStats(prev => {
        const updated = [...prev];
        updated[index] = newValue;
        return updated;
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setAnimatedStats(prev => {
          const updated = [...prev];
          updated[index] = target;
          return updated;
        });
      }
    };

    animate();
  };

  useEffect(() => {
    const observers = statsRefs.current.map((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setActiveStatIndex(index);
            animateNumber(index, statsData[index].value, statsData[index].isDecimal);
          }
        },
        { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' }
      );

      if (ref) observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(obs => obs.disconnect());
  }, []);

  const features = [
    { title: 'Precision', description: 'Every detail curated and vetted' },
    { title: 'Heritage', description: 'Decades of automotive excellence' },
    { title: 'Exclusivity', description: 'Only the finest makes the cut' },
    { title: 'Service', description: '24/7 dedicated concierge support' }
  ];

  return (
    <section className="relative w-full bg-black" ref={containerRef}>
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile: Column (text on top, stats below) | Desktop: Row */}
        <div className="flex flex-col lg:flex-row lg:gap-16">
          
          {/* Left Side - Sticky Philosophy (Top on mobile, sticky left on desktop) */}
          <div className="lg:w-1/2 sticky top-0 self-start h-fit lg:h-screen flex items-center z-20 bg-black">
            <div className="space-y-6 lg:space-y-12 py-12 lg:py-0">
              <div>
                <h2
                  className={`text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-4 lg:mb-6 transition-all duration-1000 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                  style={{ fontFamily: 'Cera Pro, sans-serif', lineHeight: '1.1' }}
                >
                  The Standard<span className="text-white/30">.</span>
                </h2>

                <div
                  className={`space-y-4 lg:space-y-6 transition-all duration-1000 delay-200 ${
                    isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <p className="text-base lg:text-lg text-white/80 leading-relaxed">
                    We don't just sell cars. We curate experiences for those who refuse to compromise.
                  </p>
                  <p className="text-sm lg:text-base text-white/60 leading-relaxed">
                    Every vehicle in our collection has passed through layers of scrutiny. Every interaction with our team is architected for perfection.
                  </p>
                </div>
              </div>

              {/* Features Grid */}
              <div
                className={`grid grid-cols-2 gap-4 lg:gap-6 transition-all duration-1000 delay-300 ${
                  isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                {features.map((feature, index) => (
                  <div key={index} className="space-y-1 lg:space-y-2 pb-3 lg:pb-4 border-b border-white/10 hover:border-white/30 transition-colors duration-300">
                    <h4 className="text-white font-semibold text-xs lg:text-sm tracking-widest uppercase" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {feature.title}
                    </h4>
                    <p className="text-white/50 text-xs">{feature.description}</p>
                  </div>
                ))}
              </div>

              {/* Logo */}
              <div className={`flex justify-center transition-all duration-1000 delay-400 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}>
                <img 
                  src={logo} 
                  alt="TAFA Logo" 
                  className="h-16 lg:h-24 w-auto object-contain opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Scroll-Through Stats (Numbers scroll from right to left on mobile) */}
          <div className="lg:w-1/2 relative flex justify-end lg:justify-end">
            {/* Vertical line accent - hidden on mobile */}
            <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-white/20 to-transparent" />

            <div className="w-full">
              {statsData.map((stat, index) => (
                <div
                  key={index}
                  ref={el => statsRefs.current[index] = el}
                  className="h-[60vh] lg:h-screen flex items-center justify-end pr-4 lg:pr-8"
                >
                  <div
                    className="flex flex-col items-end lg:items-center transition-all duration-1000"
                    style={{
                      opacity: activeStatIndex >= index ? 1 : 0,
                      transform: activeStatIndex >= index 
                        ? 'translateX(0) translateY(0)' 
                        : 'translateX(100px) translateY(0)',
                      transition: 'all 1s cubic-bezier(0.16, 1, 0.3, 1)'
                    }}
                  >
                    {/* Main Number */}
                    <div className="relative mb-4 flex items-baseline justify-center">
                      <span 
                        className="text-7xl sm:text-8xl lg:text-[12rem] font-bold text-white"
                        style={{ 
                          fontFamily: 'Cera Pro, sans-serif',
                          textShadow: activeStatIndex === index 
                            ? '0 0 60px rgba(255,255,255,0.15)' 
                            : 'none',
                          filter: activeStatIndex === index ? 'blur(0px)' : 'blur(8px)',
                          transform: activeStatIndex === index ? 'scale(1)' : 'scale(1.1)',
                          letterSpacing: activeStatIndex === index ? '-0.02em' : '0.05em',
                          transition: 'all 1.2s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      >
                        {stat.isDecimal ? animatedStats[index].toFixed(1) : animatedStats[index]}
                      </span>
                      <span 
                        className="text-2xl lg:text-5xl text-white/50 ml-2"
                        style={{
                          opacity: activeStatIndex === index ? 1 : 0.3,
                          transform: activeStatIndex === index ? 'translateX(0)' : 'translateX(-20px)',
                          transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s'
                        }}
                      >
                        {stat.suffix}
                      </span>
                    </div>

                    {/* Label */}
                    <p 
                      className="text-lg lg:text-2xl text-white/70 text-right lg:text-center"
                      style={{ 
                        fontFamily: 'Montserrat, sans-serif',
                        opacity: activeStatIndex === index ? 1 : 0.3,
                        transform: activeStatIndex === index ? 'translateY(0)' : 'translateY(20px)',
                        letterSpacing: activeStatIndex === index ? '0.1em' : '0',
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s'
                      }}
                    >
                      {stat.label}
                    </p>

                    {/* Accent line */}
                    <div 
                      className="mt-4 lg:mt-6 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent"
                      style={{
                        width: activeStatIndex === index ? '120px' : '0px',
                        opacity: activeStatIndex === index ? 1 : 0,
                        transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
