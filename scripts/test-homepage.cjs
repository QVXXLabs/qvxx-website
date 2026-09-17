// Run with PLAYWRIGHT_PATH pointing to playwright-core and CHROME_PATH to Chrome.
// Use --serve for a homepage-only preview; other public pages stay on qvxx.ai.
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const html = source.replace(/^---\r?\n---\r?\n/, '').replace(
  /{% include ([\w-]+\.html) %}/g,
  (_, name) => fs.readFileSync(path.join(root, '_includes', name), 'utf8')
);
assert(!html.includes('{%') && !html.includes('{{'), 'Unsupported Liquid in homepage preview');
assert(!source.includes('\u2014'), 'Homepage copy contains an em dash');
for (const decoration of ['Independent AI consultancy', 'A short conversation to start.', 'No obligation to continue', 'A practical result', 'Where we can start', 'The person behind QVXX', "Let's look at it together", 'Examples to start a conversation.']) {
  assert(!source.includes(decoration), `Decorative copy must stay removed: ${decoration}`);
}
const approvedCopy = [
  'Find out where AI is worth investing in.',
  'A free review of your business priorities, including up to three hours of hands-on help.',
  'What the review includes',
  'We’ll discuss what you want to achieve and examine one area where AI could make a difference. I’ll assess the potential benefit against the effort, cost and constraints involved.',
  'You’ll get a recommendation on whether to proceed, what to test first and what implementation would require. That may mean using an existing tool, building something specific, or deciding that AI isn’t the right approach.',
  'Practical help to test the idea',
  'Where feasible, we’ll use the remaining time to set up a tool or develop an initial prototype using an example from your work. We’ll agree what to test and how to judge whether it helps.',
  'You keep the recommendations and anything we create, whether or not we work together again.',
  'The offer covers up to three hours in total, including the review, preparation and practical work. Software costs and any further implementation are agreed separately. There’s no obligation to continue.',
  'You don’t need a project brief. We can start with a business goal or a problem you want to address.'
];
for (const detail of ['$XM in annual savings.', 'Vortex Files is a file-sharing platform with branded client portals, file previews, comments and access controls.', 'As the solo founder, I owned the product scope, UX and full-stack implementation.', 'I built an AI-assisted delivery workflow around Codex, with custom tooling for design, development and review.', 'https://vortexfiles.qvxx.ai/', "Please don't send confidential employer or client documents."]) {
  assert(source.includes(detail), `Preserve useful offer and proof detail: ${detail}`);
}
for (const oldCopy of ['This report takes me half a day.', 'Start with something', 'research and synthesis', 'internal knowledge retrieval', 'small improvement', "It isn't a three-hour meeting.", '$1 million', 'text-messaging savings', 'Work at Remitly', 'This was work in my employed role', 'contact@qvxx.ai']) {
  assert(!source.includes(oldCopy), `Do not restore rejected or email-specific copy: ${oldCopy}`);
}
assert(!source.includes('/blog') && !source.includes('/feed.xml'), 'Remove blog and RSS links from the homepage');
const publicPages = new Set(['/experts', '/consulting/privacy', '/consulting/terms', '/consulting/cookies']);
const assets = new Map([
  ['/assets/home.css', 'text/css'],
  ['/assets/natanael-mota.jpg', 'image/jpeg'],
  ['/assets/natanael-mota-headshot.png', 'image/png'],
  ['/assets/fonts/inter-bold.woff2', 'font/woff2'],
  ['/favicon.svg', 'image/svg+xml']
]);
const server = http.createServer((request, response) => {
  const url = new URL(request.url, 'http://localhost').pathname;
  if (url === '/') {
    response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
    response.end(html);
  } else if (assets.has(url)) {
    response.writeHead(200, { 'Content-Type': assets.get(url) });
    response.end(fs.readFileSync(path.join(root, url)));
  } else if (publicPages.has(url)) {
    response.writeHead(302, { Location: `https://qvxx.ai${url}` });
    response.end();
  } else {
    response.writeHead(404);
    response.end('Not found');
  }
});

