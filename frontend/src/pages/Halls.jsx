import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/Nav.jsx';
import { FaLocationDot, FaStore } from "react-icons/fa6";
import { FaBuilding } from "react-icons/fa";

function Halls() {
    const { shopInMyCity } = useSelector(state => state.user);
    const navigate = useNavigate();

    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
            <Nav />
            <div className='w-full max-w-6xl px-4 py-8 mt-[80px]'>
                <div className='mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4'>
                    <div>
                        <h1 className='text-3xl md:text-4xl font-extrabold text-gray-800 mb-2'>Event Halls</h1>
                        <p className='text-gray-600 text-lg'>Discover and book the best banquet halls and event spaces in your city.</p>
                    </div>
                    <button 
                        onClick={() => navigate('/my-orders', { state: { tab: 'hall_bookings' } })}
                        className='bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 font-bold py-2 px-6 rounded-xl transition shadow-sm'
                    >
                        My Bookings
                    </button>
                </div>

                {shopInMyCity && shopInMyCity.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                        {shopInMyCity.map((shop) => (
                            <div key={shop._id} className='bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col'>
                                <div className='relative h-48'>
                                    <img src={shop.image} alt={shop.name} className='w-full h-full object-cover' />
                                    <div className='absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4'>
                                        <h2 className='text-white text-2xl font-bold truncate'>{shop.name}</h2>
                                    </div>
                                </div>
                                <div className='p-5 flex-1 flex flex-col'>
                                    <div className='flex items-start gap-2 text-gray-500 mb-4'>
                                        <FaLocationDot className='text-blue-500 mt-1 shrink-0' />
                                        <p className='text-sm line-clamp-2'>{shop.address}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/shop-halls/${shop._id}`)} 
                                        className='mt-auto w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition'
                                    >
                                        <FaBuilding /> View Halls
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <FaStore className='text-6xl text-gray-300 mb-4' />
                        <h2 className='text-2xl font-bold text-gray-700 mb-2'>No Halls Found</h2>
                        <p className='text-gray-500 max-w-md'>We couldn't find any restaurants or halls in your current city. Please check back later or change your location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Halls;
