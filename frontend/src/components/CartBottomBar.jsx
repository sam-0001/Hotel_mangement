import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaChevronRight } from "react-icons/fa";

function CartBottomBar() {
    const { cartItems, totalAmount } = useSelector(state => state.user);
    const navigate = useNavigate();
    const location = useLocation();

    if (cartItems.length === 0) return null;
    if (location.pathname === '/cart' || location.pathname === '/checkout' || location.pathname.startsWith('/order-placed')) return null;

    const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
        <div className="h-24 w-full"></div>
        <div className="fixed bottom-0 left-0 right-0 z-50 p-3 md:p-4 bg-transparent pointer-events-none">
            <div className="max-w-3xl mx-auto bg-green-600 rounded-xl shadow-2xl p-3 md:p-4 flex items-center justify-between text-white pointer-events-auto cursor-pointer hover:bg-green-700 transition" onClick={() => navigate('/cart')}>
                <div className="flex items-center gap-4">
                    <div className="flex -space-x-3 overflow-hidden">
                        {cartItems.slice(0, 3).map((item, idx) => (
                            <img key={idx} className="inline-block h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-green-600 object-cover" src={item.image} alt={item.name} />
                        ))}
                        {cartItems.length > 3 && (
                            <div className="h-10 w-10 md:h-12 md:w-12 rounded-full ring-2 ring-green-600 bg-white text-green-700 flex items-center justify-center font-bold text-sm">
                                +{cartItems.length - 3}
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-bold text-lg">{totalQuantity} item{totalQuantity > 1 ? 's' : ''}</p>
                        <p className="text-sm font-medium opacity-90">₹{totalAmount} plus taxes</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 font-bold text-lg">
                    <span>View Cart</span>
                    <FaChevronRight size={14} className="mt-1"/>
                </div>
            </div>
        </div>
        </>
    );
}

export default CartBottomBar;
