import { NextRequest, NextResponse } from "next/server";
import type { Browser } from "puppeteer-core";
import puppeteer from "puppeteer-core";

// Make sure this runs in Node (not edge)
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function resolveChromeExecutable(): string | undefined {
  // 1) user/env override (works on platforms like Vercel, Render, etc.)
  if (process.env.PUPPETEER_EXECUTABLE_PATH) {
    return process.env.PUPPETEER_EXECUTABLE_PATH;
  }
  if (process.env.CHROME_PATH) {
    return process.env.CHROME_PATH;
  }

  // 2) common local installs
  const { platform } = process;
  if (platform === "win32") {
    const candidates = [
      "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
      "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
    ];
    for (const p of candidates) {
      try {
        require("fs").accessSync(p);
        return p;
      } catch {}
    }
  } else if (platform === "darwin") {
    const p = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    try {
      require("fs").accessSync(p);
      return p;
    } catch {}
  } else {
    // linux
    const candidates = [
      "/usr/bin/google-chrome",
      "/usr/bin/google-chrome-stable",
      "/usr/bin/chromium",
      "/usr/bin/chromium-browser",
    ];
    for (const p of candidates) {
      try {
        require("fs").accessSync(p);
        return p;
      } catch {}
    }
  }
  // Fallback: let puppeteer-core try PATH
  return undefined;
}

async function launchBrowser(): Promise<Browser> {
  const executablePath = resolveChromeExecutable();

  // Small retry in case first launch races with hot reload
  let lastErr: any;
  for (let i = 0; i < 2; i++) {
    try {
      return await puppeteer.launch({
        headless: true,
        executablePath,
        // Keep args minimal and sandbox-friendly
        args: [
          "--no-sandbox",
          "--disable-setuid-sandbox",
          "--disable-dev-shm-usage",
          "--disable-gpu",
          "--font-render-hinting=none",
        ],
        protocolTimeout: 120000, // 120s protocol budget
      });
    } catch (e) {
      lastErr = e;
      await new Promise(r => setTimeout(r, 500));
    }
  }
  throw lastErr;
}

// quick health check: GET /api/pdf -> { ok: true }
export async function GET() {
  return NextResponse.json({ ok: true });
}

export async function POST(request: NextRequest) {
  let browser: Browser | null = null;

  try {
    const body = await request.json().catch(() => ({}));
    const html = body?.html as string | undefined;
    if (!html) {
      return NextResponse.json({ error: "Missing html" }, { status: 400 });
    }

    browser = await launchBrowser();
    const page = await browser.newPage();

    // Don’t over-constrain the viewport; PDF options control size.
    await page.setViewport({ width: 794, height: 1123, deviceScaleFactor: 1 });
    page.setDefaultTimeout(45000); // 45s per step max
    page.setDefaultNavigationTimeout(45000);

    // Avoid 'networkidle0' (fonts/CDNs can keep it alive)
    await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 45000 });

    // Give the page a brief moment to settle (images/fonts)
    try {
      // If fonts are used, wait for them but do not fail the whole req
      // @ts-ignore
      await page.evaluate(() => (document as any).fonts?.ready);
    } catch {}

    // Optional: tiny idle wait; bounded so it won’t hang forever
    try {
      await page.waitForNetworkIdle({ idleTime: 500, timeout: 2000 });
    } catch {
      // ignore
    }

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
    if (browser) {
      try { await browser.close(); } catch {}
    }
    console.error("Error generating PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error?.message || error) },
      { status: 500 }
    );
  }
}
