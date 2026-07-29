import React, { useEffect, useRef, useState } from 'react'
import Nav from './Nav.jsx'
import { categories } from '../category'
import CategoryCard from './CategoryCard'
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import { FaMapMarkerAlt, FaWhatsapp, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import FoodCard from './FoodCard';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../App';
import GallerySection from './GallerySection';

function UserDashboard() {
  const {currentCity,shopInMyCity,itemsInMyCity,searchItems}=useSelector(state=>state.user)
  const cateScrollRef=useRef()
  const navigate = useNavigate()
  const [showLeftCateButton,setShowLeftCateButton]=useState(false)
  const [showRightCateButton,setShowRightCateButton]=useState(false)

  const [updatedItemsList,setUpdatedItemsList]=useState([])

const handleFilterByCategory=(category)=>{
if(category=="All"){
  setUpdatedItemsList(itemsInMyCity)
}else{
  const filteredList=itemsInMyCity?.filter(i=>i.category===category)
  setUpdatedItemsList(filteredList)
}

}

useEffect(()=>{
setUpdatedItemsList(itemsInMyCity)
},[itemsInMyCity])


  const updateButton=(ref,setLeftButton,setRightButton)=>{
const element=ref.current
if(element){
setLeftButton(element.scrollLeft>0)
setRightButton(element.scrollLeft+element.clientWidth<element.scrollWidth)

}
  }
  const scrollHandler=(ref,direction)=>{
    if(ref.current){
      ref.current.scrollBy({
        left:direction=="left"?-200:200,
        behavior:"smooth"
      })
    }
  }




  useEffect(()=>{
    if(cateScrollRef.current){
      updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      cateScrollRef.current.addEventListener('scroll',()=>{
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      })
    }

    return ()=>{cateScrollRef?.current?.removeEventListener("scroll",()=>{
        updateButton(cateScrollRef,setShowLeftCateButton,setShowRightCateButton)
      })
    }
  },[categories])


  return (
    <div className='w-screen min-h-screen flex flex-col gap-5 items-center bg-[#fff9f6] overflow-y-auto'>
      <Nav />

      {searchItems && searchItems.length>0 && (
        <div className='w-full max-w-6xl flex flex-col gap-5 items-start p-5 bg-white shadow-md rounded-2xl mt-4'>
<h1 className='text-gray-900 text-2xl sm:text-3xl font-semibold border-b border-gray-200 pb-2'>
  Search Results
</h1>
<div className='w-full h-auto flex flex-wrap gap-6 justify-center'>
  {searchItems.map((item)=>(
    <FoodCard data={item} key={item._id}/>
  ))}
</div>
        </div>
      )}

      <div className="w-full max-w-6xl flex flex-col gap-5 items-start p-[10px]">

        <div className="w-full flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 bg-gradient-to-r from-orange-100 to-orange-50 rounded-2xl p-6 shadow-sm border border-orange-200 flex items-center justify-between cursor-pointer hover:shadow-md transition" onClick={()=>navigate("/dine-in")}>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Dine-In Reservations</h2>
              <p className="text-gray-600">Book a table in advance</p>
            </div>
            <button className="bg-[#ff4d2d] text-white px-5 py-2.5 rounded-xl font-bold shadow hover:bg-orange-600 transition">Book Table</button>
          </div>
          <div className="flex-1 bg-gradient-to-r from-blue-100 to-blue-50 rounded-2xl p-6 shadow-sm border border-blue-200 flex items-center justify-between cursor-pointer hover:shadow-md transition" onClick={()=>navigate("/halls")}>
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">Event Halls</h2>
              <p className="text-gray-600">Celebrate your special occasions</p>
            </div>
            <button className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow hover:bg-blue-700 transition">Book Hall</button>
          </div>
        <div id="gallery-section" className='w-full max-w-6xl px-[10px] my-2'>
          <GallerySection />
        </div>

        <h1 className='text-gray-800 text-2xl sm:text-3xl font-bold mt-4'>Inspiration for your first order</h1>
        <div className='w-full relative'>
          {showLeftCateButton &&  <button className='absolute left-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"left")}><FaCircleChevronLeft />
          </button>}

          <div className='w-full flex overflow-x-auto gap-4 pb-2 ' ref={cateScrollRef}>
            {categories.map((cate, index) => (
              <CategoryCard name={cate.category} image={cate.image} key={index} onClick={()=>handleFilterByCategory(cate.category)}/>
            ))}
          </div>
          {showRightCateButton &&  <button className='absolute right-0 top-1/2 -translate-y-1/2 bg-[#ff4d2d] text-white p-2 rounded-full shadow-lg hover:bg-[#e64528] z-10' onClick={()=>scrollHandler(cateScrollRef,"right")}>
            <FaCircleChevronRight />
          </button>}
        </div>
      </div>
       <h1 className='text-gray-800 text-2xl sm:text-3xl font-bold'>
        Suggested Food Items
       </h1>

<div className='w-full h-auto flex flex-wrap gap-[20px] justify-center'>
{!itemsInMyCity ? (
  <div className="flex w-full justify-center py-10">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ff4d2d]"></div>
  </div>
) : updatedItemsList?.map((item,index)=>(
  <FoodCard key={index} data={item}/>
))}
</div>
      </div>

      <div id="contact-us-section" className='w-full max-w-6xl flex flex-col gap-5 items-start p-[10px] pb-10'>
        <div className='w-full bg-white rounded-3xl shadow-lg p-6 sm:p-10 space-y-8 border border-gray-100'>
          <div className='text-center space-y-3'>
            <h2 className='text-3xl sm:text-4xl font-extrabold text-gray-800 tracking-tight'>Contact Us</h2>
            <div className='w-24 h-1 bg-[#ff4d2d] mx-auto rounded-full'></div>
            <p className='text-gray-500 text-base sm:text-lg'>We would love to hear from you! Reach out to us through any of the channels below.</p>
          </div>
          
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 mt-6'>
            <div className='space-y-4 sm:space-y-6'>
              
              <a href="https://wa.me/917350484629?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20services!" target='_blank' rel='noopener noreferrer' className='flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-green-200 bg-green-50 hover:bg-green-100 transition group'>
                <div className='bg-green-500 p-3 rounded-full text-white shadow-md group-hover:scale-110 transition-transform shrink-0'>
                  <FaWhatsapp size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>WhatsApp Us</h3>
                  <p className='text-gray-600 text-sm'>+91 73504 84629</p>
                </div>
              </a>

              <div className='flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-blue-500 p-3 rounded-full text-white shadow-md shrink-0'>
                  <FaPhone size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Call Us</h3>
                  <p className='text-gray-600 text-sm'>+91 73504 84629</p>
                </div>
              </div>

              <div className='flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-purple-500 p-3 rounded-full text-white shadow-md shrink-0'>
                  <FaEnvelope size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Email Us</h3>
                  <p className='text-gray-600 text-sm break-all'>support@hometownkitchen.com</p>
                </div>
              </div>

              <div className='flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-gray-100 bg-gray-50'>
                <div className='bg-red-500 p-3 rounded-full text-white shadow-md shrink-0'>
                  <FaMapMarkerAlt size={24} />
                </div>
                <div>
                  <h3 className='font-bold text-gray-800 text-lg'>Our Location</h3>
                  <p className='text-gray-600 text-sm'>The Hometown Kitchen n cafe Restaurant</p>
                </div>
              </div>

            </div>

            <div className='bg-gray-50 p-6 rounded-2xl border border-gray-100'>
              <h3 className='text-2xl font-bold text-gray-800 mb-6'>Send us a Message</h3>
              <form className='space-y-4' onSubmit={(e) => { e.preventDefault(); window.open("https://wa.me/917350484629?text=Hi,%20I%20would%20like%20to%20know%20more%20about%20your%20services!", '_blank'); }}>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Your Name</label>
                  <input type='text' className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition bg-white' placeholder='John Doe' />
                </div>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>Message</label>
                  <textarea rows={4} className='w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:border-[#ff4d2d] focus:ring-1 focus:ring-[#ff4d2d] transition bg-white' placeholder='How can we help you?'></textarea>
                </div>
                <button type='submit' className='w-full bg-[#ff4d2d] hover:bg-[#e64526] text-white py-3 rounded-xl font-bold transition shadow-md flex items-center justify-center gap-2'>
                  <FaWhatsapp size={20} />
                  Send via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className='w-full bg-white mt-auto py-12 border-t border-gray-200 flex flex-col items-center justify-center gap-6 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]'>
        <div className='text-center'>
          <h2 className='text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight'>Locate Us on Maps</h2>
          <p className='text-gray-500 mt-2'>Visit The Hometown Kitchen n cafe Restaurant in person!</p>
        </div>

        <div className='w-[90%] max-w-[400px] aspect-square rounded-2xl overflow-hidden shadow-md border border-gray-200 bg-gray-100'>
          <iframe 
            title="Restaurant Location"
            src="https://maps.google.com/maps?q=The+Hometown+Kitchen+n+cafe+Restaurant,+Yavatmal&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            width="100%" 
            height="100%" 
            frameBorder="0" 
            style={{ border: 0 }} 
            allowFullScreen="" 
            aria-hidden="false" 
            tabIndex="0">
          </iframe>
        </div>

        <a 
          href="https://maps.app.goo.gl/mANDxbKZhdFRii8H8?g_st=iw" 
          target="_blank" 
          rel="noopener noreferrer" 
          className='flex items-center gap-2 bg-[#ff4d2d] hover:bg-[#e64526] text-white px-8 py-4 rounded-full font-bold shadow-lg transition-transform hover:scale-105 mt-2'
        >
          <FaMapMarkerAlt size={22} /> Get Directions
        </a>
      </div>

    </div>
  )
}

export default UserDashboard
