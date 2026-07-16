import { products } from '@/lib/data';
import Link from 'next/link';
import Image from 'next/image';

function ThreeItemGridItem({
  item,
  size,
  priority
}: {
  item: typeof products[0];
  size: 'full' | 'half';
  priority?: boolean;
}) {
  return (
    <div
      className={
        size === 'full'
          ? 'md:col-span-4 md:row-span-2'
          : 'md:col-span-2 md:row-span-1'
      }
    >
      <Link
        href={`/product/${item.slug}`}
        className="aspect-square md:aspect-auto group relative flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-neutral-200 bg-white p-12 md:p-24 lg:p-32 hover:border-blue-600 dark:border-neutral-800 dark:bg-white dark:hover:border-blue-600"
      >
        <Image
          className="relative h-full w-full object-contain transition duration-300 ease-in-out group-hover:scale-105"
          src={item.image}
          alt={item.name}
          width={size === 'full' ? 1080 : 540}
          height={size === 'full' ? 1080 : 540}
          priority={priority}
        />
        <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
          <div className="flex items-center rounded-full border border-neutral-800 bg-black p-1 text-xs font-semibold text-white">
            <h3 className="mr-4 line-clamp-1 flex-grow pl-2 leading-none tracking-tight">
              {item.name}
            </h3>
            <span className="flex-none rounded-full bg-blue-600 p-2 text-white">
              KES {item.price.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}

export default function ThreeItemGrid() {
  // Get first 3 products
  const threeItems = products.slice(0, 3);

  if (!threeItems[0] || !threeItems[1] || !threeItems[2]) return null;

  return (
    <section className="mx-auto grid max-w-screen-2xl gap-4 px-4 pb-4 md:grid-cols-6 md:grid-rows-2 md:h-[600px]">
      <ThreeItemGridItem size="full" item={threeItems[0]} priority={true} />
      <ThreeItemGridItem size="half" item={threeItems[1]} priority={true} />
      <ThreeItemGridItem size="half" item={threeItems[2]} />
    </section>
  );
}
