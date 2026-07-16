'use client';

import { useCart } from './cart-context';
import Image from 'next/image';
import { useEffect } from 'react';

export default function CartModal() {
  const { cartItems, isOpen, closeCart, removeItem, updateItemQuantity } = useCart();

  // Prevent body scroll when cart is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="relative z-50">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity" 
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col bg-white dark:bg-black p-6 shadow-xl border-l border-neutral-200 dark:border-neutral-800">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">My Cart</h2>
          <button 
            onClick={closeCart} 
            className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center space-y-4 text-center text-neutral-500">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <p className="text-lg">Your cart is empty.</p>
          </div>
        ) : (
          <div className="mt-8 flex h-full flex-col justify-between overflow-y-auto">
            <ul className="flex-grow overflow-y-auto pr-2">
              {cartItems.map((item) => (
                <li key={item.id} className="flex w-full flex-col border-b border-neutral-300 dark:border-neutral-700 py-4">
                  <div className="relative flex w-full flex-row justify-between">
                    <div className="z-30 flex flex-row space-x-4">
                      <div className="relative h-16 w-16 cursor-pointer overflow-hidden rounded-md border border-neutral-300 bg-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:hover:bg-neutral-800">
                        <Image
                          fill
                          alt={item.name}
                          src={item.image}
                          className="object-contain"
                        />
                      </div>
                      <div className="flex flex-1 flex-col text-base">
                        <span className="leading-tight">{item.name}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <p className="flex justify-end space-y-2 text-right text-sm">
                        KES {item.price.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex h-9 flex-row items-center justify-between">
                    <div className="flex h-9 flex-row items-center rounded-full border border-neutral-200 dark:border-neutral-700">
                      <button 
                        className="flex h-full items-center justify-center px-2 transition-all ease-in-out hover:scale-110"
                        onClick={() => updateItemQuantity(item.id, Math.max(1, item.quantity - 1))}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" /></svg>
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button 
                        className="flex h-full items-center justify-center px-2 transition-all ease-in-out hover:scale-110"
                        onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
                      </button>
                    </div>
                    <button 
                      className="text-neutral-500 hover:text-black dark:hover:text-white"
                      onClick={() => removeItem(item.id)}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="py-4 text-sm text-neutral-500 dark:text-neutral-400">
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Taxes</p>
                <p className="text-right text-base text-black dark:text-white">
                  KES 0.00
                </p>
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Shipping</p>
                <p className="text-right text-base text-black dark:text-white">Calculated at checkout</p>
              </div>
              <div className="mb-3 flex items-center justify-between border-b border-neutral-200 pb-1 dark:border-neutral-700">
                <p>Total</p>
                <p className="text-right text-base text-black dark:text-white">
                  KES {total.toLocaleString()}
                </p>
              </div>
            </div>

            <button className="block w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white hover:opacity-90">
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
