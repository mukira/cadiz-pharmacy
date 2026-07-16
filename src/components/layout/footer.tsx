import Link from 'next/link';
import { LogoIcon } from '@/components/icons';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="text-sm text-neutral-500 dark:text-neutral-400">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 border-t border-neutral-200 px-6 py-12 text-sm md:flex-row md:gap-12 md:px-4 min-[1320px]:px-0 dark:border-neutral-700">
        <div>
          <Link className="flex items-center gap-2 text-black md:pt-1 dark:text-white" href="/">
            <div className="flex flex-none items-center justify-center border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-black h-[32px] w-[32px] rounded-lg">
              <LogoIcon className="h-4 w-4 fill-black dark:fill-white" />
            </div>
            <span className="uppercase">CADIZ PHARMACY</span>
          </Link>
        </div>
        <div className="flex flex-col gap-2 md:pt-1">
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/">Home</Link>
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/about">About</Link>
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/terms">Terms &amp; Conditions</Link>
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/shipping">Shipping &amp; Return Policy</Link>
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/privacy">Privacy Policy</Link>
          <Link className="hover:text-black dark:hover:text-white transition-colors" href="/faq">FAQ</Link>
        </div>

      </div>
      <div className="border-t border-neutral-200 py-6 text-sm dark:border-neutral-700">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-1 px-4 md:flex-row md:gap-0 md:px-4 min-[1320px]:px-0">
          <p>
            &copy; 2023-{currentYear} Cadiz Pharmacy, Inc. All rights reserved.
          </p>
          <hr className="mx-4 hidden h-4 w-[1px] border-l border-neutral-400 md:inline-block" />
          <p>
            <a href="#">View the source</a>
          </p>

        </div>
      </div>
    </footer>
  );
}
