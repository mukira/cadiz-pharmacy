import { notFound } from 'next/navigation';
import Image from 'next/image';
import { products } from '@/lib/data';
import AddToCart from '@/components/cart/add-to-cart';

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = products.find((p) => p.slug === slug);

  if (!product) return notFound();

  return (
    <div className="mx-auto max-w-screen-2xl px-4 pb-4 md:px-6 md:pb-6 pt-12">
      <div className="flex flex-col rounded-lg border border-neutral-200 bg-white text-black p-8 dark:border-neutral-800 dark:bg-white md:p-12 lg:flex-row lg:gap-8">
        <div className="h-full w-full basis-full lg:basis-4/6">
          <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 66vw, 100vw"
              className="object-contain"
            />
            
            <div className="absolute bottom-[15%] flex w-full justify-center">
              <div className="mx-auto flex h-11 items-center rounded-full border border-white bg-neutral-50/80 text-neutral-500 backdrop-blur dark:border-black dark:bg-neutral-900/80">
                <button aria-label="Previous image" className="flex h-full items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
                </button>
                <div className="mx-1 h-6 w-px bg-neutral-500"></div>
                <button aria-label="Next image" className="flex h-full items-center justify-center px-6 transition-all ease-in-out hover:scale-110 hover:text-black dark:hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-4">
            <button aria-label="Select product image" className="relative h-20 w-20 overflow-hidden rounded-lg border-2 border-blue-600 bg-white dark:bg-white">
              <Image src={product.image} alt={product.name} fill className="object-contain" />
            </button>
            <button aria-label="Select product image" className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-blue-600 dark:border-neutral-800 dark:bg-white dark:hover:border-blue-600">
              <Image src={product.image} alt={product.name} fill className="object-contain" />
            </button>
            <button aria-label="Select product image" className="relative h-20 w-20 overflow-hidden rounded-lg border border-neutral-200 bg-white transition hover:border-blue-600 dark:border-neutral-800 dark:bg-white dark:hover:border-blue-600">
              <Image src={product.image} alt={product.name} fill className="object-contain" />
            </button>
          </div>
        </div>

        <div className="basis-full lg:basis-2/6">
          <div className="mb-6 flex flex-col border-b border-neutral-200 pb-6 dark:border-neutral-800">
            <h1 className="mb-2 text-5xl font-medium tracking-tight">{product.name}</h1>
            <div className="mr-auto w-auto rounded-full bg-blue-600 px-4 py-2 text-sm text-white">
              KES {product.price.toLocaleString()}
            </div>
          </div>
          
          <p className="mb-6 text-sm leading-tight text-neutral-500">
            {product.description || `Category ID: ${product.categoryId}`}
          </p>

          <AddToCart product={{
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
          }} />
        </div>
      </div>
    </div>
  );
}
