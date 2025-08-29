import { chromium } from "@playwright/test";

/**
 * Create a new browser, context, and page with HTTP Basic Auth.
 */
export async function createPageWithBasicAuth(username, password, headless = true) {
    if (!username || !password) {
        throw new Error("❌ USERNAME or PASSWORD is not set in environment variables");
    }

    const browser = await chromium.launch({ headless });
    const context = await browser.newContext({
        httpCredentials: { username, password },
    });

    const page = await context.newPage();
    await page.goto('https://auction.lelangmobilku.co.id/');
    await page.waitForLoadState('domcontentloaded');

    return { browser, context, page };
}
