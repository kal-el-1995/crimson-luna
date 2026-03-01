import { NextRequest, NextResponse } from "next/server";

// Cache resolved image URLs for the lifetime of the server process
const imageUrlCache = new Map<string, string>();

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Accept":
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
};

async function resolveAmazonImageUrl(productPageUrl: string): Promise<string | null> {
  if (imageUrlCache.has(productPageUrl)) {
    return imageUrlCache.get(productPageUrl)!;
  }

  const res = await fetch(productPageUrl, { headers: BROWSER_HEADERS });
  if (!res.ok) return null;

  const html = await res.text();

  // Strategy 1: colorImages JSON blob (most reliable)
  const colorImagesMatch = html.match(/"hiRes"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (colorImagesMatch) {
    imageUrlCache.set(productPageUrl, colorImagesMatch[1]);
    return colorImagesMatch[1];
  }

  // Strategy 2: data-old-hires attribute on landing image
  const oldHiresMatch = html.match(/data-old-hires="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (oldHiresMatch) {
    imageUrlCache.set(productPageUrl, oldHiresMatch[1]);
    return oldHiresMatch[1];
  }

  // Strategy 3: landingImage src
  const landingMatch = html.match(/id="landingImage"[^>]*src="(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/);
  if (landingMatch) {
    imageUrlCache.set(productPageUrl, landingMatch[1]);
    return landingMatch[1];
  }

  return null;
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");
  if (!url || !url.startsWith("https://www.amazon.com/")) {
    return new NextResponse("Invalid URL", { status: 400 });
  }

  const imageUrl = await resolveAmazonImageUrl(url);
  if (!imageUrl) {
    return new NextResponse("Image not found", { status: 404 });
  }

  const imgRes = await fetch(imageUrl, {
    headers: {
      ...BROWSER_HEADERS,
      "Referer": "https://www.amazon.com/",
    },
  });

  if (!imgRes.ok) {
    return new NextResponse("Image fetch failed", { status: imgRes.status });
  }

  const contentType = imgRes.headers.get("content-type") ?? "image/jpeg";
  return new NextResponse(imgRes.body, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=3600",
    },
  });
}
