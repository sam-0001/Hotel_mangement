import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaCalendarAlt, FaClock, FaUsers, FaChair, FaPhone } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setShopBookings, setShopTables } from '../redux/tableSlice';
import { formatTime12Hour } from '../utils/timeFormat';

function OwnerTableBookings() {
    const { myShopData } = useSelector(state => state.owner);
    const { shopBookings, shopTables } = useSelector(state => state.table);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showWalkinModal, setShowWalkinModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [walkinData, setWalkinData] = useState({
        customerName: "", customerMobile: "", guests: 2, preference: "Any", smoking: false
    });

    useEffect(() => {
        if (!myShopData) {
            navigate('/');
            return;
        }
        fetchBookings();
        fetchTables();
    }, [myShopData]);

    const fetchBookings = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/table-booking/shop/${myShopData._id}`, { withCredentials: true });
            dispatch(setShopBookings(res.data));
        } catch (error) {
            console.log(error);
        }
    };

    const fetchTables = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/table/shop/${myShopData._id}`);
            dispatch(setShopTables(res.data));
        } catch (error) {
            console.log(error);
        }
    };

    const updateStatus = async (bookingId, status, tableId = null) => {
        // Optimistic UI Update: Make it feel instant
        const previousBookings = [...shopBookings];
        const optimisticBookings = shopBookings.map(b => 
            b._id === bookingId ? { ...b, status: status } : b
        );
        dispatch(setShopBookings(optimisticBookings));

        try {
            await axios.patch(`${serverUrl}/api/table-booking/update/${bookingId}`, { status, tableId }, { withCredentials: true });
            
            // Silently fetch fresh data in background to ensure consistency
            fetchBookings();
            fetchTables();
        } catch (error) {
            // Revert if API fails
            dispatch(setShopBookings(previousBookings));
            console.log(error);
            alert(error.response?.data?.message || "Error updating booking status");
        }
    };

    const handleWalkin = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${serverUrl}/api/table-booking/walkin`, {
                shopId: myShopData._id,
                ...walkinData,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toLocaleTimeString('en-US', { hour12: false, hour: "numeric", minute: "numeric" }),
                bookingType: "Walk-in"
            }, { withCredentials: true });
            
            setShowWalkinModal(false);
            setWalkinData({ customerName: "", customerMobile: "", guests: 2, preference: "Any", smoking: false });
            fetchBookings();
            fetchTables();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Error creating walk-in");
        }
    };

    return (
        <div className='w-full min-h-screen bg-[#fff9f6] flex flex-col items-center px-4 py-8'>
            <div className='w-full max-w-5xl'>
                <div className='flex flex-wrap items-center justify-between mb-8 gap-4'>
                    <div className='flex items-center gap-4'>
                        <div className='cursor-pointer bg-white p-2 rounded-full shadow hover:bg-gray-50' onClick={() => navigate("/")}>
                            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
                        </div>
                        <h1 className='text-3xl font-bold text-gray-800'>Reservations</h1>
                    </div>
                    
                    <div className='flex items-center gap-4 flex-1 md:max-w-sm'>
                        <input 
                            type="text" 
                            placeholder="Search name or mobile..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:border-[#ff4d2d]"
                        />
                    </div>

                    <button onClick={() => setShowWalkinModal(true)} className='flex items-center gap-2 bg-[#ff4d2d] text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-orange-600 transition whitespace-nowrap'>
                        Walk-in Guest
                    </button>
                </div>

                <div className='space-y-4'>
                    {shopBookings
                        .filter(booking => {
                            if (!searchQuery) return true;
                            const query = searchQuery.toLowerCase();
                            return booking.customerName?.toLowerCase().includes(query) || booking.customerMobile?.includes(query);
                        })
                        .map((booking) => (
                        <div key={booking._id} className='bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <h3 className='text-xl font-bold text-gray-800'>{booking.customerName}</h3>
                                    {booking.smoking && <span className='px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-700' title="Smoking Requested">🚬 Smoking</span>}
                                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                                        booking.bookingType === 'Online' ? 'bg-blue-100 text-blue-700' :
                                        booking.bookingType === 'Walk-in' ? 'bg-green-100 text-green-700' : 'bg-purple-100 text-purple-700'
                                    }`}>
                                        {booking.bookingType}
                                    </span>
                                </div>
                                <p className='text-sm text-gray-600 flex items-center gap-2 mb-3'>
                                    <FaPhone className="text-gray-400"/> {booking.customerMobile || "N/A"}
                                </p>
                                <div className='flex flex-wrap items-center gap-4 text-sm font-medium text-gray-600'>
                                    <span className='flex items-center gap-1.5'><FaCalendarAlt className="text-[#ff4d2d]" /> {new Date(booking.date).toLocaleDateString()}</span>
                                    <span className='flex items-center gap-1.5'><FaClock className="text-[#ff4d2d]" /> {formatTime12Hour(booking.time)}</span>
                                    <span className='flex items-center gap-1.5'><FaUsers className="text-[#ff4d2d]" /> {booking.guests}</span>
                                    <span className='flex items-center gap-1.5'><FaChair className="text-[#ff4d2d]" /> {booking.preference}</span>
                                </div>
                                {(booking.specialOccasion || booking.specialRequest) && (
                                    <div className='mt-3 bg-orange-50 p-3 rounded-lg text-sm text-orange-800 border border-orange-100'>
                                        {booking.specialOccasion && <p><strong>Occasion:</strong> {booking.specialOccasion}</p>}
                                        {booking.specialRequest && <p><strong>Request:</strong> {booking.specialRequest}</p>}
                                    </div>
                                )}

                                {(booking.foodOrders && booking.foodOrders.length > 0) && (
                                    <div className='mt-3 bg-blue-50 p-3 rounded-lg text-sm text-blue-800 border border-blue-100'>
                                        <h4 className='font-bold mb-2 text-blue-900 border-b border-blue-200 pb-1'>🍲 Pre-Ordered Food:</h4>
                                        {booking.foodOrders.map((shopOrder, idx) => (
                                            <div key={idx} className='mb-2 last:mb-0'>
                                                <ul className='list-disc list-inside space-y-1'>
                                                    {shopOrder.shopOrderItems.map((item, itemIdx) => (
                                                        <li key={itemIdx} className='flex justify-between items-center text-blue-900'>
                                                            <span>{item.name}</span>
                                                            <span className='font-bold px-2 py-0.5 bg-blue-100 rounded text-xs'>x{item.quantity}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col gap-3 min-w-[200px] w-full md:w-auto bg-gray-50 p-4 rounded-xl'>
                                <div className='text-sm font-bold text-gray-700 mb-2'>
                                    Table: <span className='text-[#ff4d2d]'>{booking.table ? booking.table.tableNumber : "None"}</span>
                                </div>
                                <div className='flex flex-col gap-2'>
                                    {(booking.status === 'Pending' || booking.status === 'Confirmed') && (
                                        <>
                                            <button 
                                                onClick={() => updateStatus(booking._id, 'Arrived')} 
                                                className='bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded text-sm transition'
                                            >
                                                Confirm
                                            </button>
                                            <button 
                                                onClick={() => updateStatus(booking._id, 'Cancelled')} 
                                                className='bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm transition'
                                            >
                                                Cancelled
                                            </button>
                                        </>
                                    )}
                                    {booking.status === 'Arrived' && (
                                        <button 
                                            onClick={() => updateStatus(booking._id, 'Completed')} 
                                            className='bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded text-sm transition'
                                        >
                                            Completed
                                        </button>
                                    )}
                                    {(booking.status === 'Completed' || booking.status === 'Cancelled' || booking.status === 'No-Show') && (
                                        <div className={`text-center py-2 px-4 rounded font-bold text-sm ${booking.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {booking.status}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {shopBookings.length === 0 && (
                        <div className='text-center py-12 bg-white rounded-xl shadow-sm border border-gray-100'>
                            <p className='text-gray-500 font-medium'>No reservations or walk-ins yet.</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Walk-in Modal */}
            {showWalkinModal && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden'>
                        <div className='p-6'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>New Walk-in Guest</h2>
                            <form onSubmit={handleWalkin} className='flex flex-col gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Customer Name</label>
                                    <input type="text" required value={walkinData.customerName} onChange={e=>setWalkinData({...walkinData, customerName: e.target.value})} placeholder="Walk-in Guest" className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]' />
                                </div>
                                <div className='flex gap-4'>
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Guests</label>
                                        <input type="number" required min="1" value={walkinData.guests} onChange={e=>setWalkinData({...walkinData, guests: e.target.value})} className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]' />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Smoking Request</label>
                                        <div className='flex items-center gap-2 mt-3'>
                                            <input type="checkbox" id="walkinSmoking" checked={walkinData.smoking} onChange={e=>setWalkinData({...walkinData, smoking: e.target.checked})} className='w-4 h-4 text-[#ff4d2d] focus:ring-[#ff4d2d] border-gray-300 rounded' />
                                            <label htmlFor="walkinSmoking" className='text-sm font-medium text-gray-700'>Requires Smoking Zone</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='flex gap-3 mt-4'>
                                    <button type="button" onClick={()=>setShowWalkinModal(false)} className='flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition'>Cancel</button>
                                    <button type="submit" className='flex-1 bg-[#ff4d2d] text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition'>Save Walk-in</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerTableBookings;
