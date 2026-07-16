import ThreeItemGrid from '@/components/three-item-grid';
import Grid from '@/components/grid';

export default function HomePage() {
  return (
    <>
      <div className="py-8">
        <ThreeItemGrid />
      </div>
      <div className="pb-8">
        <Grid />
      </div>
    </>
  );
}
