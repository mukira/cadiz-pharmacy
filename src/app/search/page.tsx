import Grid from '@/components/grid';
import { products } from '@/lib/data';

export const metadata = {
  title: 'Search | MYDAWA Clone',
  description: 'Search for products in our catalog.',
};

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const { q } = await searchParams;
  const searchQuery = typeof q === 'string' ? q : '';

  const results = searchQuery
    ? products.filter((product) =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : products;

  return (
    <div className="mx-auto flex max-w-screen-2xl flex-col gap-8 px-4 pb-4 text-black md:flex-row dark:text-white">
      <div className="order-first w-full flex-none md:max-w-[125px]">
        {/* We can add category filters here later */}
      </div>
      <div className="order-last min-h-screen w-full md:order-none">
        {searchQuery ? (
          <p className="mb-4">
            {results.length === 0
              ? 'There are no products that match '
              : `Showing ${results.length} ${results.length === 1 ? 'result' : 'results'} for `}
            <span className="font-bold">&quot;{searchQuery}&quot;</span>
          </p>
        ) : null}
        {results.length > 0 ? (
          <Grid products={results} />
        ) : null}
      </div>
      <div className="order-none flex-none md:order-last md:w-[125px]">
        {/* We can add sort options here later */}
      </div>
    </div>
  );
}
