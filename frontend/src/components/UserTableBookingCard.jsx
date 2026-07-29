import React from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaChair, FaUtensils, FaPlus } from "react-icons/fa";
import { formatTime12Hour } from '../utils/timeFormat';
import { useNavigate } from 'react-router-dom';

function UserTableBookingCard({ booking }) {
    const navigate = useNavigate();

    const statusColor = {
        "Pending": "text-yellow-600 bg-yellow-100",
        "Confirmed": "text-green-600 bg-green-100",
        "Arrived": "text-blue-600 bg-blue-100",
        "Completed": "text-gray-600 bg-gray-100",
        "Cancelled": "text-red-600 bg-red-100",
        "No-Show": "text-red-800 bg-red-200"
    };

    const handleOrderMore = () => {
        if (booking.shop?._id && booking.table?._id) {
            localStorage.setItem('dineInTable', JSON.stringify({
                shopId: booking.shop._id,
                tableId: booking.table._id,
                tableBookingId: booking._id,
                tableName: booking.table.tableNumber
            }));
            navigate(`/shop/${booking.shop._id}`);
        } else if (booking.shop?._id) {
            navigate(`/shop/${booking.shop._id}`);
        }
    };

    return (
        <div className='bg-white shadow-md rounded-xl p-6 border flex flex-col gap-4 transition hover:shadow-lg'>
            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4'>
                <div className='flex gap-4 items-center'>
                    {booking.shop?.image && (
                        <img src={booking.shop.image} alt={booking.shop.name} className='w-20 h-20 rounded-lg object-cover shadow-sm' />
                    )}
                    <div>
                        <h3 className='text-xl font-bold text-gray-800'>{booking.shop?.name || "Restaurant"}</h3>
                        <p className='text-sm text-gray-500 font-medium'>Table Reservation</p>
                        <div className='flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-600'>
                            <span className='flex items-center gap-1'><FaCalendarAlt className="text-[#ff4d2d]" /> {new Date(booking.date).toLocaleDateString()}</span>
                            <span className='flex items-center gap-1'><FaClock className="text-[#ff4d2d]" /> {formatTime12Hour(booking.time)}</span>
                            <span className='flex items-center gap-1'><FaUsers className="text-[#ff4d2d]" /> {booking.guests} Guests</span>
                            <span className='flex items-center gap-1'><FaChair className="text-[#ff4d2d]" /> {booking.preference}</span>
                        </div>
                    </div>
                </div>

                <div className='flex flex-col items-end gap-2 w-full md:w-auto'>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm ${statusColor[booking.status] || "bg-gray-100 text-gray-600"}`}>
                        {booking.status}
                    </span>
                    {booking.table && (
                        <span className='text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-md border border-gray-200'>
                            Table: <strong className='text-[#ff4d2d]'>{booking.table.tableNumber}</strong>
                        </span>
                    )}
                    
                    {/* Add More Items Button for active seated table */}
                    {(booking.status === 'Arrived' || booking.status === 'Confirmed') && (
                        <button 
                            onClick={handleOrderMore}
                            className='mt-2 w-full md:w-auto bg-[#ff4d2d] hover:bg-[#e64323] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition transform hover:scale-105'
                        >
                            <FaPlus /> Order More Items
                        </button>
                    )}
                </div>
            </div>

            {/* Total Table Bill Summary & Ordered Items */}
            {booking.foodOrders && booking.foodOrders.length > 0 && (
                <div className='mt-2 bg-orange-50/70 p-4 rounded-xl border border-orange-200/80 space-y-3'>
                    <div className='flex justify-between items-center border-b border-orange-200 pb-2'>
                        <span className='font-bold text-gray-800 flex items-center gap-2 text-sm sm:text-base'>
                            <FaUtensils className='text-[#ff4d2d]' /> Table Orders & Bill Summary
                        </span>
                        <span className='text-lg font-extrabold text-[#ff4d2d]'>
                            Total: ₹{booking.totalBill}
                        </span>
                    </div>

                    <div className='space-y-2'>
                        {booking.foodOrders.map((shopOrder, idx) => (
                            <div key={idx} className='text-sm text-gray-700 bg-white/80 p-2.5 rounded-lg border border-orange-100'>
                                <div className='flex justify-between font-semibold text-xs text-gray-500 mb-1'>
                                    <span>Order #{idx + 1}</span>
                                    <span>Subtotal: ₹{shopOrder.subtotal}</span>
                                </div>
                                <ul className='space-y-1'>
                                    {shopOrder.shopOrderItems?.map((item, itemIdx) => (
                                        <li key={itemIdx} className='flex justify-between items-center text-xs sm:text-sm'>
                                            <span>{item.name} <strong className='text-gray-500'>x{item.quantity}</strong></span>
                                            <span className='font-medium text-gray-600'>₹{item.price * item.quantity}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default UserTableBookingCard;
