import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeft, FaBuilding, FaMapMarkerAlt, FaUsers, FaClock, FaCheckCircle } from "react-icons/fa";
import HallBookingModal from '../components/HallBookingModal';

function ShopHalls() {
    const { shopId } = useParams();
    const navigate = useNavigate();
    const [shop, setShop] = useState(null);
    const [halls, setHalls] = useState([]);
    const [selectedHall, setSelectedHall] = useState(null);

    useEffect(() => {
        fetchShopDetails();
        fetchHalls();
    }, [shopId]);

    const fetchShopDetails = async () => {
        try {
            // Reusing item endpoint which also returns shop details
            const result = await axios.get(`${serverUrl}/api/item/get-by-shop/${shopId}`, { withCredentials: true });
            setShop(result.data.shop);
        } catch (error) {
            console.log(error);
        }
    };

    const fetchHalls = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/hall/shop/${shopId}`);
            setHalls(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='min-h-screen bg-gray-50 pb-12'>
            {shop && (
                <div className='relative w-full h-48 md:h-64 lg:h-80'>
                    <img src={shop.image} alt={shop.name} className='w-full h-full object-cover' />
                    <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10'>
                        <div className='absolute top-6 left-6 right-6 flex justify-between items-center z-10'>
                            <button className='flex items-center gap-2 bg-black/40 hover:bg-black/60 text-white px-4 py-2 rounded-full backdrop-blur-sm transition' onClick={() => navigate("/halls")}>
                                <FaArrowLeft /> Back
                            </button>
                            <button 
                                onClick={() => navigate('/my-orders', { state: { tab: 'hall_bookings' } })}
                                className='bg-white/90 hover:bg-white text-blue-600 px-4 py-2 rounded-full font-bold shadow-sm transition backdrop-blur-sm'
                            >
                                My Bookings
                            </button>
                        </div>
                        <h1 className='text-3xl md:text-5xl font-extrabold text-white mb-2 drop-shadow-md'>{shop.name} Halls</h1>
                        <div className='flex items-center gap-2 text-gray-200'>
                            <FaMapMarkerAlt className='text-blue-400' />
                            <p className='text-sm md:text-base'>{shop.address}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className='max-w-6xl mx-auto px-4 mt-8'>
                {halls.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
                        {halls.map(hall => (
                            <div key={hall._id} className='bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all flex flex-col'>
                                {hall.images && hall.images.length > 0 ? (
                                    <img src={hall.images[0]} alt={hall.name} className='w-full h-56 object-cover' />
                                ) : (
                                    <div className='w-full h-56 bg-blue-50 flex items-center justify-center text-blue-200'>
                                        <FaBuilding size={48} />
                                    </div>
                                )}
                                <div className='p-6 flex-1 flex flex-col'>
                                    <h3 className='text-2xl font-bold text-gray-800 mb-2'>{hall.name}</h3>
                                    <div className='grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-gray-600 mb-6'>
                                        <div className='flex items-center gap-2'>
                                            <FaUsers className='text-blue-500' />
                                            <span>Up to {hall.capacity} guests</span>
                                        </div>
                                        <div className='flex items-center gap-2'>
                                            <FaClock className='text-blue-500' />
                                            <span>Min {hall.minBookingDuration} hours</span>
                                        </div>
                                        <div className='flex items-center gap-2 col-span-2 text-green-600 font-medium'>
                                            <FaCheckCircle />
                                            <span>Available for Booking</span>
                                        </div>
                                    </div>
                                    <div className='mt-auto flex items-end justify-between'>
                                        <div>
                                            <p className='text-xs text-gray-500 uppercase tracking-wide font-bold'>Starting at</p>
                                            <p className='text-2xl font-black text-gray-900'>₹{hall.pricePerHour}<span className='text-base font-normal text-gray-500'>/hr</span></p>
                                        </div>
                                        <button 
                                            onClick={() => setSelectedHall(hall)}
                                            className='bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-md transition transform hover:-translate-y-0.5'
                                        >
                                            Book Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className='text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100'>
                        <FaBuilding className='mx-auto text-5xl text-gray-300 mb-4' />
                        <h2 className='text-2xl font-bold text-gray-800'>No Halls Available</h2>
                        <p className='text-gray-500 mt-2 max-w-md mx-auto'>This restaurant hasn't listed any banquet halls yet.</p>
                    </div>
                )}
            </div>

            {selectedHall && (
                <HallBookingModal 
                    shopId={shopId} 
                    hall={selectedHall} 
                    onClose={() => setSelectedHall(null)} 
                />
            )}
        </div>
    );
}

export default ShopHalls;
