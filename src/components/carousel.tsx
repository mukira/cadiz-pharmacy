import Link from 'next/link';
import Image from 'next/image';
import { products } from '@/lib/data';

export default function Carousel() {
  // Let's just use the first 5 products for the carousel
  const carouselProducts = products.slice(0, 5);

  return (
    <div className="w-full overflow-x-auto pb-6 pt-1 flex gap-4 snap-x snap-mandatory px-4 md:px-6">
      {carouselProducts.map((product) => (
        <div key={product.id} className="relative aspect-square h-[300px] w-[300px] max-w-full flex-none snap-start">
          <Link href={`/product/${product.slug}`} className="relative h-full w-full block group overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-blue-600">
            <Image
              alt={product.name}
              src={product.image}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-contain p-8 transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute bottom-0 left-0 flex w-full px-4 pb-4">
              <div className="flex items-center rounded-full border border-neutral-800 bg-black p-1 text-xs font-semibold text-white backdrop-blur-md">
                <h3 className="mr-4 line-clamp-1 flex-grow pl-2 leading-none tracking-tight">{product.name}</h3>
                <p className="flex-none rounded-full bg-blue-600 p-2 text-white">
                  KES {product.price.toLocaleString()}
                </p>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}
