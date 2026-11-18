/**
 * Utilities for handling subdomain separation:
 * - Landing Page: qalbsense.com (and www.qalbsense.com / localhost / GitHub Pages)
 * - Main App: app.qalbsense.com (and app.localhost / /app)
 */

export function isAppHost() {
  if (typeof window === "undefined") return false;

  // Environment variable override (e.g. for multi-project deployments)
  if (import.meta.env.VITE_SITE_MODE === "app") return true;
  if (import.meta.env.VITE_SITE_MODE === "landing") return false;

  const hostname = window.location.hostname.toLowerCase();

  // If hosted on GitHub Pages (e.g. abdulwaliy.github.io/qalb_sense_mvp)
  if (hostname.includes("github.io")) {
    if (window.location.pathname.includes("/app")) return true;
    return false;
  }

  // Subdomain detection (app.qalbsense.com, app.localhost, etc.)
  if (hostname.startsWith("app.") || hostname.startsWith("app-")) {
    return true;
  }

  // Path-based fallback for local dev or routing under /app
  if (window.location.pathname.startsWith("/app")) {
    return true;
  }

  return false;
}

export function getAppUrl(path = "") {
  if (typeof window === "undefined") return path;

  const cleanPath = path.startsWith("/") ? path : `/${path}`;

  // If already on the app host
  if (isAppHost()) {
    if (window.location.pathname.startsWith("/app") && !cleanPath.startsWith("/app")) {
      return `/app${cleanPath}`;
    }
    return cleanPath;
  }

  // Environment variable override
  if (import.meta.env.VITE_APP_URL) {
    const base = import.meta.env.VITE_APP_URL.replace(/\/$/, "");
    return `${base}${cleanPath}`;
  }

  const host = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // GitHub Pages hosting: route to /app
  if (host.includes("github.io")) {
    const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");
    return `${base}/app${cleanPath}`;
  }

  // Local development: use app.localhost or fallback to /app
  if (host === "localhost" || host === "127.0.0.1") {
    return `${protocol}//app.localhost${port}${cleanPath}`;
  }

  // Production subdomain
  if (host.includes("qalbsense.com")) {
    return `https://app.qalbsense.com${cleanPath}`;
  }

  // Generic fallback: use /app route
  return `/app${cleanPath}`;
}

export function getLandingUrl(hash = "") {
  if (typeof window === "undefined") return "/";

  const cleanHash = hash ? (hash.startsWith("#") ? hash : `#${hash}`) : "";
  const baseUrl = import.meta.env.BASE_URL || "/";

  // Environment variable override
  if (import.meta.env.VITE_LANDING_URL) {
    const base = import.meta.env.VITE_LANDING_URL.replace(/\/$/, "");
    return `${base}/${cleanHash}`;
  }

  const host = window.location.hostname.toLowerCase();
  const port = window.location.port ? `:${window.location.port}` : "";
  const protocol = window.location.protocol;

  // GitHub Pages hosting
  if (host.includes("github.io")) {
    return `${baseUrl}${cleanHash}`;
  }

  // If running on app.localhost, link back to localhost root
  if (host.startsWith("app.localhost")) {
    return `${protocol}//localhost${port}/${cleanHash}`;
  }

  // If running on localhost with /app path
  if (host === "localhost" || host === "127.0.0.1") {
    return `/${cleanHash}`;
  }

  // Production marketing domain
  if (host.includes("qalbsense.com")) {
    return `https://qalbsense.com/${cleanHash}`;
  }

  return `${baseUrl}${cleanHash}`;
}
