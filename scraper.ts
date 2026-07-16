import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';

const BASE_URL = 'https://mydawa.com';
const MAX_PRODUCTS = 100;
const DELAY_MS = 2000;

const csvWriter = createObjectCsvWriter({
  path: 'mydawa_catalog.csv',
  header: [
    { id: 'name', title: 'Product Name' },
    { id: 'price', title: 'Price' },
    { id: 'description', title: 'Description' },
    { id: 'image', title: 'Image URL' },
    { id: 'category', title: 'Category' },
    { id: 'url', title: 'Product URL' },
  ],
  append: false,
});

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrape() {
  console.log('Starting MYDAWA scraper with Puppeteer...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  const categoriesToScrape = [
    '/products/beauty-and-skin-care/face-care/face-masks',
    '/products/beauty-and-skin-care/face-care/face-creams',
    '/products/beauty-and-skin-care/hair-care',
    '/products/health-conditions/cold-and-flu'
  ];

  let allProductLinks = new Set<string>();

  for (const catUrl of categoriesToScrape) {
    console.log(`Fetching category: ${catUrl}`);
    try {
      await page.goto(`${BASE_URL}${catUrl}`, { waitUntil: 'networkidle2' });
      
      const hrefs = await page.evaluate(() => {
        return Array.from(document.querySelectorAll('a'))
          .map(a => a.getAttribute('href'))
          .filter(h => h) as string[];
      });
      
      for (const href of hrefs) {
        const parts = href.split('/');
        if (href.startsWith('/products/') && parts.length === 3) {
          allProductLinks.add(`${BASE_URL}${href}`);
        } else if (href.startsWith(`${BASE_URL}/products/`) && parts.length === 5) {
          allProductLinks.add(href);
        }
      }
      await delay(DELAY_MS);
    } catch (e: any) {
      console.log(`Error fetching ${catUrl}: ${e.message}`);
    }
  }

  const urlsToScrape = Array.from(allProductLinks).slice(0, MAX_PRODUCTS);
  console.log(`Will scrape ${urlsToScrape.length} products (Max: ${MAX_PRODUCTS})...`);

  let count = 0;
  for (const url of urlsToScrape) {
    try {
      await delay(DELAY_MS);
      await page.goto(url, { waitUntil: 'networkidle2' });
      
      const data = await page.evaluate(() => {
        let name = document.querySelector('h1')?.textContent?.trim() || '';
        let description = document.querySelector('.product-description, #description, .description, [itemprop="description"]')?.textContent?.trim() || '';
        
        // Find price elements that might contain KES
        let priceTexts = Array.from(document.querySelectorAll('*'))
          .filter(el => el.children.length === 0 && el.textContent?.includes('KES'))
          .map(el => el.textContent?.trim());
        let priceText = document.querySelector('.pd-price-main, .product-price, .price')?.textContent || priceTexts[0] || '';
        let price = parseInt(priceText.replace(/[^0-9]/g, '') || '0');
        
        let image = '';
        
        // Find main product image
        // MYDAWA specific: the main product image is usually large and in the center.
        const allImgs = Array.from(document.querySelectorAll('img')).filter(img => img.width > 200 && !img.src.includes('placeholder'));
        if (allImgs.length > 0) {
            image = allImgs[0].src;
        }

        const ldJsons = document.querySelectorAll('script[type="application/ld+json"]');
        for (const script of ldJsons) {
            try {
                const parsed = JSON.parse(script.innerHTML);
                if (parsed['@type'] === 'Product') {
                    if (!name && parsed.name) name = parsed.name;
                    if (!description && parsed.description) description = parsed.description;
                    if (!image && parsed.image) {
                        image = Array.isArray(parsed.image) ? parsed.image[0] : parsed.image;
                    }
                    if (price === 0 && parsed.offers && parsed.offers.price) {
                        price = parseFloat(parsed.offers.price);
                    }
                }
            } catch (e) {}
        }
        
        const catEls = document.querySelectorAll('.breadcrumb li, .breadcrumbs a');
        const category = catEls.length > 1 ? catEls[catEls.length - 2]?.textContent?.trim() || 'Uncategorized' : 'Uncategorized';
        
        if (!name) name = document.title.split('|')[0].trim();
        
        return { name, price, description: description.substring(0, 500).replace(/\s+/g, ' '), image, category };
      });
      
      if (data.price === 0) {
         console.log(`Skipping ${url} - no valid price found.`);
         continue;
      }

      const product = {
        name: data.name,
        price: data.price.toString(),
        description: data.description,
        image: data.image.startsWith('http') ? data.image : (data.image ? `${BASE_URL}${data.image}` : ''),
        category: data.category,
        url
      };

      await csvWriter.writeRecords([product]);
      count++;
      console.log(`[${count}/${urlsToScrape.length}] Scraped: ${product.name} - KES ${product.price}`);
    } catch (err: any) {
      console.error(`Failed to scrape ${url}: ${err.message}`);
    }
  }

  await browser.close();
  console.log(`\nScraping complete! Successfully scraped ${count} products to mydawa_catalog.csv`);
}

scrape().catch(console.error);
