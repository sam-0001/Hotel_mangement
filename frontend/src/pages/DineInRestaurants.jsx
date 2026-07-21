import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Nav from '../components/NaV.JSX';
import { FaLocationDot, FaStore } from "react-icons/fa6";
import { FaCalendarAlt } from "react-icons/fa";

function DineInRestaurants() {
    const { shopInMyCity } = useSelector(state => state.user);
    const navigate = useNavigate();

    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center'>
            <Nav />
            <div className='w-full max-w-6xl px-4 py-8 mt-[80px]'>
                <div className='mb-8'>
                    <h1 className='text-3xl md:text-4xl font-extrabold text-gray-800 mb-2'>Dine-In Reservations</h1>
                    <p className='text-gray-600 text-lg'>Discover and book the best tables in town for your perfect meal.</p>
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
                                        <FaLocationDot className='text-[#ff4d2d] mt-1 shrink-0' />
                                        <p className='text-sm line-clamp-2'>{shop.address}</p>
                                    </div>
                                    <button 
                                        onClick={() => navigate(`/shop/${shop._id}`)} 
                                        className='mt-auto w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition'
                                    >
                                        <FaCalendarAlt /> Book a Table
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center py-20 text-center'>
                        <FaStore className='text-6xl text-gray-300 mb-4' />
                        <h2 className='text-2xl font-bold text-gray-700 mb-2'>No Restaurants Found</h2>
                        <p className='text-gray-500 max-w-md'>We couldn't find any restaurants offering dine-in in your current city. Please check back later or change your location.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DineInRestaurants;
