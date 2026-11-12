/**
 * Aatir's Arcade On-Demand Caching & Latency Reduction Subsystem
 *
 * Implements Rule 1 & Rule 2:
 * - On-demand only: Cartridge bundles remain 0 bytes until launched or explicitly hovered/focused.
 * - Cache API + low-priority background prefetching for selected game bundles.
 * - Precision stream progress telemetry for authentic BIOS/DOS loading state.
 */

export const ARCADE_CACHE_NAME = 'aatir-arcade-v1';

/**
 * Format raw byte counts into human-readable retro telemetry format (e.g., '756 KB', '2.45 MB')
 */
export function formatBytes(bytes) {
  if (!bytes || isNaN(bytes) || bytes <= 0) return '0 KB';
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

/**
 * Safely revokes an Object URL created for a cached cartridge bundle
 */
export function releaseBundleUrl(url) {
  if (typeof url === 'string' && url.startsWith('blob:')) {
    try {
      URL.revokeObjectURL(url);
    } catch {
      // Ignore cleanup error in non-standard environments
    }
  }
}

/**
 * Check if the browser environment supports the Cache API
 */
export function hasCacheSupport() {
  return typeof window !== 'undefined' && 'caches' in window;
}

/**
 * Check if a game cartridge bundle already exists in the Cache API
 */
export async function isBundleCached(bundleUrl) {
  if (!hasCacheSupport() || !bundleUrl) return false;
  try {
    const cache = await caches.open(ARCADE_CACHE_NAME);
    const match = await cache.match(bundleUrl);
    return Boolean(match);
  } catch {
    return false;
  }
}

// In-flight active bundle downloads map: bundleUrl -> { promise, listeners: Set<Function> }
const inFlightDownloads = new Map();

function notifyListeners(listeners, payload) {
  listeners.forEach((listener) => {
    try {
      listener(payload);
    } catch (err) {
      console.warn('[arcadeCache] Progress listener error:', err);
    }
  });
}

/**
 * Internal stream reader and cache storer
 */
async function fetchAndCacheStream(bundleUrl, listeners, options = {}) {
  const startTime = performance.now();
  const fetchOptions = {
    ...options,
  };

  const response = await fetch(bundleUrl, fetchOptions);
  if (!response.ok) {
    throw new Error(`Failed to download cartridge bundle (${response.status} ${response.statusText}): ${bundleUrl}`);
  }

  const contentLengthHeader = response.headers.get('content-length');
  const total = contentLengthHeader ? parseInt(contentLengthHeader, 10) : 0;
  let loaded = 0;
  let blob;

  if (response.body && typeof response.body.getReader === 'function') {
    const reader = response.body.getReader();
    const chunks = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      loaded += value.length;

      const percentage = total > 0 ? Math.min(100, Math.round((loaded / total) * 100)) : 0;
      notifyListeners(listeners, {
        loaded,
        total: total || loaded,
        percentage,
        cached: false,
        latencyMs: Math.max(0, Math.round(performance.now() - startTime)),
        loadedFormatted: formatBytes(loaded),
        totalFormatted: total > 0 ? formatBytes(total) : formatBytes(loaded),
      });
    }

    blob = new Blob(chunks, {
      type: response.headers.get('content-type') || 'application/octet-stream',
    });
  } else {
    // Fallback if ReadableStream is unavailable
    blob = await response.blob();
    notifyListeners(listeners, {
      loaded: blob.size,
      total: blob.size,
      percentage: 100,
      cached: false,
      latencyMs: Math.max(0, Math.round(performance.now() - startTime)),
      loadedFormatted: formatBytes(blob.size),
      totalFormatted: formatBytes(blob.size),
    });
  }

  // Store in Cache API for instantaneous future boots
  if (hasCacheSupport()) {
    try {
      const cache = await caches.open(ARCADE_CACHE_NAME);
      const cacheResponse = new Response(blob, {
        status: 200,
        statusText: 'OK',
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': String(blob.size),
          'Date': new Date().toUTCString(),
        },
      });
      await cache.put(bundleUrl, cacheResponse);
    } catch (cacheErr) {
      console.warn('[arcadeCache] Failed to store bundle in Cache API:', cacheErr);
    }
  }

  notifyListeners(listeners, {
    loaded: blob.size,
    total: blob.size,
    percentage: 100,
    cached: false,
    latencyMs: Math.max(0, Math.round(performance.now() - startTime)),
    loadedFormatted: formatBytes(blob.size),
    totalFormatted: formatBytes(blob.size),
  });

  return {
    blob,
    cached: false,
    latencyMs: Math.max(0, Math.round(performance.now() - startTime)),
    totalBytes: blob.size,
  };
}

