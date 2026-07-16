import fs from 'fs';
import path from 'path';
import csvParser from 'csv-parser';
import axios from 'axios';

const CSV_FILE = 'mydawa_catalog.csv';
const OUTPUT_FILE = 'src/lib/data.ts';
const IMAGES_DIR = 'public/images/products';

interface CsvRow {
  name: string;
  price: string;
  description: string;
  image: string;
  category: string;
  url: string;
}

function generateSlug(str: string) {
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

async function downloadImage(url: string, filename: string) {
  if (!url) return '';
  try {
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    
    const imagePath = path.join(IMAGES_DIR, filename);
    const writer = fs.createWriteStream(imagePath);
    
    response.data.pipe(writer);
    
    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(true));
      writer.on('error', reject);
    });
  } catch (error: any) {
    console.error(`Error downloading image ${url}:`, error.message);
    return null;
  }
}

async function generateCatalog() {
  console.log('Generating catalog...');
  
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const products: any[] = [];
  const categoriesSet = new Set<string>();

  return new Promise((resolve, reject) => {
    fs.createReadStream(CSV_FILE)
      .pipe(csvParser())
      .on('data', (data: any) => {
        const name = data['Product Name'];
        const price = data['Price'];
        const description = data['Description'];
        const image = data['Image URL'];
        const category = data['Category'];
        const url = data['Product URL'];
        
        if (!name || !price) return;
        
        products.push({
            name, price, description, image, category, url
        });
        
        if (category && category !== '/') {
            categoriesSet.add(category);
        }
      })
      .on('end', async () => {
        console.log(`Parsed ${products.length} products from CSV.`);
        
        const finalProducts = [];
        const categories = Array.from(categoriesSet).map((cat, i) => ({
          id: `cat-${i + 1}`,
          title: cat,
          path: `/search/${generateSlug(cat)}`
        }));
        
        let i = 1;
        for (const p of products) {
            const ext = p.image.split('.').pop() || 'jpg';
            // clean up query params in extension if any
            const cleanExt = ext.split('?')[0]; 
            const filename = `${generateSlug(p.name)}.${cleanExt}`;
            
            console.log(`Downloading ${p.image} to ${filename}`);
            await downloadImage(p.image, filename);
            
            const imagePath = path.join(IMAGES_DIR, filename);
            if (fs.existsSync(imagePath)) {
                const stats = fs.statSync(imagePath);
                if (stats.size === 16303) {
                    console.log(`Skipping ${p.name} - Placeholder image detected (16303 bytes)`);
                    fs.unlinkSync(imagePath); // Clean up the placeholder image
                    continue; // Skip this product entirely
                }
            }

            finalProducts.push({
                id: `prod-${i}`,
                slug: generateSlug(p.name),
                name: p.name,
                description: p.description,
                price: parseInt(p.price) || 0,
                image: `/images/products/${filename}`,
                categoryId: categories.find(c => c.title === p.category)?.id || 'cat-1',
                featured: i <= 5
            });
            i++;
        }
        
        const fileContent = `// Auto-generated catalog from MYDAWA scraper

export const categories = ${JSON.stringify(categories, null, 2)};

export const products = ${JSON.stringify(finalProducts, null, 2)};
`;
        
        fs.writeFileSync(OUTPUT_FILE, fileContent);
        console.log(`Successfully generated ${OUTPUT_FILE}`);
        resolve(null);
      })
      .on('error', reject);
  });
}

generateCatalog().catch(console.error);
