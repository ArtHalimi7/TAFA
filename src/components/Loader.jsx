import { useState, useEffect } from 'react';
import logo from '../assets/images/logo.png';

export default function Loader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    // Simulate loading progress with ease-out effect
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        const increment = Math.max(0.5, (100 - prev) / 15);
        return Math.min(100, prev + increment);
      });
    }, 40);

    // Show welcome message near completion
    const welcomeTimer = setTimeout(() => {
      setShowWelcome(true);
    }, 2000);

    // Complete loading
    const loadingTimer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onComplete?.(), 800);
      }, 500);
    }, 2800);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(welcomeTimer);
      clearTimeout(loadingTimer);
    };
  }, [onComplete]);

  return (
    <div 
      className={`fixed inset-0 bg-black z-9999 flex items-center justify-center transition-all duration-700 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Center content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo */}
        <div className="mb-12">
          <img 
            src={logo} 
            alt="TAFA" 
            className="w-20 h-20 sm:w-24 sm:h-24 object-contain"
          />
        </div>

        {/* Progress section */}
        <div className="w-40 sm:w-48">
          {/* Progress bar */}
          <div className="relative h-px bg-white/10 rounded-full overflow-hidden mb-6">
            <div 
              className="absolute inset-y-0 left-0 bg-white/80 rounded-full transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          
          {/* Text */}
          <div className="text-center">
            {showWelcome ? (
              <span 
                className="text-sm text-white/60 tracking-[0.2em] uppercase animate-fade-in"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Welcome
              </span>
            ) : (
              <span 
                className="text-xs text-white/30 tabular-nums tracking-wider"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {Math.round(progress)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}
