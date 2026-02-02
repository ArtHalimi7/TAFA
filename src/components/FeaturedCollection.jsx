import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import mercedesgt63s from '../assets/images/mercedesgt63s.jpg';
import bmw7 from '../assets/images/bmw7.jpg';
import audirs7 from '../assets/images/audirs7.jpg';

export default function FeaturedCollection() {
  const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {       
    const timer = setTimeout(() => {
        setIsLoaded(true);
    }, 100); // Slight delay to trigger animations
    return () => clearTimeout(timer);
  }
, []);

  const vehicles = [
    {
      id: 1,
      name: 'Mercedes-AMG GT 63 S',
      slug: 'mercedes-amg-gt-63-s',
      category: 'Performance',
      price: '$185,000',
      image: mercedesgt63s
    },
    {
      id: 2,
      name: 'BMW M760i xDrive',
      slug: 'bmw-m760i-xdrive',
      category: 'Luxury Sedan',
      price: '$155,000',
      image: bmw7
    },
    {
      id: 3,
      name: 'Audi RS e-tron GT',
      slug: 'audi-rs-etron-gt',
      category: 'Electric',
      price: '$142,000',
      image: audirs7
    }
  ];

  return (
    <section className="relative w-full py-20 lg:py-32 bg-black overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-24">
          <h2 
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 transition-all duration-1000 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
            style={{ fontFamily: 'Cera Pro, sans-serif' }}
          >
            Featured Collection
          </h2>
          <div 
            className={`w-16 h-1 bg-white mx-auto mb-6 transition-all duration-1000 delay-100 ${
              isLoaded ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
            }`}
            style={{ transformOrigin: 'center' }}
          />
          <p 
            className={`text-gray-400 text-lg lg:text-xl max-w-2xl mx-auto transition-all duration-1000 delay-200 ${
              isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Curated selection of the world's most prestigious automotive masterpieces
          </p>
        </div>

        {/* Vehicle Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-6">
          {vehicles.map((vehicle, index) => (
            <Link
              to={`/car/${vehicle.slug}`}
              key={vehicle.id}
              className={`group relative transition-all duration-1000 ${
                isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              {/* Card Container */}
              <div className="relative h-96 rounded-lg overflow-hidden cursor-pointer">
                {/* Background Image */}
                <img 
                  src={vehicle.image}
                  alt={vehicle.name}
                  className="absolute inset-0 w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent opacity-60 group-hover:opacity-50 transition-opacity duration-500" />

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-between p-6">
                  {/* Top - Category Badge */}
                  <div>
                    <div className="inline-block px-3 py-1 border border-white/40 rounded-full">
                      <span className="text-xs font-light text-white/80 tracking-widest uppercase">
                        {vehicle.category}
                      </span>
                    </div>
                  </div>

                  {/* Bottom - Name and Price */}
                  <div className="space-y-3">
                    <h3 
                      className="text-2xl font-bold text-white transition-all duration-300 group-hover:translate-y-0 translate-y-2"
                      style={{ fontFamily: 'Cera Pro, sans-serif' }}
                    >
                      {vehicle.name}
                    </h3>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <span className="text-lg font-semibold text-white">
                        {vehicle.price}
                      </span>
                      <div className="w-8 h-8 rounded-full border border-white/40 flex items-center justify-center group-hover:border-white/100 group-hover:bg-white/10 transition-all duration-300">
                        <span className="text-white/70 group-hover:text-white transition-colors duration-300">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Glow Border Effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-white/20 via-white/5 to-white/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
            </Link>
          ))}
        </div>

        {/* CTA Button */}
        <div 
          className={`text-center mt-16 lg:mt-24 transition-all duration-1000 delay-500 ${
            isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <button 
            className="px-10 py-4 border border-white text-white font-semibold hover:bg-white hover:text-black transition-all duration-300 rounded-lg"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Explore Full Collection
          </button>
        </div>
      </div>
    </section>
  );
}
