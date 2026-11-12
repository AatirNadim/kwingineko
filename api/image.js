import { fetchHashnodeImage, HASHNODE_IMAGE_CACHE_CONTROL } from '../src/server/hashnodeImage.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).end();
  }

  const imageUrl = req.query?.url || new URL(req.url, 'http://localhost').searchParams.get('url');
  try {
    const { body, contentType } = await fetchHashnodeImage(imageUrl || '');
    res.setHeader('Content-Type', contentType);
    res.setHeader('Cache-Control', HASHNODE_IMAGE_CACHE_CONTROL);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).end(Buffer.from(body));
  } catch (error) {
    return res.status(error.statusCode || 502).json({ error: error.message || 'Failed to fetch Hashnode image.' });
  }
}
