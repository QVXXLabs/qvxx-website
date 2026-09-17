// Run on Mint with PLAYWRIGHT_PATH and CHROME_PATH. Set BASE_URL for live verification.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const render = name => fs.readFileSync(path.join(root, name), 'utf8')
  .replace(/^---\r?\n---\r?\n/, '')
  .replace(/{% include ([\w-]+\.html) %}/g, (_, include) => fs.readFileSync(path.join(root, '_includes', include), 'utf8'));
const pages = new Map([['/', render('index.html')], ['/experts', render('experts.html')], ['/experts.html', render('experts.html')]]);
for (const html of pages.values()) assert(!html.includes('{%') && !html.includes('{{'), 'Unsupported Liquid');
const assets = new Map([
  ['/assets/home.css', 'text/css'],
  ['/assets/fonts/inter-bold.woff2', 'font/woff2'],
  ['/assets/natanael-mota-headshot.png', 'image/png'],
  ['/favicon.svg', 'image/svg+xml']
]);
const server = http.createServer((request, response) => {
  const pathname = new URL(request.url, 'http://localhost').pathname;
  if (pages.has(pathname)) {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    response.end(pages.get(pathname));
  } else if (assets.has(pathname)) {
    response.writeHead(200, { 'Content-Type': assets.get(pathname) });
    response.end(fs.readFileSync(path.join(root, pathname)));
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

async function run() {
  if (!process.env.BASE_URL) await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const base = process.env.BASE_URL || `http://127.0.0.1:${server.address().port}`;
  const origin = new URL(base).origin;
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true });
  try {
    for (const width of [1440, 1024, 768, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: 1000 }, reducedMotion: 'reduce' });
      // Prevent test views and clicks from reaching analytics, calendars or expert profiles.
      await context.route('**/*', route => new URL(route.request().url()).origin === origin ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      assert.equal((await page.goto(`${base}/experts`)).status(), 200);
      await page.evaluate(() => document.fonts.ready);
      assert.equal(await page.title(), 'Expert Network | QVXX');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('h1').innerText(), 'Expert Network');
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), 'https://qvxx.ai/experts');
      assert(await page.evaluate(() => document.fonts.check('700 38px Inter')));
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Overflow at ${width}px`);
      assert.equal(await page.locator('.expert-card, .cta-section, .theme-toggle').count(), 0);
      const main = await page.locator('main').innerText();
      for (const text of [
        'When selecting comprehensive consulting packages, you will have access to my expert network for advisory and support.',
        'Featured Experts', 'Nikita Sarychev', 'Technical Leadership Specialist', 'Areas of Expertise:',
        'Work with Our Network',
        "When your project requires specialized expertise beyond AI integration, I can connect you with the right expert from our network. We'll work together to ensure seamless delivery and consistent quality.",
        'Discuss Your Project Needs'
      ]) assert(main.includes(text), `Preserve existing network copy: ${text}`);
      assert.deepEqual(await page.locator('.expert-profile li').allTextContents(), [
        'Technical product vision and leadership', 'AI transition strategy', 'Legacy system modernization',
        'Rapid prototyping', 'Tech stack due diligence', 'Security auditing'
      ]);
      assert.equal(await page.locator('.expert-name a').getAttribute('href'), 'https://www.niksarychev.com/');
      assert.equal(await page.getByRole('link', { name: 'LinkedIn', exact: true }).getAttribute('href'), 'https://www.linkedin.com/in/nik-sarychev/');
      assert.equal(await page.getByRole('link', { name: 'Website', exact: true }).getAttribute('href'), 'https://www.niksarychev.com/');
      const edges = await page.locator('main > .content-grid').evaluateAll(sections => sections.map(section => {
        const title = section.children[0].getBoundingClientRect();
        const copy = section.children[1].getBoundingClientRect();
        return { title: title.left, left: copy.left, right: copy.right };
      }));
      for (const edge of edges) {
        for (const key of ['title', 'left', 'right']) assert(Math.abs(edge[key] - edges[0][key]) < 1, `Consistent ${key} edge`);
        assert(width > 720 ? edge.left > edge.title : Math.abs(edge.left - edge.title) < 1);
      }
      assert.deepEqual(await page.locator('main [aria-labelledby]').evaluateAll(elements => elements.flatMap(element => element.getAttribute('aria-labelledby').split(/\s+/)).filter(id => !document.getElementById(id))), []);
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      assert(await page.locator('#cookieBanner').isVisible());
      await page.getByRole('button', { name: 'Accept essential cookies only', exact: true }).click();
      await page.reload();
      assert(!(await page.locator('#cookieBanner').isVisible()));
      for (const placement of ['header', 'network']) {
        const link = page.locator(`[data-booking="${placement}"]`);
        assert.equal(await link.getAttribute('href'), 'https://calendar.app.google/F1CUZCKJCNZGN6oh8');
        await link.evaluate(element => element.addEventListener('click', event => event.preventDefault(), { once: true }));
        await link.click();
        assert.equal(await page.evaluate(place => window.dataLayer.filter(event => event.event === 'book_consultation' && event.placement === place).length, placement), 1);
      }
      await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
      assert(await page.locator('#cookieSettingsModal').isVisible());
      await page.getByRole('button', { name: 'Close cookie settings', exact: true }).click();
      if (process.env.SCREENSHOT_DIR && [1440, 390].includes(width)) {
        fs.mkdirSync(process.env.SCREENSHOT_DIR, { recursive: true });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(process.env.SCREENSHOT_DIR, `network-${width}.png`), fullPage: true });
      }
      await page.getByRole('link', { name: 'QVXX home', exact: true }).click();
      assert.equal(new URL(page.url()).pathname, '/');
      assert.equal(await page.locator('h1').innerText(), 'Find out where AI is worth investing in.');
      assert(!(await page.locator('#cookieBanner').isVisible()), 'Consent survives navigation between pages');
      const homeEdge = await page.locator('#how-i-help .section-copy').boundingBox();
      assert(Math.abs(homeEdge.x - edges[0].left) < 1, 'Match the homepage copy alignment');
      await page.getByRole('link', { name: 'Expert network', exact: true }).click();
      assert.equal(new URL(page.url()).pathname, '/experts');
      assert(!(await page.locator('#cookieBanner').isVisible()));
      assert.deepEqual(errors, []);
      console.log(`PASS ${width}px: shared design, exact content, profile links, booking events, keyboard, consent and cross-page navigation`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}
run().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
