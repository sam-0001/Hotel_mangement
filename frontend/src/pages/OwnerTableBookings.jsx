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
    const [walkinData, setWalkinData] = useState({
        customerName: "", customerMobile: "", guests: 2, preference: "Any", tableId: ""
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
        try {
            await axios.patch(`${serverUrl}/api/table-booking/update/${bookingId}`, { status, tableId }, { withCredentials: true });
            fetchBookings();
            fetchTables();
        } catch (error) {
            console.log(error);
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
            setWalkinData({ customerName: "", customerMobile: "", guests: 2, preference: "Any", tableId: "" });
            fetchBookings();
            fetchTables();
        } catch (error) {
            console.log(error);
            alert("Error creating walk-in");
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
                        <h1 className='text-3xl font-bold text-gray-800'>Reservations & Walk-ins</h1>
                    </div>
                    <button onClick={() => setShowWalkinModal(true)} className='flex items-center gap-2 bg-[#ff4d2d] text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-orange-600 transition'>
                        Walk-in Guest
                    </button>
                </div>

                <div className='space-y-4'>
                    {shopBookings.map((booking) => (
                        <div key={booking._id} className='bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6'>
                            <div className='flex-1'>
                                <div className='flex items-center gap-3 mb-2'>
                                    <h3 className='text-xl font-bold text-gray-800'>{booking.customerName}</h3>
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
                                    <div className='mt-3 bg-orange-50 p-3 rounded-lg text-sm text-orange-800'>
                                        {booking.specialOccasion && <p><strong>Occasion:</strong> {booking.specialOccasion}</p>}
                                        {booking.specialRequest && <p><strong>Request:</strong> {booking.specialRequest}</p>}
                                    </div>
                                )}
                            </div>

                            <div className='flex flex-col gap-3 min-w-[200px] w-full md:w-auto bg-gray-50 p-4 rounded-xl'>
                                <div>
                                    <label className='block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider'>Status</label>
                                    <select 
                                        value={booking.status} 
                                        onChange={(e) => updateStatus(booking._id, e.target.value)}
                                        className='w-full border rounded p-2 text-sm font-bold bg-white outline-none'
                                    >
                                        <option value="Pending">Pending</option>
                                        <option value="Confirmed">Confirmed</option>
                                        <option value="Arrived">Arrived (Eating)</option>
                                        <option value="Completed">Completed</option>
                                        <option value="Cancelled">Cancelled</option>
                                        <option value="No-Show">No-Show</option>
                                    </select>
                                </div>

                                {(booking.status === "Confirmed" || booking.status === "Arrived") && (
                                    <div>
                                        <label className='block text-xs font-bold text-gray-500 mb-1 uppercase tracking-wider'>Assign Table</label>
                                        <select 
                                            value={booking.table?._id || ""} 
                                            onChange={(e) => updateStatus(booking._id, booking.status, e.target.value)}
                                            className='w-full border rounded p-2 text-sm font-bold bg-white outline-none'
                                        >
                                            <option value="">-- Assign Table --</option>
                                            {shopTables.filter(t => t.status === "Available" || (booking.table && t._id === booking.table._id)).map(t => (
                                                <option key={t._id} value={t._id}>{t.tableNumber} ({t.capacity} seats)</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
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
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Assign Table</label>
                                        <select value={walkinData.tableId} onChange={e=>setWalkinData({...walkinData, tableId: e.target.value})} className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]'>
                                            <option value="">None</option>
                                            {shopTables.filter(t => t.status === "Available").map(t => (
                                                <option key={t._id} value={t._id}>{t.tableNumber}</option>
                                            ))}
                                        </select>
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
