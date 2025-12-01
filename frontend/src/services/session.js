export function setAdminSession(user) {
  sessionStorage.setItem("adminLogged", "true");
  sessionStorage.setItem("rol", user?.rol || "Administrador");
}
export function clearSession() {
  sessionStorage.removeItem("adminLogged");
  sessionStorage.removeItem("rol");
}
export function getAuthUser() {
  try {
    const raw = localStorage.getItem("auth_user");
    return raw ? JSON.parse(raw) : null;
  } catch { 
    return null; 
  }
}
export function isAdmin() {
  const u = getAuthUser();
  return !!u && u.rol === "Administrador";
}
