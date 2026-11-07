export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  const feedUrl =
    req.query?.url ||
    new URL(req.url, 'http://localhost').searchParams.get('url') ||
    'https://techtom.hashnode.dev/rss.xml';

  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
      }
    });

    if (!response.ok) {
      return res.status(response.status).send(`Feed returned HTTP ${response.status}`);
    }

    const xml = await response.text();
    res.setHeader('Content-Type', response.headers.get('content-type') || 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=1800, stale-while-revalidate=3600');
    return res.status(200).send(xml);
  } catch (err) {
    return res.status(502).json({ error: err.message || 'Failed to fetch RSS feed' });
  }
}
