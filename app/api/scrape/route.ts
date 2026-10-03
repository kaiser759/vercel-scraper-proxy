import { NextResponse } from 'next/server';
import { getScrapePayload, normalizeRequestInput, validateTargetUrl } from '@/lib/scraper';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

function isJsonRequest(headers: Headers) {
  return headers.get('content-type')?.includes('application/json') ?? false;
}

async function parseRequestBody(request: Request) {
  if (request.method !== 'POST') return null;

  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (!contentType.includes('application/json')) return null;
    return await request.json();
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  const mode = (url.searchParams.get('mode') ?? 'json').toLowerCase();
  const selector = url.searchParams.get('selector') ?? undefined;

  return handleScrapeRequest({ targetUrl, mode, selector });
}

export async function POST(request: Request) {
  const body = await parseRequestBody(request);
  const url = new URL(request.url);

  const targetUrl = body?.url ?? url.searchParams.get('url') ?? null;
  const mode = (body?.mode ?? url.searchParams.get('mode') ?? 'json').toLowerCase();
  const selector = body?.selector ?? url.searchParams.get('selector') ?? undefined;

  return handleScrapeRequest({ targetUrl, mode, selector });
}

async function handleScrapeRequest({
  targetUrl,
  mode,
  selector
}: {
  targetUrl: string | null;
  mode: string;
  selector?: string;
}) {
  if (!targetUrl) {
    return NextResponse.json(
      { success: false, error: "Missing required 'url' parameter" },
      { status: 400 }
    );
  }

  try {
    const validatedUrl = validateTargetUrl(targetUrl);
    const input = normalizeRequestInput({ mode, selector });

    const payload = await getScrapePayload({
      targetUrl: validatedUrl,
      mode: input.mode,
      selector: input.selector
    });

    if (payload.format === 'pdf') {
      return new NextResponse(payload.data as Buffer, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename="scraped-page.pdf"'
        }
      });
    }

    if (payload.format === 'screenshot') {
      return new NextResponse(payload.data as Buffer, {
        headers: {
          'Content-Type': 'image/png'
        }
      });
    }

    return NextResponse.json({
      success: true,
      targetUrl: validatedUrl,
      mode: input.mode,
      timestamp: new Date().toISOString(),
      data: payload.data
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: message },
      { status: 400 }
    );
  }
}
