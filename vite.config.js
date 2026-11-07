import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

function apiProxyPlugin() {
  const handler = async (req, res, next) => {
    const reqUrl = new URL(req.url, 'http://localhost');

    // 1. RSS Feed Proxy (/api/feed)
    if (reqUrl.pathname === '/api/feed') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      const targetUrl = reqUrl.searchParams.get('url') || 'https://techtom.hashnode.dev/rss.xml';
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
        res.end(text);
        return;
      } catch (err) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message }));
        return;
      }
    }

    // 2. Hashnode Proxy (/api/hashnode) - handles both GET for RSS feed and POST for GraphQL
    if (reqUrl.pathname === '/api/hashnode') {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Accept');

      if (req.method === 'OPTIONS') {
        res.statusCode = 204;
        res.end();
        return;
      }

      // If GET request, proxy the RSS feed
      if (req.method === 'GET') {
        const targetUrl = reqUrl.searchParams.get('url') || 'https://techtom.hashnode.dev/rss.xml';
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
          res.end(text);
          return;
        } catch (err) {
          res.statusCode = 502;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ error: err.message || 'Failed to proxy RSS feed to techtom.hashnode.dev/rss.xml' }));
          return;
        }
      }

      let bodyText = '';
      for await (const chunk of req) {
        bodyText += chunk;
      }

      let parsedBody = {};
      try {
        if (bodyText) parsedBody = JSON.parse(bodyText);
      } catch {
        // ignore JSON parse errors
      }

      const query = parsedBody.query || reqUrl.searchParams.get('query');
      const variables = parsedBody.variables || { host: 'techtom.hashnode.dev' };

      if (!query) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: 'Missing GraphQL query parameter' }));
        return;
      }

      try {
        const response = await fetch('https://gql.hashnode.com', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
          },
          body: JSON.stringify({ query, variables })
        });

        const text = await response.text();
        res.statusCode = response.status;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.end(text);
        return;
      } catch (err) {
        res.statusCode = 502;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ error: err.message || 'Failed to proxy GraphQL to gql.hashnode.com' }));
        return;
      }
    }

    next();
  };

  return {
    name: 'api-proxy-plugin',
    configureServer(server) {
      server.middlewares.use(handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use(handler);
    }
  };
}

export default defineConfig({
  plugins: [react(), apiProxyPlugin()]
});
