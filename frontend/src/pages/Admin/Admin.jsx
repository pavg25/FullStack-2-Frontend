import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar";
import { listarUsuarios } from "../../services/userServices";
import { listarProductos } from "../../services/productServices";

export default function Admin() {
  const navigate = useNavigate();
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);

  const [loadingResumen, setLoadingResumen] = useState(true);
  const [errResumen, setErrResumen] = useState("");
  const [resumen, setResumen] = useState({
    usuarios: 0,
    productos: 0,
    stockCritico: 0,
  });

  useEffect(() => {
    const authRaw = localStorage.getItem("auth_user");
    const authUser = authRaw ? JSON.parse(authRaw) : null;
    const isAdmin = authUser?.rol === "Administrador";

    if (!isAdmin) {
      navigate("/login", { replace: true });
      return;
    }

    setMe(authUser);
    setLoading(false);
  }, [navigate]);

  useEffect(() => {
    let alive = true;

    const getNum = (v) => Number.isFinite(Number(v)) ? Number(v) : 0;
    const isCritico = (p) => {
      const stock = getNum(p?.stock);
      const minimo = getNum(p?.stockMin || p?.minStock || p?.stock_min);
      return minimo > 0 && stock <= minimo;
    };

    setLoadingResumen(true);
    setErrResumen("");

    Promise.all([
      listarUsuarios().catch(() => []),
      listarProductos().catch(() => []),
    ])
      .then(([users, prods]) => {
        if (!alive) return;

        const usuarios = Array.isArray(users) ? users.length : 0;
        const productos = Array.isArray(prods) ? prods.length : 0;
        const stockCritico = (prods || []).filter(isCritico).length;

        setResumen({ usuarios, productos, stockCritico });
      })
      .catch(() => setErrResumen("No se pudo cargar el resumen"))
      .finally(() => alive && setLoadingResumen(false));

    return () => { alive = false };
  }, []);

  function onLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.clear();
    navigate("/login", { replace: true });
  }

  if (loading) {
    return (
      <div className="container-fluid p-5 text-center text-muted">Cargando…</div>
    );
  }

  return (
    <div className="container-fluid">

      <MainNavbar />

      <style>{`
        .admin-wrap { min-height: calc(100vh - 56px); background: #f5f5f5; }
        .admin-sidebar { width: 240px; background: #fff; border-right: 1px solid #ddd; }
        .admin-content { flex: 1; background: #f5f5f5; }
        .admin-item { padding: .65rem 1rem; border-radius: .5rem; color: #333; text-decoration: none; display:block; }
        .admin-item.active { background: #e7f1ff; color: #0d6efd; font-weight: 600; }
      `}</style>

      <div className="d-flex admin-wrap mt-3">

        <aside className="admin-sidebar p-3 d-flex flex-column">
          <nav className="flex-grow-1">
            <a className="admin-item" href="/admin">Administrador</a>
            <a className="admin-item" href="/admin-productos">Productos</a>
            <a className="admin-item" href="/admin-usuarios">Usuarios</a>
          </nav>

          <div className="border-top pt-3">
            <button className="admin-item btn btn-link text-start p-0" onClick={onLogout}>
              Salir
            </button>
          </div>
        </aside>

        <main className="admin-content p-4">

          <div className="bg-white rounded border p-4 mb-4">
            <h2 className="fw-bold mb-1">Panel de Administración</h2>
            <p className="text-muted">Gestiona la tienda desde aquí.</p>
          </div>

          <div className="row g-3 mb-4">

            <div className="col-md-6">
              <div className="bg-white rounded border p-4 h-100">
                <h5>Accesos rápidos</h5>
                <div className="d-flex flex-wrap gap-2 mt-3">
                  <a href="/admin-usuarios" className="btn btn-dark">Usuarios</a>
                  <a href="/admin-productos" className="btn btn-dark">Productos</a>
                  <a href="/home" className="btn btn-dark">Ver tienda</a>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="bg-white rounded border p-4 h-100">
                <h5>Sesión</h5>
                <p className="mt-2">
                  Rol actual: <span className="badge text-bg-primary">{me?.rol}</span>
                </p>
                <button className="btn btn-outline-danger" onClick={onLogout}>
                  Cerrar sesión
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded border p-4 mb-4">
            <h5 className="mb-3">Resumen general</h5>

            {errResumen && (
              <div className="alert alert-danger py-2">{errResumen}</div>
            )}

            {loadingResumen ? (
              <div className="text-muted">Cargando…</div>
            ) : (
              <div className="row g-3">

                <div className="col-6 col-lg-4">
                  <div className="border rounded p-3 text-center">
                    <div className="fs-4 fw-bold">{resumen.usuarios}</div>
                    <div className="text-muted small">Usuarios</div>
                  </div>
                </div>

                <div className="col-6 col-lg-4">
                  <div className="border rounded p-3 text-center">
                    <div className="fs-4 fw-bold">{resumen.productos}</div>
                    <div className="text-muted small">Productos</div>
                  </div>
                </div>

                <div className="col-6 col-lg-4">
                  <div className="border rounded p-3 text-center">
                    <div className="fs-4 fw-bold">{resumen.stockCritico}</div>
                    <div className="text-muted small">Stock crítico</div>
                  </div>
                </div>

              </div>
            )}
          </div>

        </main>
      </div>
    </div>
  );
}
