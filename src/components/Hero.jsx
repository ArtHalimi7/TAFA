import React, { useEffect, useState } from 'react'
import bgImage from '../assets/images/bg.jpg'
import mercedesLogo from '../assets/images/mercedes.png'
import bmwLogo from '../assets/images/bmw.png'
import audiLogo from '../assets/images/audi.png'
import lamboLogo from '../assets/images/lambo.png'
import ferrariLogo from '../assets/images/ferrari.png'
import porscheLogo from '../assets/images/porsche.png'

const Hero = () => {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true)
    }, 100) // Slight delay to trigger animations

    return () => clearTimeout(timer)
  }, []) 

  return (
    <section className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Background Image - revealed on the right side */}
      <div 
        className={`absolute inset-0 transition-all duration-[1.5s] ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        {/* Image container with mask gradient */}
        <div 
          className="absolute inset-0"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, transparent 20%, black 50%, black 100%)'
          }}
        >
          <img 
            src={bgImage} 
            alt="" 
            className="w-full h-full object-cover object-center"
          />
        </div>
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-black/40" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col justify-center items-center lg:items-start min-h-screen px-6 sm:px-12 lg:px-24 max-w-3xl w-full lg:w-auto">
        {/* Main heading */}
        <h1 
          className={`text-center lg:text-left transition-all duration-1000 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <span className="block font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white" style={{ fontFamily: 'Cera Pro, sans-serif', fontWeight: '900', letterSpacing: '-0.02em' }}>
            AUTO TAFA
          </span>
        </h1>

        {/* Subtitle */}
        <p 
          className={`mt-6 max-w-md text-center lg:text-left text-base sm:text-lg text-neutral-300 font-light leading-relaxed transition-all duration-1000 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          style={{ fontFamily: 'Montserrat, sans-serif', letterSpacing: '0.05em' }}
        >
          Luxury automobiles for the discerning collector.
        </p>

        {/* CTA Button */}
        <div 
          className={`mt-12 transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
        >
          <button className="group relative px-8 py-4 bg-white text-black font-semibold tracking-widest uppercase text-sm transition-all duration-300 hover:bg-neutral-100 hover:shadow-[0_20px_60px_rgba(255,255,255,0.1)]" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <span className="flex items-center gap-3">
              Explore Collection
              <svg 
                className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </span>
          </button>
        </div>

        {/* Mobile Brand Showcase */}
        <div className="lg:hidden mt-24 w-full">
          <div className={`grid grid-cols-3 gap-6 justify-items-center transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { name: 'Ferrari', logo: ferrariLogo },
              { name: 'Mercedes', logo: mercedesLogo },
              { name: 'Lamborghini', logo: lamboLogo },
              { name: 'BMW', logo: bmwLogo, filter: true },
              { name: 'Porsche', logo: porscheLogo },
              { name: 'Audi', logo: audiLogo },
            ].map((brand, index) => (
              <div 
                key={index}
                className="flex items-center justify-center cursor-default"
                style={{ transitionDelay: isLoaded ? `${600 + index * 50}ms` : '0s' }}
              >
                <img 
                  src={brand.logo} 
                  alt={brand.name}
                  className="w-12 h-12 sm:w-14 sm:h-14 object-contain hover:opacity-80 transition-opacity duration-300"
                  style={brand.filter ? { filter: 'brightness(0) invert(1)' } : {}}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Brand Icons Grid - Right Side (Desktop Only) */}
      <div className="absolute right-8 lg:right-16 xl:right-20 top-1/2 -translate-y-1/2 z-20 hidden lg:flex pr-4 xl:pr-12">
        <div className={`grid grid-cols-3 gap-8 xl:gap-12 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
          {[
            { name: 'Ferrari', logo: ferrariLogo },
            { name: 'Mercedes', logo: mercedesLogo },
            { name: 'Lamborghini', logo: lamboLogo },
            { name: 'BMW', logo: bmwLogo, filter: true },
            { name: 'Porsche', logo: porscheLogo },
            { name: 'Audi', logo: audiLogo },
          ].map((brand, index) => (
            <div 
              key={index}
              className="flex items-center justify-center cursor-default"
              style={{ transitionDelay: isLoaded ? `${600 + index * 50}ms` : '0s' }}
            >
              <img 
                src={brand.logo} 
                alt={brand.name}
                className="w-16 h-16 xl:w-20 xl:h-20 object-contain hover:opacity-80 transition-opacity duration-300"
                style={brand.filter ? { filter: 'brightness(0) invert(1)' } : {}}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <div 
        className={`absolute bottom-12 left-1/2 -translate-x-1/2 z-20 transition-all duration-1000 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="flex flex-col items-center gap-3">
          <svg 
            className="w-2 h-16" 
            fill="none" 
            viewBox="0 0 4 64"
          >
            {/* Tapered line - thick at top, thin at bottom */}
            <path 
              d="M2 0 L3.5 64 L2 63 L0.5 64 Z" 
              fill="url(#taper-gradient)"
              style={{ 
                animation: 'line-draw 3s ease-in-out infinite',
                filter: 'drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))'
              }}
            />
            <defs>
              <linearGradient id="taper-gradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0.5" />
              </linearGradient>
            </defs>
          </svg>
          <div 
            className="w-1 h-1 rounded-full bg-white/60"
            style={{ 
              animation: 'dot-pulse 2s ease-in-out infinite'
            }}
          />
        </div>
      </div>

    </section>
  )
}

export default Hero