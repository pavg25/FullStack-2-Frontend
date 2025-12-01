
const API = "http://localhost:8081/api/usuarios";

function authHeaders() {
  const t = localStorage.getItem("auth_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

async function ok(resp) {
  if (!(resp instanceof Response)) {
    throw new Error("Service mal usado: se esperaba Response de fetch");
  }
  if (!resp.ok) {
    if (resp.status === 401) throw new Error("No autorizado. Inicia sesión.");
    if (resp.status === 403) throw new Error("Acceso denegado. Requiere rol Administrador.");

    let text = "";
    try { text = await resp.text(); } catch {}
    const msg = text?.trim() ? text : `HTTP ${resp.status}`;
    throw new Error(msg);
  }
  return resp;
}

async function toJson(resp) {
  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) return resp.json();
  const txt = await resp.text();
  return txt ? JSON.parse(txt) : null;
}

async function http(method, url, body) {
  const opts = {
    method,
    headers: { "Content-Type": "application/json", ...authHeaders() },
  };
  if (body !== undefined) opts.body = JSON.stringify(body);
  const r = await fetch(url, opts);
  await ok(r);
  return toJson(r);
}


export function listarUsuarios() {
  return http("GET", API);
}

export function obtenerUsuario(id) {
  return http("GET", `${API}/${id}`);
}

export function crearUsuario(body) {
  return http("POST", API, body);
}

export function actualizarUsuario(id, body) {
  return http("PUT", `${API}/${id}`, body);
}

export function eliminarUsuario(id) {
  return http("DELETE", `${API}/${id}`);
}

export function desactivarUsuario(id) {
  return http("PUT", `${API}/${id}/desactivar`);
}
