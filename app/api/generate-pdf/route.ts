import { NextRequest, NextResponse } from "next/server";
import puppeteer from "puppeteer";

export async function POST(request: NextRequest) {
  let browser;

  try {
    console.log("Request received to generate PDF");

    const { html } = await request.json();
    console.log("HTML content received");

    // Launch browser
    browser = await puppeteer.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--disable-dev-shm-usage",
      ],
    });

    console.log("Puppeteer browser launched");

    const page = await browser.newPage();
    await page.setViewport({
      width: 794,
      height: 1123,
      deviceScaleFactor: 2,
    });

    // Set the content of the page
    await page.setContent(html, {
      waitUntil: ["networkidle0", "domcontentloaded"],
      timeout: 30000,
    });

    console.log("Page content set");

    // Generate the PDF
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      preferCSSPageSize: false,
      margin: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    });

    console.log("PDF generated");

    await browser.close();

    return new NextResponse(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": 'attachment; filename="resume.pdf"',
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    if (browser) {
      await browser.close();
    }

    return NextResponse.json(
      { error: "Failed to generate PDF", details: String(error) },
      { status: 500 }
    );
  }
}
