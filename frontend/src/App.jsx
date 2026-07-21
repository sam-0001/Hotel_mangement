import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import ForgotPassword from './pages/ForgotPassword'
import useGetCurrentUser from './hooks/useGetCurrentUser'
import { useDispatch, useSelector } from 'react-redux'
import Home from './pages/Home'
import useGetCity from './hooks/useGetCity'
import useGetMyshop from './hooks/useGetMyShop'
import CreateEditShop from './pages/CreateEditShop'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'
import useGetShopByCity from './hooks/useGetShopByCity'
import useGetItemsByCity from './hooks/useGetItemsByCity'
import CartPage from './pages/CartPage'
import CheckOut from './pages/CheckOut'
import OrderPlaced from './pages/OrderPlaced'
import MyOrders from './pages/MyOrders'
import useGetMyOrders from './hooks/useGetMyOrders'
import useGetMyBookings from './hooks/useGetMyBookings'
import useUpdateLocation from './hooks/useUpdateLocation'
import TrackOrderPage from './pages/TrackOrderPage'
import Shop from './pages/Shop'
import DineInRestaurants from './pages/DineInRestaurants'
import Halls from './pages/Halls'
import OwnerTableManagement from './pages/OwnerTableManagement'
import OwnerTableBookings from './pages/OwnerTableBookings'
import ShopHalls from './pages/ShopHalls'
import OwnerHallManagement from './pages/OwnerHallManagement'
import OwnerHallBookings from './pages/OwnerHallBookings'
import { useEffect } from 'react'
import { io } from 'socket.io-client'
import { setSocket } from './redux/userSlice'

import { ClipLoader } from 'react-spinners'

export const serverUrl="https://hotel-mangement-tewc.onrender.com"
function App() {
    const {userData, isAuthChecking}=useSelector(state=>state.user)
    const dispatch=useDispatch()
  useGetCurrentUser()
useUpdateLocation()
  useGetCity()
  useGetMyshop()
  useGetShopByCity()
  useGetItemsByCity()
  useGetMyOrders()
  useGetMyBookings()

  useEffect(()=>{
const socketInstance=io(serverUrl,{withCredentials:true})
dispatch(setSocket(socketInstance))
socketInstance.on('connect',()=>{
if(userData){
  socketInstance.emit('identity',{userId:userData._id})
}
})
return ()=>{
  socketInstance.disconnect()
}
  },[userData?._id])

  if (isAuthChecking) {
      return (
          <div className="flex h-screen items-center justify-center bg-[#fff9f6]">
              <ClipLoader color="#ff4d2d" size={50} />
          </div>
      )
  }

  return (
   <Routes>
    <Route path='/signup' element={!userData?<SignUp role="user"/>:<Navigate to={"/"}/>}/>
    <Route path='/owner' element={!userData?<SignUp role="owner"/>:<Navigate to={"/"}/>}/>
    <Route path='/rider' element={!userData?<SignUp role="deliveryBoy"/>:<Navigate to={"/"}/>}/>
    <Route path='/signin' element={!userData?<SignIn/>:<Navigate to={"/"}/>}/>
      <Route path='/forgot-password' element={!userData?<ForgotPassword/>:<Navigate to={"/"}/>}/>
      <Route path='/' element={<Home/>}/>
<Route path='/create-edit-shop' element={userData?<CreateEditShop/>:<Navigate to={"/signin"}/>}/>
<Route path='/add-item' element={userData?<AddItem/>:<Navigate to={"/signin"}/>}/>
<Route path='/edit-item/:itemId' element={userData?<EditItem/>:<Navigate to={"/signin"}/>}/>
<Route path='/cart' element={<CartPage/>}/>
<Route path='/checkout' element={userData?<CheckOut/>:<Navigate to={"/signin"}/>}/>
<Route path='/order-placed' element={userData?<OrderPlaced/>:<Navigate to={"/signin"}/>}/>
<Route path='/my-orders' element={userData?<MyOrders/>:<Navigate to={"/signin"}/>}/>
<Route path='/track-order/:orderId' element={userData?<TrackOrderPage/>:<Navigate to={"/signin"}/>}/>
<Route path='/shop/:shopId' element={<Shop/>}/>
<Route path='/dine-in' element={<DineInRestaurants/>}/>
<Route path='/halls' element={<Halls/>}/>
<Route path='/shop-halls/:shopId' element={<ShopHalls/>}/>
<Route path='/owner/tables' element={userData?.role==='owner'?<OwnerTableManagement/>:<Navigate to={"/"}/>}/>
<Route path='/owner/table-bookings' element={userData?.role==='owner'?<OwnerTableBookings/>:<Navigate to={"/"}/>}/>
<Route path='/owner/halls' element={userData?.role==='owner'?<OwnerHallManagement/>:<Navigate to={"/"}/>}/>
<Route path='/owner/hall-bookings' element={userData?.role==='owner'?<OwnerHallBookings/>:<Navigate to={"/"}/>}/>
   </Routes>
  )
}

export default App
