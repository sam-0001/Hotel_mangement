import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaClipboardList, FaCheck, FaTimes } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { formatTime12Hour } from '../utils/timeFormat';

function OwnerHallBookings() {
    const { myShopData } = useSelector(state => state.owner);
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        if (!myShopData) {
            navigate('/');
            return;
        }
        fetchBookings();
    }, [myShopData]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/hall-booking/owner/${myShopData._id}`, { withCredentials: true });
            setBookings(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleUpdateStatus = async (bookingId, status) => {
        try {
            await axios.put(`${serverUrl}/api/hall-booking/update-status/${bookingId}`, { status }, { withCredentials: true });
            fetchBookings();
        } catch (error) {
            console.log(error);
            alert("Failed to update status");
        }
    };

    return (
        <div className='min-h-screen bg-[#fff9f6] p-4 sm:p-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center gap-4 mb-8'>
                    <button onClick={() => navigate('/')} className='bg-white p-2 rounded-full shadow-sm hover:shadow-md transition'>
                        <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
                    </button>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                        <FaClipboardList className='text-[#ff4d2d]' /> Hall Bookings
                    </h1>
                </div>

                <div className='space-y-4'>
                    {bookings.length === 0 ? (
                        <div className='text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm'>
                            <FaClipboardList className='mx-auto text-4xl text-gray-300 mb-3' />
                            <h3 className='text-lg font-medium text-gray-900'>No bookings yet</h3>
                            <p className='text-gray-500 mt-1'>When customers book your halls, they will appear here.</p>
                        </div>
                    ) : (
                        bookings.map(booking => (
                            <div key={booking._id} className='bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition'>
                                <div className='flex flex-col md:flex-row justify-between md:items-center gap-4'>
                                    <div>
                                        <h3 className='text-lg font-bold text-gray-800'>{booking.hall?.name || "Unknown Hall"}</h3>
                                        <div className='text-sm text-gray-600 mt-1'>
                                            <p><span className='font-medium'>Customer:</span> {booking.customerName} ({booking.customerMobile})</p>
                                            <p><span className='font-medium'>Date:</span> {new Date(booking.eventDate).toLocaleDateString()}</p>
                                            <p><span className='font-medium'>Time:</span> {formatTime12Hour(booking.startTime)} - {formatTime12Hour(booking.endTime)}</p>
                                            <p><span className='font-medium'>Event Type:</span> {booking.eventType}</p>
                                        </div>
                                    </div>
                                    <div className='flex flex-col gap-2 min-w-[150px]'>
                                        <div className={`text-center py-1 px-3 rounded-full text-sm font-medium ${
                                            booking.status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                                            booking.status === 'Confirmed' ? 'bg-green-100 text-green-700' :
                                            booking.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                                            'bg-gray-100 text-gray-700'
                                        }`}>
                                            {booking.status}
                                        </div>
                                        
                                        {booking.status === 'Pending' && (
                                            <div className='flex gap-2 mt-2'>
                                                <button onClick={() => handleUpdateStatus(booking._id, 'Confirmed')} className='flex-1 bg-green-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-green-600 transition'>
                                                    <FaCheck size={12} /> Approve
                                                </button>
                                                <button onClick={() => handleUpdateStatus(booking._id, 'Cancelled')} className='flex-1 bg-red-500 text-white py-1.5 rounded-lg flex items-center justify-center gap-1 hover:bg-red-600 transition'>
                                                    <FaTimes size={12} /> Reject
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default OwnerHallBookings;
