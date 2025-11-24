import { NextRequest, NextResponse } from "next/server";
import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";
import chromium from "@sparticuz/chromium";

// Ensure Node runtime, not Edge
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Optional: tweak fonts/rendering to reduce surprises
chromium.setGraphicsMode = false; // keep default
// chromium.font(weight) helpers exist if you need them

// quick health check
export async function GET() {
  return NextResponse.json({ ok: true });
}

async function launchBrowser(): Promise<Browser> {
  // On Vercel/Render, chromium.executablePath() returns a valid binary path.
  const executablePath = await chromium.executablePath();

  return puppeteer.launch({
    executablePath,
    headless: chromium.headless,      // true in serverless
    args: [
      ...chromium.args,
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-gpu",
    ],
    defaultViewport: chromium.defaultViewport,
    protocolTimeout: 120000,
  });
}

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;

  try {
    const { html } = await request.json();
    if (!html) {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Viewport is just for layout; PDF controls final size
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    page.setDefaultTimeout(45000);
    page.setDefaultNavigationTimeout(45000);

    // Avoid networkidle0 (CDN fonts can hang). Keep it snappy.
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Try to wait for fonts (don’t fail if not supported)
    try {
      // @ts-ignore
      await page.evaluate(() => (document as any).fonts?.ready);
    } catch {}

    // Small bounded idle wait
    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 2000 });
    } catch {}

    await page.emulateMediaType("print");

    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await page.close();
    await browser.close();

    return new NextResponse(pdf, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    if (browser) { try { await browser.close(); } catch {} }
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}
