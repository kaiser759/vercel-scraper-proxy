# Vercel Scraper Proxy API

A production-ready browser automation API for scraping pages from Vercel using Next.js, Puppeteer Core, and @sparticuz/chromium-min.

## Features

- JSON extraction using CSS selectors or page metadata
- Screenshot generation
- PDF export
- URL validation and SSRF protections
- Works on Vercel with the Node.js runtime
- Optional host allowlist via `ALLOWED_HOSTS`

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Copy the example env file:

```bash
cp .env.example .env.local
```

3. Run the app locally:

```bash
npm run dev
```

4. Hit the endpoint:

```bash
curl "http://localhost:3000/api/scrape?url=https://example.com"
curl "http://localhost:3000/api/scrape?url=https://example.com&mode=screenshot"
curl "http://localhost:3000/api/scrape?url=https://example.com&mode=pdf"
curl "http://localhost:3000/api/scrape?url=https://example.com&selector=h1"
```

## Production deployment on Vercel

1. Push this repo to GitHub.
2. Import it into Vercel.
3. Set the project framework to Next.js.
4. Deploy.

## Environment variables

```env
ALLOWED_HOSTS=example.com,*.example.com
```

Leave `ALLOWED_HOSTS` empty to allow all HTTPS hosts.

## API contract

### GET /api/scrape

Parameters:

- `url` (required): the target URL
- `mode` (optional): `json`, `screenshot`, or `pdf`
- `selector` (optional): CSS selector used for JSON extraction

### POST /api/scrape

JSON body:

```json
{
  "url": "https://example.com",
  "mode": "json",
  "selector": "h1"
}
```

## Notes

- This is designed for Vercel's Node.js runtime.
- For production, restrict the allowed target hosts to reduce abuse.
- PDF and screenshot output is returned as the raw content type, while JSON output is returned as JSON.

## Security notes

The API validates the URL and blocks non-HTTP(S) protocols, localhost/private hosts, and other suspicious targets. You should also restrict `ALLOWED_HOSTS` in production to trusted websites.
