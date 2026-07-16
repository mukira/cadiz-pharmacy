'use client';

import { useCart, CartItem } from './cart-context';

export default function AddToCart({ product }: { product: CartItem }) {
  const { addItem } = useCart();

  return (
    <button
      aria-label="Add to cart"
      onClick={() => addItem(product)}
      className="relative flex w-full items-center justify-center rounded-full bg-blue-600 p-4 tracking-wide text-white hover:opacity-90"
    >
      <div className="absolute left-0 ml-4">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
      </div>
      <span>Add To Cart</span>
    </button>
  );
}