async function run() {
  const serve = process.argv.includes('--serve');
  await new Promise(resolve => server.listen(serve ? 4188 : 0, '127.0.0.1', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  if (serve) {
    console.log(`Homepage preview: ${base} (other public pages open the existing live site)`);
    return;
  }
  const { chromium } = require(process.env.PLAYWRIGHT_PATH || 'playwright-core');
  const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || '/usr/bin/google-chrome', headless: true });
  try {
    const output = process.env.SCREENSHOT_DIR;
    if (output) fs.mkdirSync(output, { recursive: true });
    for (const width of [1440, 1024, 768, 390, 320]) {
      const context = await browser.newContext({ viewport: { width, height: width > 720 ? 1000 : 844 }, reducedMotion: 'reduce' });
      // Keep test clicks and page views out of production analytics.
      await context.route('**/*', route => new URL(route.request().url()).origin === base ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base);
      await page.evaluate(() => document.fonts.ready);
      assert(await page.evaluate(() => document.fonts.check('700 38px Inter')), 'The original QVXX wordmark font must load locally');
      assert.equal(await page.locator('h1').count(), 1);
      assert.equal(await page.locator('h1').innerText(), approvedCopy[0]);
      const mainCopy = await page.locator('main').innerText();
      for (const paragraph of approvedCopy) {
        assert(mainCopy.includes(paragraph), `Render the exact approved copy: ${paragraph}`);
      }
      assert.equal(await page.locator('.task').count(), 0, 'Replace the old task examples with the approved offer');
      assert.equal(await page.locator('.review-section, .review-layout, .review-details').count(), 0, 'Remove the inset focus box and its independent grid');
      const alignedSections = await page.locator('#how-i-help, #free-review, #about').evaluateAll(sections => sections.map(section => {
        const heading = section.querySelector('h2').getBoundingClientRect();
        const copy = section.querySelector('.section-copy').getBoundingClientRect();
        return { headingLeft: heading.left, copyLeft: copy.left, copyRight: copy.right };
      }));
      for (const section of alignedSections) {
        assert(Math.abs(section.headingLeft - alignedSections[0].headingLeft) < 1, 'Section headings share the same left edge');
        assert(Math.abs(section.copyLeft - alignedSections[0].copyLeft) < 1, 'Body copy shares the same left edge');
        assert(Math.abs(section.copyRight - alignedSections[0].copyRight) < 1, 'Body copy shares the same right edge');
        assert(width > 720 ? section.copyLeft > section.headingLeft : Math.abs(section.copyLeft - section.headingLeft) < 1, 'Consistent two-column desktop and single-column mobile hierarchy');
      }
      assert.equal(await page.locator('.brand span, .eyebrow, .task > span, .experience-footer').count(), 0, 'Remove decorative descriptors, section labels and numbers');
      const brokenLabels = await page.locator('main [aria-labelledby]').evaluateAll(elements => elements.flatMap(element => element.getAttribute('aria-labelledby').split(/\s+/)).filter(id => !document.getElementById(id)));
      assert.deepEqual(brokenLabels, [], 'Section labels must still resolve');
      const typeStyles = await page.locator('h1, h2, h3, blockquote').evaluateAll(elements => elements.map(element => ({ family: getComputedStyle(element).fontFamily, style: getComputedStyle(element).fontStyle })));
      assert(typeStyles.every(type => type.family.includes('sans-serif') && type.style === 'normal'), 'QVXX must retain its sans-serif foundation');
      assert.equal(await page.locator('.hero .portrait').count(), 0, 'Portrait belongs with the consultant background, not the hero');
      await page.locator('.portrait img').scrollIntoViewIfNeeded();
      await page.locator('.portrait img').evaluate(image => image.decode());
      assert.equal(await page.locator('.portrait img').getAttribute('src'), '/assets/natanael-mota-headshot.png');
      assert(await page.locator('.portrait img').evaluate(image => image.complete && image.naturalWidth === 1254 && image.naturalHeight === 1254));
      const portraitResponse = await context.request.get(`${base}/assets/natanael-mota-headshot.png`);
      assert.equal(portraitResponse.status(), 200);
      assert.equal(createHash('sha256').update(await portraitResponse.body()).digest('hex'), '32b8f75ce3fe97f6527ed3101fefa2e99a864457f740b2600913e9373320522a', 'Serve the exact user-selected portrait, without regenerating or altering it');
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.keyboard.press('Tab');
      assert.equal(await page.locator(':focus').textContent(), 'Skip to content');
      await page.keyboard.press('Enter');
      assert.equal(await page.locator(':focus').getAttribute('id'), 'main');
      assert(await page.locator('#cookieBanner').isVisible());
      if (output && width === 390) await page.screenshot({ path: path.join(output, 'mobile-consent.png') });
      await page.getByRole('button', { name: 'Accept essential cookies only', exact: true }).click();
      await page.reload();
      assert(!(await page.locator('#cookieBanner').isVisible()), 'Consent choice must survive reload');
      assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), `Horizontal overflow at ${width}px`);
      const brokenAnchors = await page.locator('a[href^="#"]').evaluateAll(links => links.map(link => link.hash).filter(hash => !document.getElementById(hash.slice(1))));
      assert.deepEqual(brokenAnchors, []);
      for (const placement of ['header', 'hero', 'offer', 'footer']) {
        const link = page.locator(`[data-booking="${placement}"]`);
        assert.equal(await link.getAttribute('href'), 'https://calendar.app.google/F1CUZCKJCNZGN6oh8');
        // Exercise the real click handler but do not navigate away or book anything.
        await link.evaluate(element => element.addEventListener('click', event => event.preventDefault(), { once: true }));
        await link.click();
        assert.equal(await page.evaluate(place => window.dataLayer.filter(event => event.event === 'book_consultation' && event.placement === place).length, placement), 1);
      }
      await page.getByRole('button', { name: 'Cookie settings', exact: true }).click();
      assert(await page.locator('#cookieSettingsModal').isVisible());
      await page.locator('.switch').filter({ has: page.locator('#settings-analytics') }).click();
      assert(await page.locator('#settings-analytics').isChecked());
      await page.getByRole('button', { name: 'Save Preferences', exact: true }).click();
      assert(!(await page.locator('#cookieSettingsModal').isVisible()));
      assert(await page.evaluate(() => JSON.parse(localStorage.getItem('cookiePreferences')).analytics));
      await page.reload();
      assert(!(await page.locator('#cookieBanner').isVisible()));
      assert.deepEqual(errors, [], `Browser errors at ${width}px`);
      if (output && [1440, 390].includes(width)) {
        await page.locator('.portrait img').scrollIntoViewIfNeeded();
        await page.locator('.portrait img').evaluate(image => image.decode());
        await page.locator('#about').screenshot({ path: path.join(output, `about-${width}.png`) });
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: path.join(output, `homepage-${width}.png`), fullPage: true });
        await page.screenshot({ path: path.join(output, `hero-${width}.png`) });
      }
      await page.evaluate(() => localStorage.clear());
      await page.reload();
      await page.getByRole('button', { name: 'Accept all cookies', exact: true }).click();
      await page.reload();
      assert(!(await page.locator('#cookieBanner').isVisible()));
      const consent = await page.evaluate(() => JSON.parse(localStorage.getItem('cookiePreferences')));
      assert(consent.analytics && consent.marketing);
      console.log(`PASS ${width}px: QVXX typography, layout, portrait, keyboard, anchors, booking events, saved consent`);
      await context.close();
    }
  } finally {
    await browser.close();
    server.close();
  }
}
run().catch(error => { console.error(error); server.close(); process.exitCode = 1; });
