import Link from 'next/link';
import Image from 'next/image';
import { products as allProducts } from '@/lib/data';

export default function Grid({ products = allProducts }: { products?: typeof allProducts }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 px-4 md:px-6">
      {products.map((product) => (
        <div key={product.id} className="relative aspect-square w-full">
          <Link href={`/product/${product.slug}`} className="relative h-full w-full block group overflow-hidden rounded-lg border border-neutral-200 bg-white hover:border-blue-600 dark:border-neutral-800 dark:bg-white dark:hover:border-blue-600">
            <Image
              alt={product.name}
              src={product.image}
              fill
              sizes="(min-width: 1024px) 25vw, (min-width: 768px) 33vw, 50vw"
              className="object-contain p-12 md:p-16 transition-transform duration-300 group-hover:scale-105"
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
