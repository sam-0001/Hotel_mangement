import React, { useState } from 'react'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import CartItemCard from '../components/CartItemCard';
import axios from 'axios';
import { serverUrl } from '../App';
import { addMyOrder, clearCart } from '../redux/userSlice';

function CartPage() {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const { cartItems, totalAmount, userData } = useSelector(state => state.user)
    const [isLoading, setIsLoading] = useState(false)
    
    const dineInTableRaw = localStorage.getItem('dineInTable');
    const dineInInfo = dineInTableRaw ? JSON.parse(dineInTableRaw) : null;

    const handleDineInOrder = async () => {
        if(isLoading) return;
        setIsLoading(true);
        try {
            const payload = {
                cartItems,
                paymentMethod: "cod",
                totalAmount: totalAmount, // no delivery fee
                orderType: "dineIn",
                tableId: dineInInfo.tableId,
                tableBookingId: dineInInfo.tableBookingId || dineInInfo.bookingId
            };
            const result = await axios.post(`${serverUrl}/api/order/place-order`, payload, { withCredentials: true });
            
            // Just place the order directly and go to orders page
            dispatch(addMyOrder(result.data));
            dispatch(clearCart());
            navigate("/my-orders");
        } catch (error) {
            console.error("Error placing dine-in order:", error);
            if (error.response?.data?.message === "BOOKING_CLOSED") {
                alert("Your previous table booking has been completed or closed. Please scan the QR code to book a new table if you are still dining in.");
                localStorage.removeItem('dineInTable');
                navigate("/");
            } else {
                alert(error.response?.data?.message || "Failed to add items to table. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='min-h-screen bg-[#fff9f6] flex justify-center p-6'>
            <div className='w-full max-w-[800px]'>
                <div className='flex items-center gap-[20px] mb-6 '>
                    <div className=' z-[10] ' onClick={() => navigate("/")}>
                        <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
                    </div>
                    <h1 className='"text-2xl font-bold  text-start'>Your Cart</h1>
                </div>
                {cartItems?.length == 0 ? (
                    <p className='text-gray-500 text-lg text-center'>Your Cart is Empty</p>
                ) : (<>
                    <div className='space-y-4'>
                        {cartItems?.map((item, index) => (
                            <CartItemCard data={item} key={index} />
                        ))}
                    </div>
                    <div className='mt-6 bg-white p-4 rounded-xl shadow flex justify-between items-center border'>

                        <h1 className='text-lg font-semibold'>Total Amount</h1>
                        <span className='text-xl font-bold text-[#ff4d2d]'>₹{totalAmount}</span>
                    </div>
                    <div className='mt-4 flex flex-wrap justify-end gap-3' > 
                        {dineInInfo && (
                            <button 
                                disabled={isLoading}
                                className='bg-[#ff4d2d] text-white px-6 py-3 rounded-lg text-lg font-medium hover:bg-[#e64526] transition cursor-pointer disabled:opacity-70' 
                                onClick={()=>{
                                    if (!userData) {
                                        navigate("/signin");
                                    } else {
                                        handleDineInOrder();
                                    }
                                }}
                            >
                                {isLoading ? "Adding to Table..." : "Add to Table Order"}
                            </button>
                        )}
                        <button 
                            className={`${dineInInfo ? 'bg-white text-[#ff4d2d] border-2 border-[#ff4d2d] hover:bg-orange-50' : 'bg-[#ff4d2d] text-white hover:bg-[#e64526]'} px-6 py-3 rounded-lg text-lg font-medium transition cursor-pointer`} 
                            onClick={()=>{
                                if (!userData) {
                                    navigate("/signin");
                                } else {
                                    navigate("/checkout");
                                }
                            }}
                        >
                            Proceed to CheckOut
                        </button>
                    </div>
                </>
                )}
            </div>
        </div>
    )
}

export default CartPage
