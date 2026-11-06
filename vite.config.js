import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function rssFeedProxyPlugin() {
  const handler = async (req, res, next) => {
    const reqUrl = new URL(req.url, 'http://localhost');
    if (reqUrl.pathname === '/api/feed') {
      const targetUrl = reqUrl.searchParams.get('url');
      if (!targetUrl) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing url parameter' }));
        return;
      }
      try {
        const response = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/rss+xml, application/atom+xml, application/xml, text/xml, */*'
          }
        });
        if (!response.ok) {
          res.statusCode = response.status;
          res.setHeader('Content-Type', 'text/plain');
          res.end(`Feed returned HTTP ${response.status}`);
          return;
        }
        const text = await response.text();
        res.statusCode = 200;
        res.setHeader('Content-Type', response.headers.get('content-type') || 'application/xml; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(text);
        return;
      } catch (err) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }
    next();
  };

  return {
    name: 'rss-feed-proxy',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), rssFeedProxyPlugin()]
});
