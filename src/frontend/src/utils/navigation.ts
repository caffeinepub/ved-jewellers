/**
 * Simple navigation utilities that use hash-based routing
 * compatible with TanStack Router's hash history mode.
 */

/** Navigate to a path (adds # prefix for hash routing) */
export function navigate(path: string) {
  window.location.hash = path;
}

/** Get current path from hash */
export function getCurrentPath(): string {
  return window.location.hash.replace(/^#/, "") || "/";
}

/** Get search params from current hash URL */
export function getSearchParams(): URLSearchParams {
  const hash = window.location.hash;
  const queryIndex = hash.indexOf("?");
  if (queryIndex === -1) return new URLSearchParams();
  return new URLSearchParams(hash.slice(queryIndex + 1));
}

/** Get path params from current hash (simple pattern matching) */
export function getPathParam(paramName: string): string {
  const path = getCurrentPath();
  const parts = path.split("/");
  // /product/:id
  if (paramName === "id" && parts[1] === "product") {
    return parts[2]?.split("?")[0] || "";
  }
  return "";
}
