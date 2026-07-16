'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { SearchIcon, CartIcon, MenuIcon, LogoIcon } from '../icons';
import { categories } from '@/lib/data';

import { useCart } from '../cart/cart-context';

export default function Navbar() {
  const searchParams = useSearchParams();
  const defaultValue = searchParams.get('q') || '';
  const { cartItems, openCart } = useCart();
  
  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="flex w-full items-center">
        <div className="block flex-none md:hidden">
          <button className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white">
            <MenuIcon className="h-4 w-4" />
          </button>
        </div>
        <div className="flex w-full md:w-1/3">
          <Link href="/" className="mr-2 flex w-full items-center justify-center md:w-auto lg:mr-6">
            <div className="flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black h-[40px] w-[40px] rounded-xl">
              <LogoIcon className="h-4 w-4 fill-black dark:fill-white" />
            </div>
            <div className="ml-2 flex-none text-sm font-medium uppercase md:hidden lg:block">
              CADIZ PHARMACY
            </div>
          </Link>
          <ul className="hidden gap-6 text-sm md:flex md:items-center">
            <li>
              <Link href="/search" className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300">
                All
              </Link>
            </li>
            {categories.slice(0, 3).map((cat) => (
              <li key={cat.id}>
                <Link href={`/search/${cat.slug}`} className="text-neutral-500 underline-offset-4 hover:text-black hover:underline dark:text-neutral-400 dark:hover:text-neutral-300">
                  {cat.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="hidden justify-center md:flex md:w-1/3">
          <form action="/search" className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
            <input
              type="text"
              name="q"
              defaultValue={defaultValue}
              placeholder="Search for products..."
              autoComplete="off"
              className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
            />
            <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
              <button type="submit">
                <SearchIcon className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
        <div className="flex justify-end md:w-1/3">
          <button 
            onClick={openCart}
            className="relative flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
          >
            <CartIcon className="h-4 w-4 transition-all ease-in-out hover:scale-110" />
            {totalItems > 0 && (
              <div className="absolute right-0 top-0 -mr-2 -mt-2 h-4 w-4 rounded bg-blue-600 text-[11px] font-medium text-white flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
}
