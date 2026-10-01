export class ApiError extends Error {
  constructor(message: string, public status: number, public fieldErrors: Record<string, string> = {}) { super(message); }
}
let csrf: { token: string; headerName: string } | null = null;
export async function api<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  if (init.body && !(init.body instanceof FormData)) headers.set("Content-Type", "application/json");
  if (init.method && !["GET", "HEAD"].includes(init.method)) {
    if (!csrf) csrf = await api<{ token: string; headerName: string }>("/auth/csrf");
    headers.set(csrf.headerName, csrf.token);
  }
  const response = await fetch(`/api/v1${path}`, { ...init, headers, credentials: "same-origin", cache: "no-store" });
  if (path.includes("/login") || path.includes("/logout") || response.status === 403) csrf = null;
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "The request could not be completed." }));
    throw new ApiError(error.message || "Something went wrong.", response.status, error.fieldErrors);
  }
  if (response.status === 204 || response.headers.get("content-length") === "0") return undefined as T;
  const text = await response.text(); return text ? JSON.parse(text) as T : undefined as T;
}
