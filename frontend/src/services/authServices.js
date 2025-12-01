const API = "http://localhost:8081/api/auth/login";

export async function login(email, password) {
  const resp = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) {
    throw new Error(data?.error || "No se pudo iniciar sesión");
  }

  // Guarda token y datos mínimos
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem("auth_user", JSON.stringify({ correo: data.correo, rol: data.rol }));

  return { correo: data.correo, rol: data.rol, token: data.token };
}

export function logout() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export function getAuth() {
  const token = localStorage.getItem("auth_token");
  const user = localStorage.getItem("auth_user");
  return { token, user: user ? JSON.parse(user) : null };
}
