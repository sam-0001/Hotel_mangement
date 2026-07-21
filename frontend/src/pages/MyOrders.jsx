import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate, useLocation } from 'react-router-dom';
import UserOrderCard from '../components/UserOrderCard';
import OwnerOrderCard from '../components/OwnerOrderCard';
import UserTableBookingCard from '../components/UserTableBookingCard';
import UserHallBookingCard from '../components/UserHallBookingCard';
import { setMyOrders, updateOrderStatus, updateRealtimeOrderStatus } from '../redux/userSlice';
import useGetMyHallBookings from '../hooks/useGetMyHallBookings';
import { useState } from 'react';


function MyOrders() {
  const { userData, myOrders,socket} = useSelector(state => state.user)
  const { myBookings } = useSelector(state => state.table)
  const { myHallBookings } = useGetMyHallBookings()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'orders');
  const navigate = useNavigate()
const dispatch=useDispatch()
  useEffect(()=>{
socket?.on('newOrder',(data)=>{
if(data.shopOrders?.owner._id==userData._id){
dispatch(setMyOrders([data,...myOrders]))
}
})

socket?.on('update-status',({orderId,shopId,status,userId})=>{
if(userId==userData._id){
  dispatch(updateRealtimeOrderStatus({orderId,shopId,status}))
}
})

return ()=>{
  socket?.off('newOrder')
  socket?.off('update-status')
}
  },[socket])



  
  return (
    <div className='"w-full min-h-screen bg-[#fff9f6] flex justify-center px-4'>
      <div className='w-full max-w-[800px] p-4'>

        <div className='flex items-center justify-between mb-6 '>
          <div className='flex items-center gap-[20px]'>
            <div className=' z-[10] cursor-pointer' onClick={() => navigate("/")}>
              <IoIosArrowRoundBack size={35} className='text-[#ff4d2d]' />
            </div>
            <h1 className='text-2xl font-bold  text-start'>My Activity</h1>
          </div>
        </div>

        {userData?.role === 'user' && (
          <div className='flex gap-4 mb-6 border-b pb-2 overflow-x-auto whitespace-nowrap'>
            <button 
              className={`font-bold text-lg px-2 ${activeTab === 'orders' ? 'text-[#ff4d2d] border-b-2 border-[#ff4d2d]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('orders')}
            >
              Food Orders
            </button>
            <button 
              className={`font-bold text-lg px-2 ${activeTab === 'bookings' ? 'text-[#ff4d2d] border-b-2 border-[#ff4d2d]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('bookings')}
            >
              Table Bookings
            </button>
            <button 
              className={`font-bold text-lg px-2 ${activeTab === 'hall_bookings' ? 'text-[#ff4d2d] border-b-2 border-[#ff4d2d]' : 'text-gray-500'}`}
              onClick={() => setActiveTab('hall_bookings')}
            >
              Hall Bookings
            </button>
          </div>
        )}

        <div className='space-y-6'>
          {activeTab === 'orders' && myOrders?.map((order,index)=>(
            userData.role=="user" ?
            (
              <UserOrderCard data={order} key={index}/>
            )
            :
            userData.role=="owner"? (
              <OwnerOrderCard data={order} key={index}/>
            )
            :
            null
          ))}

          {activeTab === 'bookings' && userData.role === 'user' && myBookings?.map((booking, index) => (
             <UserTableBookingCard booking={booking} key={index} />
          ))}

          {activeTab === 'bookings' && myBookings?.length === 0 && (
             <p className='text-center text-gray-500'>No table bookings found.</p>
          )}

          {activeTab === 'hall_bookings' && userData.role === 'user' && myHallBookings?.map((booking, index) => (
             <UserHallBookingCard booking={booking} key={index} />
          ))}

          {activeTab === 'hall_bookings' && myHallBookings?.length === 0 && (
             <p className='text-center text-gray-500'>No hall bookings found.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default MyOrders
