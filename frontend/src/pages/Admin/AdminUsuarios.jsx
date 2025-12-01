import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar";

import {
  listarUsuarios,
  crearUsuario,
  eliminarUsuario,
  actualizarUsuario,
} from "../../services/userServices";

function formatRun(run = "") {
  const clean = String(run).replace(/[^0-9kK]/g, "").toUpperCase();
  if (clean.length < 2) return clean;
  const cuerpo = clean.slice(0, -1);
  const dv = clean.slice(-1);
  let out = "", cnt = 0;

  for (let i = cuerpo.length - 1; i >= 0; i--) {
    out = cuerpo[i] + out;
    cnt++;
    if (cnt === 3 && i !== 0) {
      out = "." + out;
      cnt = 0;
    }
  }
  return `${out}-${dv}`;
}

export default function AdminUsuarios() {
  const navigate = useNavigate();

  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);

  
  const [form, setForm] = useState({
    run: "", nombre: "", apellidos: "", correo: "", password: "", rol: "",
  });
  const [errors, setErrors] = useState({});

  const [usuarioEdit, setUsuarioEdit] = useState(null);
  const [editForm, setEditForm] = useState({
    run: "", nombre: "", apellidos: "", correo: "", password: "", rol: "",
  });
  const [editErrors, setEditErrors] = useState({});

  useEffect(() => {
    const authRaw = localStorage.getItem("auth_user");
    const authUser = authRaw ? JSON.parse(authRaw) : null;

    if (!authUser || authUser.rol !== "Administrador") {
      navigate("/login", { replace: true });
      return;
    }
    cargar();
  }, [navigate]);

  const authRaw = localStorage.getItem("auth_user");
  const authUser = authRaw ? JSON.parse(authRaw) : null;

  function onLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.clear();
    window.location.replace("/login");
  }

  async function cargar() {
    setLoading(true);
    setErr(""); setInfo("");

    try {
      const data = await listarUsuarios();
      setUsuarios(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e?.message || "No se pudieron cargar los usuarios");
    } finally {
      setLoading(false);
    }
  }

  function validate(values, { passwordRequired = true } = {}) {
    const e = {};
    if (!values.run) e.run = "RUN requerido";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.correo || "")) e.correo = "Correo inválido";
    if (!values.nombre) e.nombre = "Requerido";
    if (!values.apellidos) e.apellidos = "Requerido";

    if (passwordRequired) {
      if (!values.password || values.password.length < 4) e.password = "Mínimo 4 caracteres";
    } else {
      if (values.password && values.password.length < 4) e.password = "Mínimo 4 caracteres";
    }

    if (!values.rol) e.rol = "Seleccione rol";

    return e;
  }

  function onChange(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  }

  async function onNuevoUsuario(e) {
    e.preventDefault();
    setErr(""); setInfo("");

    const v = validate(form, { passwordRequired: true });
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    const payload = {
      ...form,
      run: formatRun(form.run),
    };

    try {
      await crearUsuario(payload);

      const el = document.getElementById("modalNuevoUsuario");
      if (window.bootstrap) window.bootstrap.Modal.getInstance(el)?.hide();

      e.target.reset();

      setForm({ run: "", nombre: "", apellidos: "", correo: "", password: "", rol: "" });
      setErrors({});
      setInfo("Usuario creado.");
      cargar();
    } catch (err) {
      setErr(err?.message || "Error al crear usuario");
    }
  }

  function abrirEditar(u) {
    setUsuarioEdit(u);
    setEditForm({
      run: u.run || "",
      nombre: u.nombre || "",
      apellidos: u.apellidos || "",
      correo: u.correo || "",
      password: "",
      rol: u.rol || "",
    });
    setEditErrors({});

    const el = document.getElementById("modalEditarUsuario");
    if (window.bootstrap) window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el).show();
  }

  function onEditChange(e) {
    const { name, value } = e.target;
    setEditForm((f) => ({ ...f, [name]: value }));
    setEditErrors((er) => ({ ...er, [name]: undefined }));
  }

  async function onGuardarEdicion(e) {
    e.preventDefault();
    if (!usuarioEdit) return;

    const v = validate(editForm, { passwordRequired: false });
    setEditErrors(v);
    if (Object.keys(v).length > 0) return;

    const payload = {
      run: formatRun(editForm.run),
      nombre: editForm.nombre.trim(),
      apellidos: editForm.apellidos.trim(),
      correo: editForm.correo.trim(),
      rol: editForm.rol,
    };
    if (editForm.password) payload.password = editForm.password;

    try {
      await actualizarUsuario(usuarioEdit.id, payload);

      const el = document.getElementById("modalEditarUsuario");
      if (window.bootstrap) window.bootstrap.Modal.getInstance(el)?.hide();

      setUsuarioEdit(null);
      setInfo("Cambios guardados.");
      cargar();
    } catch (e) {
      setErr(e?.message || "No se pudo guardar los cambios");
    }
  }

  async function onEliminarConfirmado() {
    if (!usuarioAEliminar) return;

    try {
      await eliminarUsuario(usuarioAEliminar.id);

      const el = document.getElementById("modalConfirmarEliminarUser");
      if (window.bootstrap) window.bootstrap.Modal.getInstance(el)?.hide();

      setUsuarioAEliminar(null);
      setInfo("Usuario eliminado.");
      cargar();
    } catch (e) {
      setErr(e?.message || "No se pudo eliminar el usuario");
    }
  }

  const [filtroRol, setFiltroRol] = useState("");
  const [filtroTexto, setFiltroTexto] = useState("");

  const usuariosFiltrados = useMemo(() => {
    const rol = filtroRol.toLowerCase();
    const text = filtroTexto.toLowerCase().trim();

    return usuarios.filter((u) => {
      const okRol = !rol || u.rol.toLowerCase() === rol;

      const contenido =
        `${u.run} ${u.nombre} ${u.apellidos} ${u.correo}`.toLowerCase();

      const okText = !text || contenido.includes(text);

      return okRol && okText;
    });
  }, [usuarios, filtroRol, filtroTexto]);

  return (
    <div className="container-fluid">

      <MainNavbar />

      <style>{`
        .admin-wrap { min-height: calc(100vh - 56px); background:#f5f5f5; }
        .admin-sidebar { width:240px; background:#fff; border-right:1px solid #ddd; }
        .admin-content { flex:1; background:#f5f5f5; }
        .admin-item { padding:.65rem 1rem; border-radius:.5rem; color:#333; display:block; text-decoration:none; }
        .admin-item.active { background:#eef5ff; color:#0d6efd; font-weight:600; }
        .card-like { background:#fff; border:1px solid #dee2e6; border-radius:.5rem; }
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

          <div className="card-like p-4 mb-4 d-flex justify-content-between align-items-center">
            <h2 className="fw-bold mb-0">USUARIOS</h2>
            <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalNuevoUsuario">
              + Nuevo usuario
            </button>
          </div>

          {(err || info) && (
            <div className={`alert ${err ? "alert-danger" : "alert-success"}`}>
              {err || info}
            </div>
          )}

          <div className="card-like p-4">
            <h5 className="mb-3">Listado de usuarios</h5>

            <div className="row g-2 mb-3 align-items-end">
              <div className="col-md-4">
                <label className="form-label">Rol</label>
                <select className="form-select" value={filtroRol} onChange={(e) => setFiltroRol(e.target.value)}>
                  <option value="">Todos</option>
                  <option value="Administrador">Administrador</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label">Buscar</label>
                <input
                  className="form-control"
                  placeholder="RUN, nombre, correo…"
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                />
              </div>

              <div className="col-md-4 text-md-end small text-muted">
                {usuariosFiltrados.length} resultado(s)
              </div>
            </div>

            {loading ? (
              <div>Cargando...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>RUN</th>
                      <th>Nombre</th>
                      <th>Correo</th>
                      <th>Rol</th>
                      <th className="text-end" style={{ width: 180 }}>Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {usuariosFiltrados.map((u) => (
                      <tr key={u.id}>
                        <td>{u.id}</td>
                        <td>{u.run}</td>
                        <td>{u.nombre} {u.apellidos}</td>
                        <td>{u.correo}</td>
                        <td>{u.rol}</td>
                        <td className="text-end">
                          <div className="btn-group btn-group-sm">
                            <button className="btn btn-outline-secondary" onClick={() => abrirEditar(u)}>
                              Editar
                            </button>
                            <button
                              className="btn btn-outline-danger"
                              data-bs-toggle="modal"
                              data-bs-target="#modalConfirmarEliminarUser"
                              onClick={() => setUsuarioAEliminar(u)}
                            >
                              Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}

                    {usuariosFiltrados.length === 0 && (
                      <tr>
                        <td colSpan="6" className="text-center text-muted">Sin resultados</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
      </div>

      <div className="modal fade" id="modalNuevoUsuario" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title fw-bold">Nuevo usuario</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {err && <div className="alert alert-danger">{err}</div>}

              <form onSubmit={onNuevoUsuario}>
                <div className="row g-3">

                  <div className="col-md-4">
                    <label className="form-label">RUN</label>
                    <input
                      name="run"
                      className={`form-control ${errors.run ? "is-invalid" : ""}`}
                      value={form.run}
                      maxLength={15}
                      onChange={onChange}
                    />
                    <div className="invalid-feedback">{errors.run}</div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Nombre</label>
                    <input
                      name="nombre"
                      className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
                      value={form.nombre}
                      onChange={onChange}
                    />
                    <div className="invalid-feedback">{errors.nombre}</div>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Apellidos</label>
                    <input
                      name="apellidos"
                      className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
                      value={form.apellidos}
                      onChange={onChange}
                    />
                    <div className="invalid-feedback">{errors.apellidos}</div>
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Correo</label>
                    <input
                      name="correo"
                      className={`form-control ${errors.correo ? "is-invalid" : ""}`}
                      value={form.correo}
                      onChange={onChange}
                    />
                    <div className="invalid-feedback">{errors.correo}</div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Contraseña</label>
                    <input
                      name="password"
                      type="password"
                      className={`form-control ${errors.password ? "is-invalid" : ""}`}
                      value={form.password}
                      onChange={onChange}
                    />
                    <div className="invalid-feedback">{errors.password}</div>
                  </div>

                  <div className="col-md-3">
                    <label className="form-label">Rol</label>
                    <select
                      name="rol"
                      className={`form-select ${errors.rol ? "is-invalid" : ""}`}
                      value={form.rol}
                      onChange={onChange}
                    >
                      <option value="">-- Seleccione perfil --</option>
                      <option>Administrador</option>
                      <option>Cliente</option>
                    </select>
                    <div className="invalid-feedback">{errors.rol}</div>
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                  <button className="btn btn-dark" type="submit">Registrar</button>
                </div>

              </form>
            </div>

          </div>
        </div>
      </div>

      <div className="modal fade" id="modalEditarUsuario" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header">
              <h5 className="modal-title fw-bold">Editar usuario</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {!usuarioEdit ? (
                <div className="text-center text-muted py-2">Cargando…</div>
              ) : (
                <form onSubmit={onGuardarEdicion}>

                  <div className="row g-3">

                    <div className="col-md-4">
                      <label className="form-label">RUN</label>
                      <input
                        name="run"
                        className={`form-control ${editErrors.run ? "is-invalid" : ""}`}
                        value={editForm.run}
                        maxLength={15}
                        onChange={onEditChange}
                      />
                      <div className="invalid-feedback">{editErrors.run}</div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Nombre</label>
                      <input
                        name="nombre"
                        className={`form-control ${editErrors.nombre ? "is-invalid" : ""}`}
                        value={editForm.nombre}
                        onChange={onEditChange}
                      />
                      <div className="invalid-feedback">{editErrors.nombre}</div>
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Apellidos</label>
                      <input
                        name="apellidos"
                        className={`form-control ${editErrors.apellidos ? "is-invalid" : ""}`}
                        value={editForm.apellidos}
                        onChange={onEditChange}
                      />
                      <div className="invalid-feedback">{editErrors.apellidos}</div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Correo</label>
                      <input
                        name="correo"
                        className={`form-control ${editErrors.correo ? "is-invalid" : ""}`}
                        value={editForm.correo}
                        onChange={onEditChange}
                      />
                      <div className="invalid-feedback">{editErrors.correo}</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Contraseña (opcional)</label>
                      <input
                        name="password"
                        type="password"
                        className={`form-control ${editErrors.password ? "is-invalid" : ""}`}
                        value={editForm.password}
                        onChange={onEditChange}
                        placeholder="Dejar vacío para no cambiar"
                      />
                      <div className="invalid-feedback">{editErrors.password}</div>
                    </div>

                    <div className="col-md-3">
                      <label className="form-label">Rol</label>
                      <select
                        name="rol"
                        className={`form-select ${editErrors.rol ? "is-invalid" : ""}`}
                        value={editForm.rol}
                        onChange={onEditChange}
                      >
                        <option value="">-- Seleccione perfil --</option>
                        <option>Administrador</option>
                        <option>Cliente</option>
                      </select>
                      <div className="invalid-feedback">{editErrors.rol}</div>
                    </div>
                  </div>

                  <div className="text-end mt-4">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button className="btn btn-dark" type="submit">Guardar cambios</button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="modal fade" id="modalConfirmarEliminarUser" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">

            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title fw-bold">Confirmar eliminación</h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body text-center">
              <p>¿Seguro que deseas eliminar a <strong>{usuarioAEliminar?.nombre}</strong>?</p>
              <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
            </div>

            <div className="modal-footer justify-content-center">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-danger" onClick={onEliminarConfirmado}>Sí, eliminar</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
