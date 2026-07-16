import fs from 'fs';
import path from 'path';
import { products, categories } from '../src/lib/data';

// Find the target product by name
const targetProductIndex = products.findIndex(p => p.name.includes('Magnesium'));

if (targetProductIndex !== -1) {
  const targetProduct = products[targetProductIndex];
  targetProduct.featured = true;
  
  products.splice(targetProductIndex, 1);
  products.unshift(targetProduct);
  
  products.forEach((p, index) => {
    p.featured = index < 3;
  });
}

const fileContent = `// Auto-generated catalog from MYDAWA scraper

export const categories = ${JSON.stringify(categories, null, 2)};

export const products = ${JSON.stringify(products, null, 2)};
`;

const dataPath = path.join(process.cwd(), 'src/lib/data.ts');
fs.writeFileSync(dataPath, fileContent);
console.log('Successfully moved Magnesium Glycinate to the top.');
