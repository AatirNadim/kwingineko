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
  const doc = new DOMParser().parseFromString(xmlText, 'text/xml');
  if (doc.querySelector('parsererror')) throw new Error('Feed returned invalid XML.');
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
  try {
    const response = await fetch(url, { headers: { Accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml' } });
    if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}.`);
    const items = parseFeed(await response.text(), url);
    const result = { items };
    writeCache(url, result);
    return result;
  } catch (error) {
    const result = { items: [], error: error instanceof TypeError ? 'This feed may block browser access (CORS).' : error.message };
    writeCache(url, result);
    return result;
  }
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
