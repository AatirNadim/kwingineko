const HASHNODE_IMAGE_HOST = 'cdn.hashnode.com';
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export const HASHNODE_IMAGE_CACHE_CONTROL =
  'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400';

export async function fetchHashnodeImage(rawUrl) {
  let imageUrl;
  try {
    imageUrl = new URL(rawUrl);
  } catch {
    throw Object.assign(new Error('A valid image URL is required.'), { statusCode: 400 });
  }

  if (imageUrl.protocol !== 'https:' || imageUrl.hostname !== HASHNODE_IMAGE_HOST || imageUrl.username || imageUrl.password) {
    throw Object.assign(new Error('Only HTTPS images from cdn.hashnode.com are allowed.'), { statusCode: 400 });
  }

  const response = await fetch(imageUrl, {
    headers: { Accept: 'image/avif,image/webp,image/png,image/jpeg,image/gif' },
  });
  if (!response.ok) {
    throw Object.assign(new Error(`Hashnode image returned HTTP ${response.status}.`), { statusCode: response.status });
  }

  const finalUrl = new URL(response.url);
  if (finalUrl.protocol !== 'https:' || finalUrl.hostname !== HASHNODE_IMAGE_HOST) {
    throw Object.assign(new Error('Hashnode image redirected to an unsupported host.'), { statusCode: 502 });
  }

  const contentType = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase();
  if (!['image/avif', 'image/webp', 'image/png', 'image/jpeg', 'image/gif'].includes(contentType)) {
    throw Object.assign(new Error('Hashnode returned an unsupported image type.'), { statusCode: 415 });
  }

  const declaredSize = Number(response.headers.get('content-length'));
  if (declaredSize > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Hashnode image exceeds the 8 MB limit.'), { statusCode: 413 });
  }

  const body = new Uint8Array(await response.arrayBuffer());
  if (body.byteLength > MAX_IMAGE_BYTES) {
    throw Object.assign(new Error('Hashnode image exceeds the 8 MB limit.'), { statusCode: 413 });
  }

  return { body, contentType };
}
