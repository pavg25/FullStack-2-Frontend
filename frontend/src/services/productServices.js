
const BASE = "http://localhost:8081/api/productos";

function authHeaders() {
  const t = localStorage.getItem("auth_token");
  return t ? { Authorization: `Bearer ${t}` } : {};
}

// Validación HTTP que maneja 401 / 403 y mensajes de error del backend)
async function ok(resp) {
  if (!(resp instanceof Response)) {
    throw new Error("Service mal usado: Response esperado");
  }

  if (!resp.ok) {
    let msg = "Error en la petición";

    if (resp.status === 401) {
      msg = "No autorizado. Inicia sesión.";
    } else if (resp.status === 403) {
      msg = "Acceso denegado.";
    } else {
      try {
        const data = await resp.json();
        if (typeof data === "string") msg = data;
        else if (data?.message) msg = data.message;
        else if (data?.error) msg = data.error;
      } catch {
        const txt = await resp.text().catch(() => "");
        if (txt) msg = txt;
      }
    }

    throw new Error(msg);
  }

  const contentType = resp.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    return resp.json();
  }
  return resp.text();
}

async function http(method, url, body, options = {}) {
  const { isMultipart = false } = options;

  const headers = {
    ...authHeaders(), 
  };

  let fetchBody = undefined;

  if (isMultipart || body instanceof FormData) {
    fetchBody = body;
  } else if (body !== undefined && body !== null) {
    headers["Content-Type"] = "application/json";
    fetchBody = JSON.stringify(body);
  }

  const resp = await fetch(url, {
    method,
    headers,
    body: fetchBody,
  });

  return ok(resp);
}


// GET /api/productos
export const listarProductos    = ()        => http("GET", BASE);

// GET /api/productos/id
export const obtenerProducto    = (id)      => http("GET", `${BASE}/${id}`);

// POST /api/productos   
export const crearProducto      = (body, options = {}) =>
  http("POST", BASE, body, options); // requiere rol Admin

// PUT /api/productos/id  
export const editarProducto     = (id, body, options = {}) =>
  http("PUT", `${BASE}/${id}`, body, options); // requiere rol Admin

// DELETE /api/productos/id
export const eliminarProducto   = (id)     => http("DELETE", `${BASE}/${id}`); // requiere rol Admin

export function filtrarProductos({ categoriaId, categoriaNombre, activo = true } = {}) {
  const qs = new URLSearchParams();
  if (categoriaId) qs.set("categoriaId", categoriaId);
  if (categoriaNombre) qs.set("categoriaNombre", categoriaNombre);
  if (activo !== undefined) qs.set("activo", String(activo));

  const url = `${BASE}/filtrar${qs.toString() ? `?${qs.toString()}` : ""}`;
  return http("GET", url);
}
