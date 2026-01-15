/**
 * Optimizes image URLs from Google Content (lh3.googleusercontent.com)
 * by appending dimension parameters.
 */
export const optimizeImageUrl = (url: string, width: number = 800) => {
    if (!url) return '';
    if (url.includes('googleusercontent.com')) {
        // Remove existing params if any (everything after the last '=')
        const baseUrl = url.split('=')[0];
        return `${baseUrl}=w${width}`;
    }
    return url;
};
