import { NextRequest, NextResponse } from "next/server";
import puppeteer, { type Browser } from "puppeteer-core";
import chromium from "@sparticuz/chromium";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Allow any origin for this endpoint (you can lock this down later)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Health check
export async function GET() {
  return NextResponse.json({ ok: true }, { headers: corsHeaders });
}

// Preflight for browser CORS
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = await chromium.executablePath();

  return puppeteer.launch({
    executablePath,
    headless: chromium.headless,
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
    const body = await request.json().catch(() => ({}));
    const html = body?.html as string | undefined;

    if (!html) {
      return NextResponse.json(
        { error: "Missing html" },
        { status: 400, headers: corsHeaders }
      );
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    page.setDefaultTimeout(45000);
    page.setDefaultNavigationTimeout(45000);

    await page.setContent(html, {
      waitUntil: "domcontentloaded",
      timeout: 45000,
    });

    try {
      // @ts-ignore
      await page.evaluate(() => (document as any).fonts?.ready);
    } catch {}

    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 2000 });
    } catch {}

    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: true,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    });

    await page.close();
    await browser.close();

    return new NextResponse(pdfBuffer, {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
        "Cache-Control": "no-store",
      },
    });
  } catch (error: any) {
    if (browser) {
      try {
        await browser.close();
      } catch {}
    }
    console.error("Error generating PDF:", error);

    return NextResponse.json(
      {
        error: "Failed to generate PDF",
        details: String(error?.message || error),
      },
      { status: 500, headers: corsHeaders }
    );
  }
}
