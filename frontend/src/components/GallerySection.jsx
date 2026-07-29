import React, { useState, useEffect } from 'react';
import { galleryImages } from '../galleryData';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function GallerySection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto scroll every 3 seconds (3000 ms)
  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    }, 3000);

    return () => clearInterval(timer);
  }, [isPaused]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
  };

  return (
    <div className="w-full bg-white rounded-3xl shadow-xl p-6 md:p-10 border border-orange-100 my-8 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-sm font-semibold tracking-wider text-[#ff4d2d] uppercase">
          Visual Feast
        </span>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-800">
          Our Restaurant Gallery
        </h2>
        <div className="w-20 h-1 bg-[#ff4d2d] mx-auto rounded-full"></div>
        <p className="text-gray-500 text-sm sm:text-base max-w-xl mx-auto pt-1">
          Explore our vibrant atmosphere, freshly cooked dishes, and cozy dining moments.
        </p>
      </div>

      {/* Main Gallery Slider */}
      <div
        className="relative w-full h-[320px] sm:h-[450px] md:h-[500px] rounded-2xl overflow-hidden group shadow-md bg-gray-900"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {galleryImages.map((image, index) => (
          <div
            key={image.id}
            className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
              index === currentIndex ? 'opacity-100 scale-100 z-10' : 'opacity-0 scale-105 z-0'
            }`}
          >
            <img
              src={image.src}
              alt={image.title}
              className="w-full h-full object-cover transform transition-transform duration-700"
            />
            {/* Gradient Overlay & Caption */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 sm:p-10">
              <span className="bg-[#ff4d2d] text-white text-xs sm:text-sm px-3 py-1 rounded-full font-bold w-fit mb-2 shadow">
                Featured #{index + 1}
              </span>
              <h3 className="text-white text-xl sm:text-3xl font-bold tracking-wide">
                {image.title}
              </h3>
            </div>
          </div>
        ))}

        {/* Left Arrow Button */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#ff4d2d] text-white p-3 rounded-full backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110"
          aria-label="Previous Slide"
        >
          <FaChevronLeft size={20} />
        </button>

        {/* Right Arrow Button */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-[#ff4d2d] text-white p-3 rounded-full backdrop-blur-md transition-all opacity-80 group-hover:opacity-100 hover:scale-110"
          aria-label="Next Slide"
        >
          <FaChevronRight size={20} />
        </button>

        {/* Auto-scroll Progress bar indicator */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-white/20 z-20">
          <div
            key={currentIndex}
            className={`h-full bg-[#ff4d2d] ${!isPaused ? 'animate-gallery-progress' : 'w-full'}`}
          ></div>
        </div>
      </div>

      {/* Thumbnails Navigation Row */}
      <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto py-2">
        {galleryImages.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentIndex(index)}
            className={`relative rounded-xl overflow-hidden shrink-0 border-2 transition-all duration-300 ${
              index === currentIndex
                ? 'border-[#ff4d2d] scale-105 shadow-md'
                : 'border-transparent opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={image.src}
              alt={`Thumbnail ${index + 1}`}
              className="w-16 sm:w-24 h-12 sm:h-16 object-cover"
            />
          </button>
        ))}
      </div>

      <style>{`
        @keyframes galleryProgress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-gallery-progress {
          animation: galleryProgress 3s linear forwards;
        }
      `}</style>
    </div>
  );
}

export default GallerySection;
