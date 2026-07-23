import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { IoIosArrowRoundBack } from "react-icons/io";
import { FaPlus, FaChair, FaQrcode } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setShopTables } from '../redux/tableSlice';

function OwnerTableManagement() {
    const { myShopData } = useSelector(state => state.owner);
    const { shopTables } = useSelector(state => state.table);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [showAddModal, setShowAddModal] = useState(false);
    const [tableNumber, setTableNumber] = useState("");
    const [capacity, setCapacity] = useState(2);
    const [floor, setFloor] = useState("Main Floor");
    const [isSmokingZone, setIsSmokingZone] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!myShopData) {
            navigate('/');
            return;
        }
        fetchTables();
    }, [myShopData]);

    const fetchTables = async () => {
        try {
            const res = await axios.get(`${serverUrl}/api/table/shop/${myShopData._id}`);
            dispatch(setShopTables(res.data));
        } catch (error) {
            console.log(error);
        }
    };

    const handleAddTable = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post(`${serverUrl}/api/table/add`, {
                shopId: myShopData._id,
                tableNumber,
                capacity,
                floor,
                isSmokingZone
            }, { withCredentials: true });
            
            setShowAddModal(false);
            setTableNumber("");
            setCapacity(2);
            setIsSmokingZone(false);
            fetchTables();
        } catch (error) {
            console.log(error);
            alert(error.response?.data?.message || "Failed to add table");
        } finally {
            setLoading(false);
        }
    };

    const updateStatus = async (tableId, status) => {
        try {
            await axios.patch(`${serverUrl}/api/table/status/${tableId}`, { status }, { withCredentials: true });
            fetchTables();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteTable = async (tableId) => {
        if (!window.confirm("Are you sure you want to delete this table?")) return;
        try {
            await axios.delete(`${serverUrl}/api/table/delete/${tableId}`, { withCredentials: true });
            fetchTables();
        } catch (error) {
            console.log(error);
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
                        <h1 className='text-3xl font-bold text-gray-800'>Table Management</h1>
                    </div>
                    <button onClick={() => setShowAddModal(true)} className='flex items-center gap-2 bg-[#ff4d2d] text-white px-5 py-2.5 rounded-lg font-bold shadow hover:bg-orange-600 transition'>
                        <FaPlus /> Add Table
                    </button>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {shopTables.map((table) => (
                        <div key={table._id} className='bg-white p-5 rounded-xl shadow-md border border-gray-100 flex flex-col'>
                            <div className='flex justify-between items-start mb-4'>
                                <div>
                                    <h2 className='text-2xl font-bold text-gray-800 flex items-center gap-2'>
                                        <FaChair className="text-gray-400" /> {table.tableNumber} {table.isSmokingZone && <span className="text-sm text-red-500 ml-2" title="Smoking Zone">🚬</span>}
                                    </h2>
                                    <p className='text-sm text-gray-500 font-medium'>{table.floor}</p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                    table.status === 'Available' ? 'bg-green-100 text-green-700' :
                                    table.status === 'Occupied' ? 'bg-blue-100 text-blue-700' :
                                    table.status === 'Reserved' ? 'bg-yellow-100 text-yellow-700' :
                                    table.status === 'Cleaning' ? 'bg-orange-100 text-orange-700' :
                                    'bg-red-100 text-red-700'
                                }`}>
                                    {table.status}
                                </span>
                            </div>

                            <div className='mb-6'>
                                <p className='text-gray-600 font-medium'>Capacity: <span className='text-gray-800'>{table.capacity} Guests</span></p>
                            </div>

                            <div className='mt-auto flex flex-col gap-3'>
                                <select 
                                    value={table.status} 
                                    onChange={(e) => updateStatus(table._id, e.target.value)}
                                    className='w-full border bg-gray-50 rounded-lg p-2 text-sm font-medium outline-none'
                                >
                                    <option value="Available">Available</option>
                                    <option value="Reserved">Reserved</option>
                                    <option value="Occupied">Occupied</option>
                                    <option value="Cleaning">Cleaning</option>
                                    <option value="Maintenance">Maintenance</option>
                                    <option value="Disabled">Disabled</option>
                                </select>

                                <div className='flex gap-2'>
                                    <button onClick={() => window.open(table.qrCode, '_blank')} className='flex-1 flex justify-center items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-sm font-bold transition'>
                                        <FaQrcode /> View QR
                                    </button>
                                    <button onClick={() => deleteTable(table._id)} className='flex-1 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-bold transition'>
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {shopTables.length === 0 && (
                        <div className='col-span-full text-center py-10 bg-white rounded-xl shadow-sm border border-gray-100'>
                            <FaChair className='mx-auto text-4xl text-gray-300 mb-3' />
                            <h3 className='text-xl font-bold text-gray-600'>No Tables Found</h3>
                            <p className='text-gray-400'>Click "Add Table" to start managing dine-in seating.</p>
                        </div>
                    )}
                </div>

            </div>

            {/* Add Table Modal */}
            {showAddModal && (
                <div className='fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4'>
                    <div className='bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden'>
                        <div className='p-6'>
                            <h2 className='text-2xl font-bold text-gray-800 mb-6'>Add New Table</h2>
                            <form onSubmit={handleAddTable} className='flex flex-col gap-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 mb-1'>Table Name / Number</label>
                                    <input type="text" required value={tableNumber} onChange={e=>setTableNumber(e.target.value)} placeholder="e.g. T-1, Window-5" className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]' />
                                </div>
                                <div className='flex gap-4'>
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Capacity</label>
                                        <input type="number" required min="1" max="20" value={capacity} onChange={e=>setCapacity(e.target.value)} className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]' />
                                    </div>
                                    <div className='flex-1'>
                                        <label className='block text-sm font-medium text-gray-700 mb-1'>Floor/Area</label>
                                        <input type="text" required value={floor} onChange={e=>setFloor(e.target.value)} placeholder="Main Floor" className='w-full border rounded-lg p-2.5 outline-none focus:border-[#ff4d2d]' />
                                    </div>
                                </div>
                                <div className='flex items-center gap-2 mt-1'>
                                    <input type="checkbox" id="smokingZone" checked={isSmokingZone} onChange={e=>setIsSmokingZone(e.target.checked)} className='w-4 h-4 text-[#ff4d2d] focus:ring-[#ff4d2d] border-gray-300 rounded' />
                                    <label htmlFor="smokingZone" className='text-sm font-medium text-gray-700'>This table is in a Smoking Zone</label>
                                </div>
                                
                                <div className='flex gap-3 mt-4'>
                                    <button type="button" onClick={()=>setShowAddModal(false)} className='flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-200 transition'>Cancel</button>
                                    <button type="submit" disabled={loading} className='flex-1 bg-[#ff4d2d] text-white py-3 rounded-lg font-bold hover:bg-orange-600 transition disabled:opacity-50'>
                                        {loading ? "Adding..." : "Add Table"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OwnerTableManagement;
