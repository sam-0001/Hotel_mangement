import React from 'react';
import Nav from '../components/Nav';
import GallerySection from '../components/GallerySection';

function AboutUs() {
  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col pt-[80px]'>
      <Nav />
      <div className='flex-1 max-w-5xl mx-auto px-6 py-8 w-full space-y-8'>
        <div className='bg-white rounded-3xl shadow-lg p-10 space-y-8'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-extrabold text-gray-800 tracking-tight'>About Us</h1>
            <div className='w-24 h-1 bg-[#ff4d2d] mx-auto rounded-full'></div>
          </div>
          
          <div className='space-y-6 text-gray-600 text-lg leading-relaxed'>
            <p>
              Welcome to our platform! We are dedicated to providing you with the best dining and food delivery experience right at your fingertips. Our mission is to connect food lovers with their favorite local restaurants effortlessly.
            </p>
            <p>
              Whether you are craving a late-night snack, planning a family dinner, or looking to book a table for a special occasion, we have got you covered. We believe that great food brings people together, and our seamless ordering process ensures that you get what you want, when you want it.
            </p>
            <p>
              Thank you for choosing us. We are constantly innovating and expanding our services to serve you better. Your satisfaction is our top priority!
            </p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-gray-100 mt-8'>
            <div className='text-center p-6 bg-orange-50 rounded-2xl'>
              <h3 className='font-bold text-xl text-gray-800 mb-2'>Fast Delivery</h3>
              <p className='text-sm text-gray-600'>Hot and fresh food delivered straight to your door in record time.</p>
            </div>
            <div className='text-center p-6 bg-orange-50 rounded-2xl'>
              <h3 className='font-bold text-xl text-gray-800 mb-2'>Dine-In Booking</h3>
              <p className='text-sm text-gray-600'>Reserve your table in advance and skip the waiting lines.</p>
            </div>
            <div className='text-center p-6 bg-orange-50 rounded-2xl'>
              <h3 className='font-bold text-xl text-gray-800 mb-2'>Top Quality</h3>
              <p className='text-sm text-gray-600'>Partnered with only the highest-rated restaurants in your area.</p>
            </div>
          </div>
        </div>

        <div id="gallery-section">
          <GallerySection />
        </div>
      </div>
    </div>
  );
}

export default AboutUs;
