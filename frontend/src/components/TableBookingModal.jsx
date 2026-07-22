import React, { useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { RxCross2 } from "react-icons/rx";

function TableBookingModal({ shopId, onClose, onSuccess }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [guests, setGuests] = useState(2);
    const [preference, setPreference] = useState("Any");
    const [smoking, setSmoking] = useState(false);
    const [specialOccasion, setSpecialOccasion] = useState("");
    const [specialRequest, setSpecialRequest] = useState("");
    const [customerName, setCustomerName] = useState("");
    const [customerMobile, setCustomerMobile] = useState("");
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMessage("");
        try {
            const result = await axios.post(`${serverUrl}/api/table-booking/book`, {
                shopId, date, time, guests, preference, smoking, specialOccasion, specialRequest, customerName, customerMobile
            }, { withCredentials: true });
            
            setSuccessMessage("Table booked successfully! You can view it in My Orders.");
            setTimeout(() => {
                if (onSuccess) {
                    onSuccess(result.data.booking || true);
                }
                onClose();
            }, 2000);
        } catch (error) {
            setErrorMessage(error.response?.data?.message || "Failed to book table");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-[99999] flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden relative max-h-[90vh] overflow-y-auto">
                <button onClick={onClose} className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 p-2 rounded-full">
                    <RxCross2 size={20} className="text-gray-700" />
                </button>
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Table</h2>
                    
                    {successMessage && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">{successMessage}</div>}
                    {errorMessage && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{errorMessage}</div>}
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                                <input type="date" required value={date} onChange={(e)=>setDate(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" min={new Date().toISOString().split('T')[0]} />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                                <input type="time" required value={time} onChange={(e)=>setTime(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" />
                            </div>
                        </div>

                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Guests</label>
                                <input type="number" min="1" max="20" required value={guests} onChange={(e)=>setGuests(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preference</label>
                                <select value={preference} onChange={(e)=>setPreference(e.target.value)} className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]">
                                    <option value="Any">Any</option>
                                    <option value="Indoor">Indoor</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Window">Window Seat</option>
                                </select>
                            </div>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                                <input type="text" required value={customerName} onChange={(e)=>setCustomerName(e.target.value)} placeholder="John Doe" className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label>
                                <input type="text" required value={customerMobile} onChange={(e)=>setCustomerMobile(e.target.value)} placeholder="9876543210" className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" />
                            </div>
                        </div>

                        <div className="flex items-center gap-2 mt-2">
                            <input type="checkbox" id="smoking" checked={smoking} onChange={(e)=>setSmoking(e.target.checked)} className="w-4 h-4 accent-[#ff4d2d]" />
                            <label htmlFor="smoking" className="text-sm text-gray-700">Smoking Area Required</label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Occasion (Optional)</label>
                            <input type="text" value={specialOccasion} onChange={(e)=>setSpecialOccasion(e.target.value)} placeholder="e.g. Birthday, Anniversary" className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d]" />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Special Request (Optional)</label>
                            <textarea value={specialRequest} onChange={(e)=>setSpecialRequest(e.target.value)} placeholder="Any special arrangements?" className="w-full border rounded-lg p-2 outline-none focus:border-[#ff4d2d] h-20 resize-none"></textarea>
                        </div>

                        <button disabled={loading} type="submit" className="w-full bg-[#ff4d2d] hover:bg-[#e64323] text-white font-bold py-3 rounded-lg transition mt-4 disabled:opacity-50">
                            {loading ? "Booking..." : "Confirm Booking"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TableBookingModal;
