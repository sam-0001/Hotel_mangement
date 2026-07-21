import React from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaChair } from "react-icons/fa";

function UserTableBookingCard({ booking }) {
    const statusColor = {
        "Pending": "text-yellow-600 bg-yellow-100",
        "Confirmed": "text-green-600 bg-green-100",
        "Arrived": "text-blue-600 bg-blue-100",
        "Completed": "text-gray-600 bg-gray-100",
        "Cancelled": "text-red-600 bg-red-100",
        "No-Show": "text-red-800 bg-red-200"
    };

    return (
        <div className='bg-white shadow-md rounded-xl p-6 border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition hover:shadow-lg'>
            <div className='flex gap-4 items-center'>
                {booking.shop?.image && (
                    <img src={booking.shop.image} alt={booking.shop.name} className='w-20 h-20 rounded-lg object-cover shadow-sm' />
                )}
                <div>
                    <h3 className='text-xl font-bold text-gray-800'>{booking.shop?.name || "Restaurant"}</h3>
                    <p className='text-sm text-gray-500 font-medium'>Table Reservation</p>
                    <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600'>
                        <span className='flex items-center gap-1'><FaCalendarAlt className="text-[#ff4d2d]" /> {new Date(booking.date).toLocaleDateString()}</span>
                        <span className='flex items-center gap-1'><FaClock className="text-[#ff4d2d]" /> {booking.time}</span>
                        <span className='flex items-center gap-1'><FaUsers className="text-[#ff4d2d]" /> {booking.guests} Guests</span>
                        <span className='flex items-center gap-1'><FaChair className="text-[#ff4d2d]" /> {booking.preference}</span>
                    </div>
                </div>
            </div>

            <div className='flex flex-col items-end gap-2'>
                <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusColor[booking.status] || "bg-gray-100 text-gray-600"}`}>
                    {booking.status}
                </span>
                {booking.table && (
                    <span className='text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded'>
                        Assigned Table: {booking.table.tableNumber}
                    </span>
                )}
            </div>
        </div>
    );
}

export default UserTableBookingCard;