/**
 * Retrieves a cartridge bundle from Cache API if present (0ms latency, marked CACHED),
 * or fetches with streaming progress telemetry and stores into Cache API.
 * Returns an Object URL suitable for js-dos mounting.
 *
 * @param {string} bundleUrl - URL of the game bundle (e.g. '/games/doom.jsdos')
 * @param {Function} [onProgress] - Telemetry callback receiving progress info
 * @returns {Promise<{ url: string, cached: boolean, latencyMs: number, totalBytes: number, isBlobUrl: boolean }>}
 */
export async function getOrFetchBundle(bundleUrl, onProgress) {
  if (!bundleUrl) {
    throw new Error('bundleUrl is required');
  }

  const startTime = performance.now();

  // 1. Check Browser Cache API for instant 0ms disk hit
  if (hasCacheSupport()) {
    try {
      const cache = await caches.open(ARCADE_CACHE_NAME);
      const match = await cache.match(bundleUrl);
      if (match) {
        const blob = await match.blob();
        const latencyMs = Math.max(0, Math.round(performance.now() - startTime));
        const objectUrl = URL.createObjectURL(blob);

        if (typeof onProgress === 'function') {
          onProgress({
            loaded: blob.size,
            total: blob.size,
            percentage: 100,
            cached: true,
            latencyMs,
            loadedFormatted: formatBytes(blob.size),
            totalFormatted: formatBytes(blob.size),
          });
        }

        return {
          url: objectUrl,
          cached: true,
          latencyMs,
          totalBytes: blob.size,
          isBlobUrl: true,
        };
      }
    } catch (err) {
      console.warn('[arcadeCache] Cache API match lookup warning:', err);
    }
  }

  // 2. Check if already downloading in-flight (e.g. from a prior hover prefetch)
  if (inFlightDownloads.has(bundleUrl)) {
    const active = inFlightDownloads.get(bundleUrl);
    if (typeof onProgress === 'function') {
      active.listeners.add(onProgress);
    }
    const result = await active.promise;
    const objectUrl = URL.createObjectURL(result.blob);
    return {
      url: objectUrl,
      cached: result.cached,
      latencyMs: Math.max(0, Math.round(performance.now() - startTime)),
      totalBytes: result.totalBytes,
      isBlobUrl: true,
    };
  }

  // 3. Initiate new streaming fetch
  const listeners = new Set();
  if (typeof onProgress === 'function') {
    listeners.add(onProgress);
  }

  const promise = fetchAndCacheStream(bundleUrl, listeners);
  inFlightDownloads.set(bundleUrl, { promise, listeners });

  try {
    const res = await promise;
    const objectUrl = URL.createObjectURL(res.blob);
    return {
      url: objectUrl,
      cached: false,
      latencyMs: res.latencyMs,
      totalBytes: res.totalBytes,
      isBlobUrl: true,
    };
  } finally {
    inFlightDownloads.delete(bundleUrl);
  }
}

/**
 * Low-priority background prefetch triggered on cartridge button hover or focus.
 * Safely fetches into Cache API without blocking UI or throwing unhandled errors.
 *
 * @param {string} bundleUrl - URL of the game bundle to prefetch
 */
export async function prefetchBundle(bundleUrl) {
  if (!bundleUrl || typeof window === 'undefined') return;

  // If already in flight or cached, do nothing
  if (inFlightDownloads.has(bundleUrl)) return;

  if (hasCacheSupport()) {
    try {
      const cache = await caches.open(ARCADE_CACHE_NAME);
      const match = await cache.match(bundleUrl);
      if (match) return; // Already in cache
    } catch {
      // Ignore cache check errors
    }
  }

  const listeners = new Set();
  const fetchOptions = 'priority' in Request.prototype ? { priority: 'low' } : {};
  const promise = fetchAndCacheStream(bundleUrl, listeners, fetchOptions);
  inFlightDownloads.set(bundleUrl, { promise, listeners });

  try {
    await promise;
  } catch (err) {
    // Non-blocking prefetch failure
    console.debug('[arcadeCache] Background prefetch notice:', bundleUrl, err?.message);
  } finally {
    inFlightDownloads.delete(bundleUrl);
  }
}
