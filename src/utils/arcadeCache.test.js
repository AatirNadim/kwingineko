import test from 'node:test';
import assert from 'node:assert/strict';

// Set up browser-like globals in Node environment for testing
const mockCacheStorage = new Map();

class MockCache {
  constructor(name) {
    this.name = name;
    this.store = new Map();
  }
  async match(request) {
    const key = typeof request === 'string' ? request : request.url;
    return this.store.get(key) || null;
  }
  async put(request, response) {
    const key = typeof request === 'string' ? request : request.url;
    this.store.set(key, response);
  }
}

globalThis.window = globalThis;
globalThis.caches = {
  async open(name) {
    if (!mockCacheStorage.has(name)) {
      mockCacheStorage.set(name, new MockCache(name));
    }
    return mockCacheStorage.get(name);
  },
};

const createdBlobUrls = new Set();
const revokedBlobUrls = new Set();

globalThis.URL.createObjectURL = (blob) => {
  const url = `blob:http://localhost/${Math.random().toString(36).slice(2)}`;
  createdBlobUrls.add(url);
  return url;
};

globalThis.URL.revokeObjectURL = (url) => {
  revokedBlobUrls.add(url);
};

// Import after globals are set
const {
  formatBytes,
  releaseBundleUrl,
  getOrFetchBundle,
  prefetchBundle,
  prewarmEmulatorRuntime,
  isBundleCached,
  ARCADE_CACHE_NAME,
} = await import('./arcadeCache.js');

test('formatBytes formats bytes correctly in retro engineering notation', () => {
  assert.equal(formatBytes(0), '0 KB');
  assert.equal(formatBytes(1024), '1 KB');
  assert.equal(formatBytes(774144), '756 KB');
  assert.equal(formatBytes(2569011), '2.45 MB');
  assert.equal(formatBytes(null), '0 KB');
});

test('releaseBundleUrl safely revokes blob URLs', () => {
  const dummyBlobUrl = 'blob:http://localhost/test-uuid';
  releaseBundleUrl(dummyBlobUrl);
  assert.ok(revokedBlobUrls.has(dummyBlobUrl));

  // Should safely no-op for non-blob URLs
  releaseBundleUrl('/games/doom.jsdos');
  assert.ok(!revokedBlobUrls.has('/games/doom.jsdos'));
});

test('getOrFetchBundle: cache miss fetches stream, caches bundle, and returns blob URL', async () => {
  const fakeData = new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8]);
  const bundleUrl = '/games/test-game.jsdos';

  // Mock global fetch for bundleUrl
  const originalFetch = globalThis.fetch;
  let fetchCalled = 0;
  globalThis.fetch = async (url) => {
    fetchCalled++;
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(fakeData.slice(0, 4));
        controller.enqueue(fakeData.slice(4));
        controller.close();
      },
    });
    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'application/octet-stream',
        'Content-Length': String(fakeData.length),
      },
    });
  };

  const progressEvents = [];
  const result = await getOrFetchBundle(bundleUrl, (p) => progressEvents.push(p));

  assert.equal(result.cached, false);
  assert.ok(result.url.startsWith('blob:'));
  assert.equal(result.totalBytes, fakeData.length);
  assert.ok(progressEvents.length > 0);
  assert.equal(progressEvents[progressEvents.length - 1].percentage, 100);

  // Verify it is now in Cache API
  const isCached = await isBundleCached(bundleUrl);
  assert.equal(isCached, true);

  // Next call should be a 0ms CACHE HIT without calling network fetch again!
  const progressHit = [];
  const cacheHitResult = await getOrFetchBundle(bundleUrl, (p) => progressHit.push(p));

  assert.equal(cacheHitResult.cached, true);
  assert.ok(cacheHitResult.url.startsWith('blob:'));
  assert.equal(fetchCalled, 1); // Fetch should NOT have been called a second time
  assert.equal(progressHit[0].cached, true);
  assert.equal(progressHit[0].percentage, 100);

  globalThis.fetch = originalFetch;
});

test('prefetchBundle: downloads bundle into Cache API without creating unrevoked ObjectURL', async () => {
  const fakeData = new Uint8Array([10, 20, 30, 40]);
  const bundleUrl = '/games/prefetch-test.jsdos';

  const originalFetch = globalThis.fetch;
  let fetchCalled = 0;
  globalThis.fetch = async (url) => {
    fetchCalled++;
    return new Response(fakeData, {
      status: 200,
      headers: { 'Content-Type': 'application/octet-stream', 'Content-Length': String(fakeData.length) },
    });
  };

  const blobUrlCountBefore = createdBlobUrls.size;
  await prefetchBundle(bundleUrl);

  // In Cache API
  const isCached = await isBundleCached(bundleUrl);
  assert.equal(isCached, true);
  assert.equal(fetchCalled, 1);
  // Should NOT create an ObjectURL during low-priority background prefetch
  assert.equal(createdBlobUrls.size, blobUrlCountBefore);

  // Calling prefetch again should be a no-op (already cached)
  await prefetchBundle(bundleUrl);
  assert.equal(fetchCalled, 1);

  globalThis.fetch = originalFetch;
});

test('prewarmEmulatorRuntime: only prewarms engine files, never game bundles', async () => {
  const originalFetch = globalThis.fetch;
  const fetchedUrls = [];

  globalThis.fetch = async (url) => {
    fetchedUrls.push(url);
    return new Response(new Uint8Array([0, 1]), { status: 200 });
  };

  // Mock setTimeout to run immediately
  const originalSetTimeout = globalThis.setTimeout;
  globalThis.setTimeout = (fn) => {
    fn();
    return 1;
  };

  prewarmEmulatorRuntime();

  // Allow async tasks to flush
  await new Promise((r) => setImmediate(r));

  assert.ok(fetchedUrls.includes('/js-dos/js-dos.js'));
  assert.ok(fetchedUrls.includes('/js-dos/emulators/wdosbox.wasm'));
  assert.ok(fetchedUrls.includes('/js-dos/emulators/wlibzip.wasm'));

  // Strictly verify NO game bundle was fetched!
  const gameFetched = fetchedUrls.some((u) => u.endsWith('.jsdos') || u.includes('/games/'));
  assert.equal(gameFetched, false, 'Rule 1 violation: prewarm must never fetch game bundles');

  globalThis.fetch = originalFetch;
  globalThis.setTimeout = originalSetTimeout;
});
