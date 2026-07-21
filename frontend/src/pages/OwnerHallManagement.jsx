import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaPlus, FaBuilding, FaTrash, FaImage } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';

function OwnerHallManagement() {
    const { myShopData } = useSelector(state => state.owner);
    const navigate = useNavigate();

    const [halls, setHalls] = useState([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [loading, setLoading] = useState(false);

    // Form states
    const [name, setName] = useState("");
    const [capacity, setCapacity] = useState(50);
    const [pricePerHour, setPricePerHour] = useState(1000);
    const [minBookingDuration, setMinBookingDuration] = useState(2);
    const [cleaningTime, setCleaningTime] = useState(1);
    const [image, setImage] = useState(null);

    useEffect(() => {
        if (!myShopData) {
            navigate('/');
            return;
        }
        fetchHalls();
    }, [myShopData]);

    const fetchHalls = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/hall/shop/${myShopData._id}`);
            setHalls(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddHall = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("shopId", myShopData._id);
            formData.append("name", name);
            formData.append("capacity", capacity);
            formData.append("pricePerHour", pricePerHour);
            formData.append("minBookingDuration", minBookingDuration);
            formData.append("cleaningTime", cleaningTime);
            if (image) {
                formData.append("images", image);
            }

            await axios.post(`${serverUrl}/api/hall/create`, formData, {
                withCredentials: true,
                headers: { "Content-Type": "multipart/form-data" }
            });

            setShowAddModal(false);
            resetForm();
            fetchHalls();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to add hall");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteHall = async (hallId) => {
        if (!window.confirm("Are you sure you want to delete this hall?")) return;
        try {
            await axios.delete(`${serverUrl}/api/hall/delete/${hallId}`, { withCredentials: true });
            fetchHalls();
        } catch (error) {
            console.log(error);
            alert("Failed to delete hall");
        }
    };

    const resetForm = () => {
        setName("");
        setCapacity(50);
        setPricePerHour(1000);
        setMinBookingDuration(2);
        setCleaningTime(1);
        setImage(null);
    };

    return (
        <div className='min-h-screen bg-[#fff9f6] p-4 sm:p-6'>
            <div className='max-w-6xl mx-auto'>
                <div className='flex items-center justify-between mb-8'>
                    <div className='flex items-center gap-4'>
                        <button onClick={() => navigate('/')} className='bg-white p-2 rounded-full shadow-sm hover:shadow-md transition'>
                            <IoIosArrowRoundBack size={30} className='text-[#ff4d2d]' />
                        </button>
                        <h1 className='text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-3'>
                            <FaBuilding className='text-[#ff4d2d]' /> Manage Halls
                        </h1>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className='bg-[#ff4d2d] text-white px-4 py-2 rounded-xl flex items-center gap-2 font-medium hover:bg-orange-600 transition shadow-md'>
                        <FaPlus /> Add Hall
                    </button>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {halls.length === 0 ? (
                        <div className='col-span-full text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm'>
                            <FaBuilding className='mx-auto text-4xl text-gray-300 mb-3' />
                            <h3 className='text-lg font-medium text-gray-900'>No halls added yet</h3>
                            <p className='text-gray-500 mt-1'>Add your first banquet hall to start accepting bookings.</p>
                        </div>
                    ) : (
                        halls.map((hall) => (
                            <div key={hall._id} className='bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition'>
                                {hall.images && hall.images.length > 0 ? (
                                    <img src={hall.images[0]} alt={hall.name} className="w-full h-48 object-cover" />
                                ) : (
                                    <div className="w-full h-48 bg-orange-50 flex items-center justify-center text-orange-200">
                                        <FaImage size={40} />
                                    </div>
                                )}
                                <div className='p-5'>
                                    <div className='flex justify-between items-start mb-3'>
                                        <h3 className='text-xl font-bold text-gray-800'>{hall.name}</h3>
                                        <button onClick={() => handleDeleteHall(hall._id)} className='text-red-500 hover:text-red-700 bg-red-50 p-2 rounded-lg'>
                                            <FaTrash size={14} />
                                        </button>
                                    </div>
                                    <div className='space-y-2 text-sm text-gray-600'>
                                        <div className='flex justify-between'><span>Capacity:</span> <span className='font-medium text-gray-800'>{hall.capacity} guests</span></div>
                                        <div className='flex justify-between'><span>Price/Hour:</span> <span className='font-medium text-gray-800'>₹{hall.pricePerHour}</span></div>
                                        <div className='flex justify-between'><span>Min Booking:</span> <span className='font-medium text-gray-800'>{hall.minBookingDuration} hours</span></div>
                                        <div className='flex justify-between'><span>Cleaning Time:</span> <span className='font-medium text-gray-800'>{hall.cleaningTime} hour(s)</span></div>
                                        <div className='flex justify-between'><span>Status:</span> <span className='font-medium text-green-600'>{hall.status}</span></div>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Add Hall Modal */}
                {showAddModal && (
                    <div className='fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm'>
                        <div className='bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl overflow-y-auto max-h-[90vh]'>
                            <div className='flex justify-between items-center mb-6'>
                                <h2 className='text-2xl font-bold text-gray-800'>Add New Hall</h2>
                                <button onClick={() => setShowAddModal(false)} className='text-gray-400 hover:text-gray-600 text-2xl'>&times;</button>
                            </div>
                            <form onSubmit={handleAddHall} className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Hall Name</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d2d] focus:border-[#ff4d2d] outline-none' placeholder="e.g. Grand Crystal Ballroom" />
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Capacity (Guests)</label>
                                        <input type="number" required min="1" value={capacity} onChange={(e) => setCapacity(e.target.value)} className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d2d] outline-none' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Price Per Hour (₹)</label>
                                        <input type="number" required min="0" value={pricePerHour} onChange={(e) => setPricePerHour(e.target.value)} className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d2d] outline-none' />
                                    </div>
                                </div>
                                <div className='grid grid-cols-2 gap-4'>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Min Booking (Hrs)</label>
                                        <input type="number" required min="1" value={minBookingDuration} onChange={(e) => setMinBookingDuration(e.target.value)} className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d2d] outline-none' />
                                    </div>
                                    <div>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Cleaning Time (Hrs)</label>
                                        <input type="number" required min="0" value={cleaningTime} onChange={(e) => setCleaningTime(e.target.value)} className='w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-[#ff4d2d] outline-none' />
                                    </div>
                                </div>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Hall Photo</label>
                                    <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} className='w-full border border-gray-300 rounded-xl p-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-[#ff4d2d] hover:file:bg-orange-100' />
                                </div>
                                <div className='pt-4 flex gap-3'>
                                    <button type="button" onClick={() => setShowAddModal(false)} className='flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50'>Cancel</button>
                                    <button type="submit" disabled={loading} className='flex-1 px-4 py-3 bg-[#ff4d2d] text-white rounded-xl font-medium hover:bg-orange-600 disabled:opacity-50'>
                                        {loading ? "Adding..." : "Add Hall"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OwnerHallManagement;
