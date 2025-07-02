export function extractImageUrls(html: string): string[] {
  const regex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;
  while ((match = regex.exec(html))) {
    urls.push(match[1]);
  }
  return urls;
}
