const SUCCESS_TTL = 6 * 60 * 60 * 1000;
const ERROR_TTL = 10 * 60 * 1000;
const MAX_ITEMS_PER_FEED = 8;
const cache = new Map();
const inFlight = new Map();

function readCache(url) {
  const entry = cache.get(url);
  if (!entry) return null;
  const ttl = entry.value.error ? ERROR_TTL : SUCCESS_TTL;
  if (Date.now() - entry.savedAt >= ttl) {
    cache.delete(url);
    return null;
  }
  return entry.value;
}

function writeCache(url, value) {
  cache.set(url, { value, savedAt: Date.now() });
}

function firstText(node, names) {
  for (const name of names) {
    const found = node.getElementsByTagName(name)[0];
    if (found?.textContent?.trim()) return found.textContent.trim();
  }
  return '';
}

function parseFeed(xmlText, feedUrl) {
  let doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) {
    doc = new DOMParser().parseFromString(xmlText, 'text/html');
  }
  const rssItems = [...doc.getElementsByTagName('item')];
  const atomItems = [...doc.getElementsByTagName('entry')];
  const nodes = rssItems.length ? rssItems : atomItems;
  const source = firstText(doc, ['title']) || new URL(feedUrl).hostname.replace(/^www\./, '');
  return nodes.slice(0, MAX_ITEMS_PER_FEED).map((node) => {
    const atomLink = [...node.getElementsByTagName('link')].find((link) => link.getAttribute('rel') !== 'enclosure');
    const rawLink = firstText(node, ['link']) || atomLink?.getAttribute('href') || '';
    let link = '';
    try {
      const parsedLink = new URL(rawLink, feedUrl);
      if (parsedLink.protocol === 'http:' || parsedLink.protocol === 'https:') link = parsedLink.href;
    } catch { /* Ignore malformed article URLs. */ }
    const date = firstText(node, ['pubDate', 'published', 'updated', 'date']);
    return {
      title: firstText(node, ['title']) || 'Untitled article',
      link,
      date,
      source,
    };
  }).filter((item) => item.link);
}

async function fetchFeed(url) {
  const cached = readCache(url);
  if (cached) return cached;

  let xmlText = '';
  let lastError = null;

  // 1. Same-origin proxy avoids noisy CORS failures for feeds that block browsers.
  try {
    const proxyUrl = `/api/feed?url=${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, {
      headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
    });
    if (response.ok) {
      xmlText = await response.text();
    } else {
      lastError = new Error(`Proxy returned HTTP ${response.status}.`);
    }
  } catch (error) {
    lastError = error;
  }

  // 2. Try direct fetch only when the same-origin endpoint is unavailable.
  if (!xmlText) {
    try {
      const response = await fetch(url, {
        headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' },
      });
      if (response.ok) {
        xmlText = await response.text();
        lastError = null;
      } else {
        lastError = new Error(`Feed returned HTTP ${response.status}.`);
      }
    } catch (error) {
      lastError = error;
    }
  }

  // 3. Fallback: Public RSS-to-JSON aggregator if local proxy is unavailable (e.g. pure static hosting)
  if (!xmlText) {
    try {
      const r2jUrl = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`;
      const r2jResponse = await fetch(r2jUrl);
      if (r2jResponse.ok) {
        const data = await r2jResponse.json();
        if (data.status === 'ok' && Array.isArray(data.items) && data.items.length > 0) {
          const source = data.feed?.title || new URL(url).hostname.replace(/^www\./, '');
          const items = data.items.slice(0, MAX_ITEMS_PER_FEED).map((item) => {
            let link = '';
            try {
              const parsedLink = new URL(item.link, url);
              if (parsedLink.protocol === 'http:' || parsedLink.protocol === 'https:') link = parsedLink.href;
            } catch { /* Ignore malformed article URLs. */ }
            return {
              title: item.title || 'Untitled article',
              link,
              date: item.pubDate || '',
              source,
            };
          }).filter((item) => item.link);
          if (items.length > 0) {
            const result = { items };
            writeCache(url, result);
            return result;
          }
        }
      }
    } catch { /* Continue to next fallback */ }
  }

  // 4. Fallback: Public CORS proxy
  if (!xmlText) {
    try {
      const aoUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`;
      const aoResponse = await fetch(aoUrl);
      if (aoResponse.ok) {
        const text = await aoResponse.text();
        if (text && (text.includes('<rss') || text.includes('<feed') || text.includes('<xml'))) {
          xmlText = text;
          lastError = null;
        }
      }
    } catch { /* Final catch below */ }
  }

  // Parse retrieved XML if available
  if (xmlText) {
    try {
      const items = parseFeed(xmlText, url);
      if (items.length > 0) {
        const result = { items };
        writeCache(url, result);
        return result;
      }
      lastError = new Error('No recent articles were returned by this feed.');
    } catch (parseError) {
      lastError = parseError;
    }
  }

  const errorMessage = lastError instanceof TypeError
    ? 'This feed could not be loaded due to browser network/CORS restrictions.'
    : (lastError?.message || 'Could not load feed articles.');

  const result = { items: [], error: errorMessage };
  writeCache(url, result);
  return result;
}

function loadFeed(url) {
  if (!inFlight.has(url)) {
    const request = fetchFeed(url).finally(() => inFlight.delete(url));
    inFlight.set(url, request);
  }
  return inFlight.get(url);
}

export async function loadSelectedTopicFeeds(topics) {
  return Object.fromEntries(await Promise.all(topics.map(async (topic) => {
    const feeds = await Promise.all(topic.feeds.map(loadFeed));
    return [topic.id, {
      items: feeds.flatMap((feed) => feed.items).sort((a, b) => (Date.parse(b.date) || 0) - (Date.parse(a.date) || 0)).slice(0, MAX_ITEMS_PER_FEED),
      errors: feeds.map((feed) => feed.error).filter(Boolean),
    }];
  })));
}
