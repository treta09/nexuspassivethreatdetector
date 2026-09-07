// The Base44 runtime module is provided by the deployment environment and is
// not included in the local TypeScript module-resolution context.
// @ts-expect-error -- runtime-provided module has no local type declarations.
import { secrets } from "base44:runtime";

// Shared helper for the FastAPI detection-backend proxy functions.
// Reads server-side secrets only — the base URL and API key never reach the
// browser. All failures normalize to a stable `code` so callers can branch and
// the platform logs (Logs explorer) keep the detail for later debugging.

export type ProxyConfig = { baseUrl: string; apiKey: string; configured: boolean };

export class ProxyError extends Error {
  code: string;
  constructor(code: string, message: string) {
    super(message);
    this.code = code;
    this.name = "ProxyError";
  }
}

export function getConfig(): ProxyConfig {
  const baseUrl = (secrets.get("FASTAPI_BASE_URL") || "").trim().replace(/\/+$/, "");
  const apiKey = (secrets.get("FASTAPI_API_KEY") || "").trim();
  return { baseUrl, apiKey, configured: baseUrl.length > 0 };
}

// Validate the configured base URL. Rejects anything that isn't a clean
// http(s) URL — protects against malformed config and trivial SSRF via the
// secret. Private IPs are NOT blocked: the detection backend may legitimately
// live on a private network.
export function validateBaseUrl(baseUrl: string): void {
  if (!/^https?:\/\//i.test(baseUrl)) {
    throw new ProxyError("invalid_config", "FASTAPI_BASE_URL must start with http:// or https://");
  }
  try {
    const u = new URL(baseUrl);
    if (u.protocol !== "http:" && u.protocol !== "https:") {
      throw new ProxyError("invalid_config", "FASTAPI_BASE_URL must be http or https");
    }
  } catch (err) {
    if (err instanceof ProxyError) throw err;
    throw new ProxyError("invalid_config", "FASTAPI_BASE_URL is not a valid URL");
  }
}

// Fetch one JSON resource from the FastAPI backend with a hard timeout.
// `resource` MUST be a relative path (starts with "/", no "://") — never an
// absolute URL — to prevent open-redirect / SSRF through the resource segment.
// Throws ProxyError with a stable code on any failure:
//   invalid_config | invalid_resource | upstream_timeout | upstream_unreachable
//   | upstream_<status> | upstream_bad_json
export async function fetchResource(
  baseUrl: string,
  resource: string,
  apiKey: string,
  timeoutMs = 8000
): Promise<unknown> {
  if (!resource.startsWith("/") || resource.includes("://")) {
    throw new ProxyError("invalid_resource", "resource must be a relative path");
  }
  validateBaseUrl(baseUrl);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (apiKey) headers.Authorization = `Bearer ${apiKey}`;
    let res: Response;
    try {
      res = await fetch(`${baseUrl}${resource}`, { headers, signal: controller.signal });
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        throw new ProxyError("upstream_timeout", `Backend timed out after ${timeoutMs}ms`);
      }
      throw new ProxyError("upstream_unreachable", `Could not reach backend: ${err instanceof Error ? err.name : "unknown"}`);
    }
    if (!res.ok) throw new ProxyError(`upstream_${res.status}`, `Backend returned ${res.status}`);
    try {
      return await res.json();
    } catch {
      throw new ProxyError("upstream_bad_json", "Backend returned non-JSON");
    }
  } finally {
    clearTimeout(timeout);
  }
}