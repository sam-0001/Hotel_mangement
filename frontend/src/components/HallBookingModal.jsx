import React, { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { useSelector } from 'react-redux';
import { FaTimes, FaCalendarAlt, FaClock, FaTags, FaUser } from 'react-icons/fa';

function HallBookingModal({ shopId, hall, onClose }) {
    const { userData } = useSelector(state => state.user);
    
    const [eventDate, setEventDate] = useState('');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [eventType, setEventType] = useState('Birthday');
    const [loading, setLoading] = useState(false);

    const eventTypes = ["Birthday", "Wedding", "Corporate Meeting", "Anniversary", "Other"];

    const handleBooking = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Calculate duration in hours
            const startStr = startTime.split(':');
            const endStr = endTime.split(':');
            const startMins = parseInt(startStr[0]) * 60 + parseInt(startStr[1]);
            const endMins = parseInt(endStr[0]) * 60 + parseInt(endStr[1]);
            let durationHours = (endMins - startMins) / 60;
            if (durationHours <= 0) {
                alert("End time must be after start time");
                setLoading(false);
                return;
            }

            const totalAmount = durationHours * hall.pricePerHour;

            const res = await axios.post(`${serverUrl}/api/hall-booking/book`, {
                shopId,
                hallId: hall._id,
                eventDate,
                startTime,
                endTime,
                eventType,
                customerName: userData?.fullName || "Guest",
                customerMobile: userData?.mobile || "9999999999",
                totalAmount
            }, { withCredentials: true });

            alert("Hall booking request sent successfully!");
            onClose();
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.message || "Failed to book hall. There might be a time overlap or invalid time.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
            <div className='bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden'>
                <div className='bg-blue-600 p-6 text-white relative'>
                    <button onClick={onClose} className='absolute top-4 right-4 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition'>
                        <FaTimes />
                    </button>
                    <h2 className='text-2xl font-bold mb-1'>Book {hall.name}</h2>
                    <p className='text-blue-100 flex items-center gap-2'>
                        <FaUser size={12} /> {hall.capacity} guests • ₹{hall.pricePerHour}/hr
                    </p>
                </div>
                
                <form onSubmit={handleBooking} className='p-6 space-y-5'>
                    <div className='space-y-4'>
                        <div>
                            <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                                <FaCalendarAlt className='text-blue-500' /> Event Date
                            </label>
                            <input 
                                type="date" 
                                required 
                                value={eventDate} 
                                onChange={(e) => setEventDate(e.target.value)} 
                                min={new Date().toISOString().split('T')[0]}
                                className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition' 
                            />
                        </div>
                        
                        <div className='grid grid-cols-2 gap-4'>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                                    <FaClock className='text-blue-500' /> Start Time
                                </label>
                                <input 
                                    type="time" 
                                    required 
                                    value={startTime} 
                                    onChange={(e) => setStartTime(e.target.value)} 
                                    className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition' 
                                />
                            </div>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                                    <FaClock className='text-blue-500' /> End Time
                                </label>
                                <input 
                                    type="time" 
                                    required 
                                    value={endTime} 
                                    onChange={(e) => setEndTime(e.target.value)} 
                                    className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition' 
                                />
                            </div>
                        </div>

                        <div>
                            <label className='flex items-center gap-2 text-sm font-bold text-gray-700 mb-2'>
                                <FaTags className='text-blue-500' /> Event Type
                            </label>
                            <select 
                                value={eventType} 
                                onChange={(e) => setEventType(e.target.value)}
                                className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white'
                            >
                                {eventTypes.map(type => (
                                    <option key={type} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='bg-blue-50 p-4 rounded-xl text-sm text-blue-800 border border-blue-100'>
                        <p className='font-semibold mb-1'>Booking Rules:</p>
                        <ul className='list-disc list-inside space-y-1 text-blue-700/80'>
                            <li>Minimum booking duration: {hall.minBookingDuration} hours</li>
                            <li>Please allow time for setup & wrap-up</li>
                        </ul>
                    </div>

                    <div className='pt-2'>
                        <button 
                            type="submit" 
                            disabled={loading} 
                            className='w-full bg-blue-600 text-white rounded-xl py-4 font-bold text-lg shadow-lg shadow-blue-200 hover:bg-blue-700 hover:shadow-xl transition disabled:opacity-80 disabled:hover:shadow-none flex items-center justify-center gap-2'
                        >
                            {loading && (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            )}
                            {loading ? "Processing..." : "Confirm Request"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default HallBookingModal;
