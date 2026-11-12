export function getCachedImageUrl(rawUrl) {
  if (!rawUrl) return rawUrl;
  try {
    const imageUrl = new URL(rawUrl, window.location.origin);
    if (imageUrl.protocol === 'https:' && imageUrl.hostname === 'cdn.hashnode.com') {
      return `/api/image?url=${encodeURIComponent(imageUrl.href)}`;
    }
  } catch {
    // Preserve local and otherwise valid image references as provided.
  }
  return rawUrl;
}
