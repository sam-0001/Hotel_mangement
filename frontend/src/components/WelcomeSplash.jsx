import React, { useState, useEffect } from 'react';
import logo from '../assets/logo.png';

function WelcomeSplash({ onFinish }) {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    // Start fading out at 2.5s
    const fadeTimer = setTimeout(() => {
      setFade(true);
    }, 2500);

    // Completely hide splash at 3.0s
    const hideTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 3000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-gradient-to-br from-[#1a1c23] via-[#2d1b24] to-[#1a1c23] text-white transition-opacity duration-500 ${
        fade ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Decorative glowing background elements */}
      <div className="absolute w-72 h-72 bg-[#ff4d2d]/20 rounded-full blur-3xl animate-pulse"></div>
      
      <div className="relative z-10 flex flex-col items-center px-6 text-center space-y-6 animate-fade-in-up">
        {/* Logo Container with glowing ring animation */}
        <div className="relative flex items-center justify-center p-4 bg-white/10 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl transform hover:scale-105 transition-transform duration-300">
          <div className="absolute inset-0 rounded-3xl border-2 border-[#ff4d2d]/60 animate-ping"></div>
          <img
            src={logo}
            alt="The Hometown Kitchen n cafe Restaurant Logo"
            className="h-28 sm:h-36 w-auto object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)]"
          />
        </div>

        {/* Restaurant Title */}
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-red-500 to-amber-300 drop-shadow-md">
            The Hometown Kitchen n Cafe
          </h1>
          <p className="text-base sm:text-xl font-medium text-orange-200/90 tracking-widest uppercase">
            Restaurant
          </p>
        </div>

        {/* Good Welcome Message */}
        <div className="max-w-md pt-2">
          <p className="text-sm sm:text-base text-gray-300 font-light italic leading-relaxed border-t border-b border-white/10 py-3 px-4">
            ✨ "Serving Happiness, Authentic Flavors & Warm Hospitality Every Single Day" ✨
          </p>
        </div>

        {/* Loading Bar Animation */}
        <div className="w-48 h-1.5 bg-gray-700/60 rounded-full overflow-hidden mt-4">
          <div className="h-full bg-gradient-to-r from-[#ff4d2d] to-amber-400 rounded-full animate-progress"></div>
        </div>
      </div>

      {/* Inline styles for custom splash animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-fade-in-up {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        .animate-progress {
          animation: progress 3s ease-in-out forwards;
        }
      `}</style>
    </div>
  );
}

export default WelcomeSplash;
