import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('/opt/cursor/artifacts/screenshots', { recursive: true });
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });
const pageErrors = [];
page.on('pageerror', (e) => pageErrors.push(e.message));
await page.goto('http://127.0.0.1:8877/index.html', { waitUntil: 'networkidle', timeout: 60000 });
await page.waitForTimeout(1500);
for (let i = 0; i < 10; i++) {
  await page.keyboard.press('Enter');
  await page.waitForTimeout(300);
}
const start = page.locator('button[data-action="start"]').first();
if (await start.count()) await start.click({ timeout: 5000 }).catch(() => {});
await page.waitForTimeout(3500);
await page.screenshot({ path: '/opt/cursor/artifacts/screenshots/rebase-scene-verify.png' });
const info = await page.evaluate(() => {
  const d = document.getElementById('stage')?.__debug?.();
  return { mode: d?.mode, shops: d?.shops, owner: d?.owner };
});
console.log(JSON.stringify({ pageErrors, info }, null, 2));
await browser.close();
