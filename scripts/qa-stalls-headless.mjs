import { chromium } from 'playwright';

const stalls = ['surf', 'photo', 'ice', 'juice', 'lei', 'shell', 'toy', 'wrap', 'hat', 'spa'];

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
await page.addInitScript(() => {
  localStorage.setItem(
    'beachstar-save-v1',
    JSON.stringify({
      coins: 999,
      unlocked: 51,
      stars: Array(55).fill(3),
      expert: Array(55).fill(false),
      master: Array(55).fill(false),
      upgrades: { ranks: {} },
      sound: false,
      built: { bbq: true },
      storySeen: true,
    }),
  );
});
await page.goto(`http://127.0.0.1:8765/?qa=${Date.now()}`, { waitUntil: 'domcontentloaded' });
await page.waitForFunction(() => document.getElementById('stage')?.__testShopRoute, null, { timeout: 60000 });
await page.click('button[data-action="start"][data-level="51"]');
await page.waitForTimeout(800);

const routes = await page.evaluate((ids) => ids.map((id) => document.getElementById('stage').__testShopRoute(id)), stalls);

const plaqueGap = await page.evaluate(() => document.getElementById('stage').__plaqueGap());

const ownerHome = await page.evaluate(() => {
  const o = document.getElementById('stage').__debug().owner;
  return { x: Math.round(o.x), y: Math.round(o.y) };
});

await page.setViewportSize({ width: 600, height: 360 });
await page.waitForTimeout(400);
const portraitScale = await page.evaluate(() => ({
  titlePx: document.getElementById('stage').__plaqueFont(),
}));
await page.setViewportSize({ width: 1280, height: 800 });
await page.waitForTimeout(200);

// Queue guests then tap juice + lei stall centers
await page.evaluate(() => document.getElementById('stage').__spawnQueue(3));
await page.waitForTimeout(1200);

const tapStalls = await page.evaluate(() => {
  const stage = document.getElementById('stage');
  const juice = stage.__tapStall('juice');
  const lei = stage.__tapStall('lei');
  return { juice, lei };
});

const recapHeight = await page.evaluate(async () => {
  document.getElementById('stage').__endShift();
  await new Promise((r) => setTimeout(r, 100));
  const d = document.getElementById('dialog');
  return d ? d.getBoundingClientRect().height : null;
});

console.log(
  JSON.stringify(
    { routes, plaqueGap, ownerHome, tapStalls, recapHeight, portraitScale },
    null,
    2,
  ),
);

await browser.close();
