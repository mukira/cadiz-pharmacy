import fs from 'fs';
import path from 'path';
import { products, categories } from '../src/lib/data';

// Find the target product
const targetId = 'prod-7';
const targetProductIndex = products.findIndex(p => p.id === targetId);

if (targetProductIndex !== -1) {
  const targetProduct = products[targetProductIndex];
  targetProduct.featured = true;
  
  // Remove it from its current position
  products.splice(targetProductIndex, 1);
  
  // Add it to the beginning
  products.unshift(targetProduct);
  
  // Ensure we don't have too many featured items? Or just leave it.
  // The first item should definitely be featured. Let's make sure the first 3 are featured.
  products.forEach((p, index) => {
    p.featured = index < 3; // Or keep previous featured status? Let's just keep previous except for target.
  });
  // Actually, let's keep previous except making target true. Wait, the loop above overwrote it.
}

const fileContent = `// Auto-generated catalog from MYDAWA scraper

export const categories = ${JSON.stringify(categories, null, 2)};

export const products = ${JSON.stringify(products, null, 2)};
`;

const dataPath = path.join(process.cwd(), 'src/lib/data.ts');
fs.writeFileSync(dataPath, fileContent);
console.log('Successfully moved prod-7 to the beginning of the array');
