import puppeteer from 'puppeteer';
import { createObjectCsvWriter } from 'csv-writer';
import fs from 'fs';

const BASE_URL = 'https://shop.pharmaplus.co.ke';

const categoriesToScrape = [
  { url: '/products/collection/new-arrivals', name: 'New Arrivals' },
  { url: '/products/collection/trending', name: 'Trending' },
  { url: '/products/collection/best-sellers', name: 'Best Sellers' }
];

const MAX_PER_CATEGORY = 20;

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
  append: true, // Appending as requested
});

async function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrape() {
  console.log('Starting PharmaPlus scraper...');
  
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');

  const allRecords = [];

  for (const cat of categoriesToScrape) {
    console.log(`\nFetching category: ${cat.name} (${BASE_URL}${cat.url})`);
    try {
      await page.goto(`${BASE_URL}${cat.url}`, { waitUntil: 'networkidle2', timeout: 60000 });
      
      // Wait for products to load
      await delay(5000);

      // Extract product links
      const productLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href^="/products/"]'));
        return Array.from(new Set(links.map(a => a.getAttribute('href'))))
          .filter(href => href && href.split('/').length === 3 && !href.includes('collection') && !href.includes('brand') && !href.includes('offers'));
      });

      console.log(`Found ${productLinks.length} products. Processing up to ${MAX_PER_CATEGORY}...`);

      let count = 0;
      for (const link of productLinks) {
        if (count >= MAX_PER_CATEGORY) break;

        const productUrl = `${BASE_URL}${link}`;
        try {
          await page.goto(productUrl, { waitUntil: 'networkidle2', timeout: 30000 });
          
          // Wait for main elements
          await delay(3000);
          
          const productData = await page.evaluate(() => {
            const nameEl = document.querySelector('h1');
            const slug = window.location.pathname.split('/').pop() || 'Unknown Product';
            const name = nameEl ? nameEl.innerText.trim() : slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            
            // Try to find price (usually containing KES)
            const priceRegex = /KES\s*([\d,]+)/i;
            let priceVal = 0;
            const textNodes = document.body.innerText;
            const priceMatch = textNodes.match(priceRegex);
            if (priceMatch) {
              priceVal = parseInt(priceMatch[1].replace(/,/g, ''), 10);
            }

            // Description - usually paragraphs under the main area
            let description = '';
            const pEls = document.querySelectorAll('p');
            for (const p of Array.from(pEls)) {
              if (p.innerText.length > 50) {
                description = p.innerText.trim();
                break;
              }
            }

            // Image
            const imgEl = document.querySelector('img[src*="product"]');
            const image = imgEl ? (imgEl as HTMLImageElement).src : '';

            return { name, price: priceVal, description, image };
          });

          console.log(`Debug Extracted: Name: ${productData.name}, Price: ${productData.price}, Desc: ${productData.description ? 'Yes' : 'No'}`);

          // Skip invalid products only if completely empty
          if (productData.name === 'Unknown Product') {
            continue;
          }

          allRecords.push({
            name: productData.name,
            price: productData.price || 1000, // fallback
            description: productData.description || productData.name,
            image: productData.image || '/images/placeholder.jpg',
            category: cat.name,
            url: productUrl
          });

          console.log(`Scraped: ${productData.name} (KES ${productData.price})`);
          count++;
          await delay(1000); // Politeness delay

        } catch (err) {
          console.error(`Error fetching product ${productUrl}:`, err);
        }
      }

    } catch (err) {
      console.error(`Error fetching category ${cat.url}:`, err);
    }
  }

  await browser.close();

  if (allRecords.length > 0) {
    console.log(`\nWriting ${allRecords.length} records to mydawa_catalog.csv...`);
    await csvWriter.writeRecords(allRecords);
    console.log('Appended to CSV successfully!');
  } else {
    console.log('\nNo products scraped.');
  }
}

scrape().catch(console.error);
