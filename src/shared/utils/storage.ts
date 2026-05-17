import { config } from "../../config/env";

export const storage = {
  /**
   * Returns the full URL for a stored file
   */
  getFileUrl(path: string | null | undefined): string | null {
    if (!path) return null;
    
    // If it's already a full URL, return it
    if (path.startsWith("http")) return path;
    
    // Handle local storage URLs
    const baseUrl = config.SERVER_URL;
      
    return `${baseUrl}/${path.replace(/^\//, "")}`;
  },

  /**
   * Returns the relative path from a full URL
   */
  getRelativePath(url: string | null | undefined): string | null {
    if (!url) return null;
    if (!url.startsWith("http")) return url;
    
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.replace(/^\//, "");
    } catch {
      return url;
    }
  }
};
