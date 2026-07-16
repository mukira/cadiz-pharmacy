import puppeteer from 'puppeteer';
async function run() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto('https://shop.pharmaplus.co.ke/products/collection/new-arrivals', { waitUntil: 'networkidle2' });
  const html = await page.content();
  console.log(html);
  await browser.close();
}
run();
