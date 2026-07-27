import React from 'react';
import Nav from '../components/Nav';
import { FaWhatsapp, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

function ContactUs() {
  const whatsappNumber = "917350484629";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20services!`;

  return (
    <div className='min-h-screen bg-[#fff9f6] flex flex-col'>
      <Nav />
      <div className='flex-1 max-w-4xl mx-auto px-6 py-12 w-full'>
        <div className='bg-white rounded-3xl shadow-lg p-10 space-y-8'>
          <div className='text-center space-y-4'>
            <h1 className='text-4xl font-extrabold text-gray-800 tracking-tight'>Contact Us</h1>
            <div className='w-24 h-1 bg-[#ff4d2d] mx-auto rounded-full'></div>
            <p className='text-gray-500 mt-4 text-lg'>We would love to hear from you! Reach out to us through any of the channels below.</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-10'>
            <div className='space-y-6'>
              
              <a href={whatsappLink} target='_blank' rel='noopener noreferrer' className='flex items-center gap-4 p-5 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition group'>
                <div className='bg-green-500 p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform'>
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>WhatsApp Us</h3>
                  <p className='text-gray-600 text-sm'>+91 73504 84629</p>
                </div>
              </a>

              <div className='flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-blue-500 p-3 rounded-full text-white shadow-md'>
                  <FaPhone size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Call Us</h3>
                  <p className='text-gray-600 text-sm'>+91 73504 84629</p>
                </div>
              </div>

              <div className='flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-purple-500 p-3 rounded-full text-white shadow-md'>
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Email Us</h3>
                  <p className='text-gray-600 text-sm'>support@hometownkitchen.com</p>
                </div>
              </div>

              <div className='flex items-center gap-4 p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-red-500 p-3 rounded-full text-white shadow-md'>
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Our Location</h3>
                  <p className='text-gray-600 text-sm'>The Hometown Kitchen n cafe Restaurant</p>
                </div>
              </div>

            </div>

            <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100'>
              <h3 className='text-2xl font-bold text-gray-800 mb-6'>Send us a Message</h3>
              <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); window.open(whatsappLink, '_blank'); }}>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Your Name</label>
                  <input type='text' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition' placeholder='John Doe' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Message</label>
                  <textarea rows={4} className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition' placeholder='How can we help you?'></textarea>
                </div>
                <button type='submit' className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2'>
                  <FaWhatsapp size={20} />
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
