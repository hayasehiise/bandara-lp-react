export function extractImageUrls(content: string): string[] {
  const imgTagRegex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;

  while ((match = imgTagRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}
