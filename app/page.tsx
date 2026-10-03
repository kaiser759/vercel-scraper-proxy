export default function HomePage() {
  return (
    <main style={{ fontFamily: 'sans-serif', padding: '3rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Professional Scraper API</h1>
      <p>
        This app exposes a browser-based scraping API for Vercel. Use the endpoint below to fetch JSON,
        screenshots, or PDF output from a target website.
      </p>

      <div style={{ background: '#f4f4f5', borderRadius: '12px', padding: '1.25rem', marginTop: '1.5rem' }}>
        <h2>Example requests</h2>
        <ul>
          <li><code>GET /api/scrape?url=https://example.com</code></li>
          <li><code>GET /api/scrape?url=https://example.com&mode=screenshot</code></li>
          <li><code>GET /api/scrape?url=https://example.com&mode=pdf</code></li>
          <li><code>GET /api/scrape?url=https://example.com&selector=h1</code></li>
        </ul>
      </div>
    </main>
  );
}
