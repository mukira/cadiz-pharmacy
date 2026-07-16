import axios from 'axios';
import * as cheerio from 'cheerio';
import { createObjectCsvWriter } from 'csv-writer';

const BASE_URL = 'https://mydawa.com';
const MAX_PRODUCTS = 100;
const DELAY_MS = 1000;

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
  console.log('Starting MYDAWA scraper test...');
  
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
      const res = await axios.get(`${BASE_URL}${catUrl}`, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const $ = cheerio.load(res.data);
      
      $('a').each((_, el) => {
        const href = $(el).attr('href');
        if (!href) return;
        
        const parts = href.split('/');
        
        // Products usually look like /products/[slug] or https://mydawa.com/products/[slug]
        if (href.startsWith('/products/') && parts.length === 3) {
          allProductLinks.add(`${BASE_URL}${href}`);
        } else if (href.startsWith(`${BASE_URL}/products/`) && parts.length === 5) {
          allProductLinks.add(href);
        }
      });
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
      const res = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      const $ = cheerio.load(res.data);
      
      let price = 0;
      let name = $('h1').first().text().trim();
      let description = '';
      let image = $('meta[property="og:image"]').attr('content') || '';
      
      // Try parsing the application/ld+json for reliable product data
      const ldJsonScripts = $('script[type="application/ld+json"]');
      ldJsonScripts.each((_, el) => {
         try {
           const data = JSON.parse($(el).html() || '{}');
           if (data['@type'] === 'Product') {
              if (data.name) name = data.name;
              if (data.description) description = data.description;
              if (data.image && Array.isArray(data.image)) image = data.image[0];
              if (data.image && typeof data.image === 'string') image = data.image;
              if (data.offers && data.offers.price) {
                  price = parseFloat(data.offers.price);
              }
           }
         } catch(e) {}
      });
      
      // Fallback strategies if ld+json is missing
      if (price === 0) {
        const priceText = $('.pd-price-main, .product-price, .price, span:contains("KES")').first().text().replace(/[^0-9]/g, '');
        price = priceText ? parseInt(priceText) : 0;
      }
      
      if (!name) {
         name = $('title').text().split('|')[0].trim();
      }

      if (price === 0) {
         console.log(`Skipping ${url} - no valid price found.`);
         continue;
      }

      if (!description) {
        description = $('.product-description, #description, .description, [itemprop="description"], meta[property="og:description"]').attr('content') || $('.product-description').text();
      }
      description = description.trim().substring(0, 500);

      const category = $('.breadcrumb li, .breadcrumbs a').eq(-2).text().trim() || 'Uncategorized';

      const product = {
        name,
        price: price.toString(),
        description: description.replace(/\s+/g, ' '),
        image: image.startsWith('http') ? image : (image ? `${BASE_URL}${image}` : ''),
        category,
        url
      };

      await csvWriter.writeRecords([product]);
      count++;
      console.log(`[${count}/${urlsToScrape.length}] Scraped: ${name} - KES ${price}`);
    } catch (err: any) {
      console.error(`Failed to scrape ${url}: ${err.message}`);
    }
  }

  console.log(`\nScraping complete! Successfully scraped ${count} products to mydawa_catalog.csv`);
}

scrape().catch(console.error);
