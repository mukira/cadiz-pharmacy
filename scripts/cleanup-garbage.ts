import fs from 'fs';
import path from 'path';
import { products, categories } from '../src/lib/data';

const validProducts = products.filter(p => p.price < 50000); // Filter out garbage prices

const fileContent = `// Auto-generated catalog from MYDAWA scraper

export const categories = ${JSON.stringify(categories, null, 2)};

export const products = ${JSON.stringify(validProducts, null, 2)};
`;

const dataPath = path.join(process.cwd(), 'src/lib/data.ts');
fs.writeFileSync(dataPath, fileContent);
console.log(`Removed ${products.length - validProducts.length} garbage products based on price. Remaining: ${validProducts.length}`);
