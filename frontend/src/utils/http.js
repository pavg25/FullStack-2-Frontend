export function authHeaders() {
  const t = localStorage.getItem("auth_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

export async function httpJson(url, { method = "GET", body, headers = {} } = {}) {
  const resp = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders(), ...headers },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    const msg = data?.message || data?.error || `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return data;
}
