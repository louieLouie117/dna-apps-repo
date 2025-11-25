// Safe cookie parsing utilities
// This prevents the "Cannot read properties of undefined (reading 'match')" error

export const safeCookieParser = {
  // Get a specific cookie value safely
  getCookie: (name) => {
    try {
      // Check if document and document.cookie exist
      if (typeof document === 'undefined' || !document.cookie) {
        return null;
      }

      // Ensure cookie is a string
      const cookieString = String(document.cookie || '');
      if (!cookieString || cookieString.length === 0) {
        return null;
      }

      // Create regex pattern safely
      const pattern = new RegExp('(^| )' + name + '=([^;]+)');
      const match = cookieString.match(pattern);
      
      return match ? decodeURIComponent(match[2]) : null;
    } catch (error) {
      console.warn(`Error parsing cookie '${name}':`, error);
      return null;
    }
  },

  // Get user email from cookies (username cookie contains email)
  getUserEmail: () => {
    return safeCookieParser.getCookie('username');
  },

  // Get user ID from cookies
  getUserId: () => {
    return safeCookieParser.getCookie('userId');
  },

  // Get auth token from cookies
  getToken: () => {
    return safeCookieParser.getCookie('token');
  },

  // Check if user has valid authentication cookies
  hasValidAuthCookies: () => {
    const token = safeCookieParser.getToken();
    const userId = safeCookieParser.getUserId();
    return !!(token || userId);
  },

  // Get all auth-related cookies as an object
  getAuthCookies: () => {
    return {
      username: safeCookieParser.getUserEmail(),
      userId: safeCookieParser.getUserId(),
      token: safeCookieParser.getToken()
    };
  },

  // Safe cookie setter
  setCookie: (name, value, options = {}) => {
    try {
      if (typeof document === 'undefined') {
        return false;
      }

      const { 
        path = '/', 
        expires = null, 
        maxAge = null, 
        domain = null,
        secure = false,
        sameSite = 'lax' 
      } = options;

      let cookieString = `${name}=${encodeURIComponent(value)}; path=${path}`;

      if (expires) cookieString += `; expires=${expires}`;
      if (maxAge) cookieString += `; max-age=${maxAge}`;
      if (domain) cookieString += `; domain=${domain}`;
      if (secure) cookieString += `; secure`;
      if (sameSite) cookieString += `; samesite=${sameSite}`;

      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.warn(`Error setting cookie '${name}':`, error);
      return false;
    }
  },

  // Safe cookie removal
  removeCookie: (name, options = {}) => {
    const { path = '/', domain = null } = options;
    
    try {
      if (typeof document === 'undefined') {
        return false;
      }

      // Set cookie to expire in the past
      let cookieString = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=${path}`;
      if (domain) cookieString += `; domain=${domain}`;
      
      document.cookie = cookieString;
      
      // Also try max-age method
      cookieString = `${name}=; max-age=0; path=${path}`;
      if (domain) cookieString += `; domain=${domain}`;
      
      document.cookie = cookieString;
      return true;
    } catch (error) {
      console.warn(`Error removing cookie '${name}':`, error);
      return false;
    }
  }
};

export default safeCookieParser;