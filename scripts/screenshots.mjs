import { chromium } from "playwright";
import { mkdirSync } from "node:fs";

// Visual-QA helper: boot `next start`, then `node scripts/screenshots.mjs`.
const BASE = process.env.BASE_URL ?? "http://localhost:3210";
const OUT = "screenshots";
mkdirSync(OUT, { recursive: true });

const pages = [
  ["home", "/"],
  ["show-breaking-bad", "/show/169"],
  ["show-sherlock", "/show/335"],
  ["show-simpsons", "/show/83"],
  ["show-got", "/show/82"],
  ["browse", "/browse?genre=Drama"],
  ["search", "/search?q=breaking"],
];
const widths = [375, 768, 1280];

const browser = await chromium.launch();
for (const w of widths) {
  const ctx = await browser.newContext({
    viewport: { width: w, height: 900 },
  });
  const page = await ctx.newPage();
  for (const [name, path] of pages) {
    await page.goto(BASE + path, { waitUntil: "load", timeout: 30000 });
    // let lazy images + the trend chart settle
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(700);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/${name}-${w}.png`, fullPage: true });
    console.log(`shot ${name} @ ${w}`);
  }
  await ctx.close();
}
await browser.close();
console.log("done");
