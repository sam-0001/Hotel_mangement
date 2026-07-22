import React, { useState } from 'react'
import { FaLeaf } from "react-icons/fa";
import { FaDrumstickBite } from "react-icons/fa";
import { FaStar } from "react-icons/fa";
import { FaRegStar } from "react-icons/fa6";
import { FaMinus } from "react-icons/fa";
import { FaPlus } from "react-icons/fa";
import { FaShoppingCart } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../redux/userSlice';
import axios from 'axios';
import { serverUrl } from '../App';

function FoodCard({data}) {
const dispatch=useDispatch()
const {cartItems}=useSelector(state=>state.user)

const cartItem = cartItems.find(i => i.id === data._id);
const quantity = cartItem ? cartItem.quantity : 0;

    const renderStars=(rating)=>{   //r=3
        const stars=[];
        for (let i = 1; i <= 5; i++) {
           stars.push(
            (i<=rating)?(
                <FaStar key={i} className='text-yellow-500 text-lg ' />
            ):(
                <FaRegStar key={i} className='text-yellow-500 text-lg ' />
            )
           )
            
        }
return stars
    }

const handleIncrease=()=>{
    dispatch(addToCart({
          id:data._id,
          name:data.name,
          price:data.price,
          image:data.image,
          shop:data.shop,
          quantity: 1,
          foodType:data.foodType
    }));
}
const handleDecrease=()=>{
    if(quantity > 1){
        dispatch(updateQuantity({ id: data._id, quantity: quantity - 1 }));
    } else if(quantity === 1){
        dispatch(removeCartItem(data._id));
    }
}

  return (
    <div className='w-[250px] rounded-2xl border-2 border-[#ff4d2d] bg-white shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col relative'>
      <div className='relative w-full h-[170px] flex justify-center items-center bg-white'>
        <div className='absolute top-3 right-3 z-10 bg-white rounded-full p-1 shadow'>{data.foodType=="veg"?<FaLeaf className='text-green-600 text-lg'/>:<FaDrumstickBite className='text-red-600 text-lg'/>}</div>
        <img src={data.image} alt="" className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'/>
      </div>

      <div className="flex-1 flex flex-col p-4">
        <h1 className='font-semibold text-gray-900 text-base truncate'>{data.name}</h1>

        <div className='flex items-center gap-1 mt-1'>
        {renderStars(data.rating?.average || 0)}
        <span className='text-xs text-gray-500 ml-1'>
            {(data.rating?.average || 0).toFixed(1)} / 5 ({data.rating?.count || 0} reviews)
        </span>
        </div>
      </div>

      <div className='flex items-center justify-between mt-auto p-3'>
        <span className='font-bold text-gray-900 text-lg'>
            ₹{data.price}
        </span>

        {quantity > 0 ? (
            <div className='flex items-center border rounded-lg bg-green-50 overflow-hidden shadow-sm'>
                <button className='px-3 py-1 hover:bg-green-200 text-green-700 transition font-bold' onClick={handleDecrease}>
                    <FaMinus size={12}/>
                </button>
                <span className='px-2 font-bold text-green-700'>{quantity}</span>
                <button className='px-3 py-1 hover:bg-green-200 text-green-700 transition font-bold' onClick={handleIncrease}>
                    <FaPlus size={12}/>
                </button>
            </div>
        ) : (
            <button className='border border-[#ff4d2d] text-[#ff4d2d] font-bold px-6 py-1 rounded-lg hover:bg-[#ff4d2d] hover:text-white transition' onClick={handleIncrease}>
                ADD
            </button>
        )}
      </div>
    </div>
  )
}

export default FoodCard
