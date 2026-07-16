import fs from 'fs';
import path from 'path';

// Read the data.ts file directly as text to avoid TS module import issues
const dataPath = path.join(process.cwd(), 'src/lib/data.ts');
let dataContent = fs.readFileSync(dataPath, 'utf-8');

// We can just extract the arrays using eval or a safer way
// Let's use ts-node or just regex. Actually, we can import it since we use tsx
import { products, categories } from '../src/lib/data';

const validProducts = products.filter(p => {
  // Check if image exists
  const imagePath = path.join(process.cwd(), 'public', p.image);
  return fs.existsSync(imagePath);
});

const fileContent = `// Auto-generated catalog from MYDAWA scraper

export const categories = ${JSON.stringify(categories, null, 2)};

export const products = ${JSON.stringify(validProducts, null, 2)};
`;

fs.writeFileSync(dataPath, fileContent);
console.log(`Removed ${products.length - validProducts.length} products with broken images. Remaining: ${validProducts.length}`);
