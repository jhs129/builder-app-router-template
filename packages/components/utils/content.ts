// Utility function to check if content has meaningful text
export const hasMeaningfulContent = (content: string): boolean => {
  if (!content) return false;

  // Strip HTML tags and decode HTML entities, then trim whitespace
  const textContent = content
    .replace(/<[^>]*>/g, "") // Remove HTML tags
    .replace(/&nbsp;/g, " ") // Replace &nbsp; with regular spaces
    .replace(/&amp;/g, "&") // Decode common HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim(); // Remove leading/trailing whitespace

  return textContent.length > 0;
};