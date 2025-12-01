import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MainNavbar from "../../components/MainNavbar";

import {
  listarProductos,
  crearProducto,
  eliminarProducto,
  editarProducto as actualizarProducto,
} from "../../services/productServices";

import { uploadFile } from "../../services/filesServices"; 
export default function AdminProductos() {
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [info, setInfo] = useState("");

  // Eliminar
  const [productoAEliminar, setProductoAEliminar] = useState(null);

  // Editar
  const [productoEdit, setProductoEdit] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  // crear imagen
  const [fileCrear, setFileCrear] = useState(null);
  const [previewCrear, setPreviewCrear] = useState("");

  // editar imagen
  const [fileEdit, setFileEdit] = useState(null);
  const [previewEdit, setPreviewEdit] = useState("");

  useEffect(() => {
    const authRaw = localStorage.getItem("auth_user");
    const authUser = authRaw ? JSON.parse(authRaw) : null;

    if (!authUser || authUser.rol !== "Administrador") {
      navigate("/login", { replace: true });
      return;
    }
  }, [navigate]);

  const authRaw = localStorage.getItem("auth_user");
  const authUser = authRaw ? JSON.parse(authRaw) : null;
  const logged = !!authUser;
  const admin = authUser?.rol === "Administrador";

  function onLogout() {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    sessionStorage.clear();
    window.location.replace("/login");
  }

  async function cargar() {
    setLoading(true);
    setErr("");
    try {
      const data = await listarProductos();
      setItems(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
      setErr(e?.message || "No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => { cargar(); }, []);

  const categorias = useMemo(() => ([
    { id: 1, label: "Anillos" },
    { id: 2, label: "Cadenas" },
    { id: 3, label: "Aros" },
    { id: 4, label: "Pulseras" },
    { id: 5, label: "Dijes" },
  ]), []);

  const toCLP = (n) =>
    (Number(n) || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  function onFileCrearChange(e) {
    const file = e.target.files?.[0] || null;
    setFileCrear(file);
    setPreviewCrear(file ? URL.createObjectURL(file) : "");
  }

  async function onNuevoProducto(e) {
    e.preventDefault();
    setErr("");
    setInfo("");

    const formEl = document.getElementById("frmProducto");
    const fd = new FormData(formEl || e.currentTarget);

    const data = Object.fromEntries(fd);
    const sku = (data.sku || "").trim();
    const nombre = (data.nombre || "").trim();
    const precio = Number(data.precio);
    const stock = Number(data.stock);
    const descripcion = (data.descripcion || "").trim();
    const categoriaId = Number(data.categoriaId);

    if (!sku) return setErr("SKU requerido.");
    if (!nombre) return setErr("Nombre requerido.");
    if (!categoriaId) return setErr("Seleccione categoría.");

    try {
      let imagenUrl = "";

      if (fileCrear) {
        const uploadRes = await uploadFile(fileCrear); 
        imagenUrl = uploadRes?.url || uploadRes?.path || "";
      }

      await crearProducto({
        sku,
        nombre,
        descripcion,
        precio: Math.round(precio),
        stock,
        activo: stock > 0,          
        categoriaId,
        imagenUrl: imagenUrl || null,
      });

      if (formEl?.reset) formEl.reset();
      setFileCrear(null);
      if (previewCrear) URL.revokeObjectURL(previewCrear);
      setPreviewCrear("");

      // Cerrar modal
      const el = document.getElementById("modalNuevoProducto");
      if (window.bootstrap) {
        window.bootstrap.Modal.getInstance(el)?.hide();
      }

      setInfo("Producto creado correctamente.");
      cargar();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "Error al crear el producto");
    }
  }

  async function onEliminarConfirmado() {
    if (!productoAEliminar) return;
    setErr("");
    setInfo("");

    try {
      await eliminarProducto(productoAEliminar.id);

      const el = document.getElementById("modalConfirmarEliminar");
      if (window.bootstrap) {
        window.bootstrap.Modal.getInstance(el)?.hide();
      }

      setProductoAEliminar(null);
      setInfo("Producto eliminado.");
      cargar();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "No se pudo eliminar");
    }
  }

  function onAbrirEditar(p) {
    setErr("");
    setInfo("");
    setFileEdit(null);
    setPreviewEdit("");

    setProductoEdit({
      id: p.id,
      sku: p.sku || "",
      nombre: p.nombre || "",
      descripcion: p.descripcion || "",
      precio: Number(p.precio) || 0,
      stock: Number(p.stock) || 0,
      activo: !!p.activo,
      categoriaId: p?.categoria?.id || null,
      categoriaNombre: p?.categoria?.nombre || p.categoriaNombre || "",
      imagenUrl: p.imagenUrl || p.imagen || "",
    });

    const el = document.getElementById("modalEditarProducto");
    if (window.bootstrap) {
      window.bootstrap.Modal.getInstance(el) || new window.bootstrap.Modal(el).show();
    }
  }

  function onFileEditChange(e) {
    const file = e.target.files?.[0] || null;
    setFileEdit(file);
    setPreviewEdit(file ? URL.createObjectURL(file) : "");
  }

  async function onGuardarEdicion(e) {
    e.preventDefault();

    if (!productoEdit) return;

    try {
      setSavingEdit(true);

      let imagenUrl = productoEdit.imagenUrl || "";

      if (fileEdit) {
        const uploadRes = await uploadFile(fileEdit);
        imagenUrl = uploadRes?.url || uploadRes?.path || "";
      }

      const payload = {
        id: productoEdit.id,
        sku: productoEdit.sku,
        nombre: productoEdit.nombre,
        descripcion: productoEdit.descripcion,
        precio: productoEdit.precio,
        stock: productoEdit.stock,
        activo: productoEdit.stock > 0,
        categoriaId: productoEdit.categoriaId,
        imagenUrl: imagenUrl || null,
      };

      await actualizarProducto(productoEdit.id, payload);

      const el = document.getElementById("modalEditarProducto");
      if (window.bootstrap) {
        window.bootstrap.Modal.getInstance(el)?.hide();
      }

      if (previewEdit) URL.revokeObjectURL(previewEdit);
      setFileEdit(null);
      setPreviewEdit("");

      setProductoEdit(null);
      setInfo("Producto actualizado.");
      cargar();
    } catch (e) {
      console.error(e);
      setErr(e?.message || "No se pudo actualizar el producto");
    } finally {
      setSavingEdit(false);
    }
  }
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
        .thumb { width:48px; height:48px; object-fit:cover; border-radius:.35rem; border:1px solid #e5e7eb; }
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
            <h2 className="fw-bold mb-0">PRODUCTOS</h2>
            <button className="btn btn-dark" data-bs-toggle="modal" data-bs-target="#modalNuevoProducto">
              + Nuevo producto
            </button>
          </div>

          {err && <div className="alert alert-danger">{err}</div>}
          {info && <div className="alert alert-success">{info}</div>}

          <div className="card-like p-4">
            <h5 className="mb-3">Listado de productos</h5>

            {loading ? (
              <div>Cargando...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-sm align-middle">
                  <thead className="table-light">
                    <tr>
                      <th></th>
                      <th>SKU</th>
                      <th>Nombre</th>
                      <th>Categoría</th>
                      <th className="text-end">Precio</th>
                      <th className="text-end">Stock</th>
                      <th>Estado</th>
                      <th className="text-end">Acciones</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((p) => {
                      const catTexto = p?.categoria?.nombre || p?.categoriaNombre || "—";
                      const disponible = Number(p.stock) > 0;
                      const img = p?.imagenUrl || p?.imagen || "";

                      return (
                        <tr key={p.id}>
                          <td>{img ? <img className="thumb" src={img} /> : "—"}</td>
                          <td>{p.sku}</td>
                          <td>{p.nombre}</td>
                          <td>{catTexto}</td>
                          <td className="text-end">{toCLP(p.precio)}</td>
                          <td className="text-end">{p.stock}</td>
                          <td>
                            <span className={`badge ${disponible ? "text-bg-success" : "text-bg-secondary"}`}>
                              {disponible ? "Disponible" : "No disponible"}
                            </span>
                          </td>
                          <td className="text-end">
                            <div className="btn-group btn-group-sm">
                              <button className="btn btn-outline-secondary" onClick={() => onAbrirEditar(p)}>
                                Editar
                              </button>
                              <button
                                className="btn btn-outline-danger"
                                data-bs-toggle="modal"
                                data-bs-target="#modalConfirmarEliminar"
                                onClick={() => setProductoAEliminar(p)}
                              >
                                Eliminar
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {items.length === 0 && (
                  <div className="text-center text-muted py-3">Sin productos</div>
                )}
              </div>
            )}
          </div>

        </main>
      </div>

      <div className="modal fade" id="modalNuevoProducto" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header"><h5 className="modal-title fw-bold">Nuevo producto</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              <form id="frmProducto" onSubmit={onNuevoProducto}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">SKU</label>
                    <input name="sku" className="form-control" required maxLength={15} />
                  </div>

                  <div className="col-md-8">
                    <label className="form-label">Nombre</label>
                    <input name="nombre" className="form-control" required maxLength={100} />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Categoría</label>
                    <select name="categoriaId" className="form-select" required>
                      <option value="">-- Seleccione --</option>
                      {categorias.map((c) => (
                        <option key={c.id} value={c.id}>{c.label}</option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Precio</label>
                    <input name="precio" type="number" className="form-control" required min="0" />
                  </div>

                  <div className="col-md-4">
                    <label className="form-label">Stock</label>
                    <input name="stock" type="number" className="form-control" required min="0" />
                  </div>

                  <div className="col-md-6">
                    <label className="form-label">Imagen</label>
                    <input type="file" className="form-control" accept="image/*" onChange={onFileCrearChange} />
                    {previewCrear && <img src={previewCrear} className="thumb mt-2" />}
                  </div>

                  <div className="col-md-12">
                    <label className="form-label">Descripción</label>
                    <textarea name="descripcion" className="form-control" rows={3} />
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

      <div className="modal fade" id="modalEditarProducto" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">

            <div className="modal-header"><h5 className="modal-title fw-bold">Editar producto</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {!productoEdit ? (
                <div className="text-center text-muted py-3">Cargando…</div>
              ) : (
                <form onSubmit={onGuardarEdicion}>
                  <div className="row g-3">

                    <div className="col-md-4">
                      <label className="form-label">SKU</label>
                      <input
                        className="form-control"
                        value={productoEdit.sku}
                        maxLength={15}
                        onChange={(e) => setProductoEdit(s => ({ ...s, sku: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-8">
                      <label className="form-label">Nombre</label>
                      <input
                        className="form-control"
                        value={productoEdit.nombre}
                        onChange={(e) => setProductoEdit(s => ({ ...s, nombre: e.target.value }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Categoría</label>
                      <select
                        className="form-select"
                        value={productoEdit.categoriaId || ""}
                        onChange={(e) => setProductoEdit(s => ({ ...s, categoriaId: Number(e.target.value) }))}
                      >
                        <option value="">-- Seleccione --</option>
                        {categorias.map(c => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>

                      {productoEdit.categoriaNombre && (
                        <div className="form-text">Actual: {productoEdit.categoriaNombre}</div>
                      )}
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Precio</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productoEdit.precio}
                        onChange={(e) => setProductoEdit(s => ({ ...s, precio: Number(e.target.value) }))}
                      />
                    </div>

                    <div className="col-md-4">
                      <label className="form-label">Stock</label>
                      <input
                        type="number"
                        className="form-control"
                        value={productoEdit.stock}
                        onChange={(e) => setProductoEdit(s => ({ ...s, stock: Number(e.target.value) }))}
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Imagen actual</label>
                      {productoEdit.imagenUrl ? (
                        <img src={productoEdit.imagenUrl} className="thumb" />
                      ) : (
                        <div className="text-muted small">Sin imagen</div>
                      )}
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Reemplazar imagen</label>
                      <input type="file" className="form-control" accept="image/*"
                        onChange={onFileEditChange} />
                      {previewEdit && <img src={previewEdit} className="thumb mt-2" />}
                    </div>

                    <div className="col-md-12">
                      <label className="form-label">Descripción</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={productoEdit.descripcion}
                        onChange={(e) => setProductoEdit(s => ({ ...s, descripcion: e.target.value }))}
                      />
                    </div>

                  </div>

                  <div className="text-end mt-4">
                    <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button className="btn btn-dark" type="submit" disabled={savingEdit}>
                      {savingEdit ? "Guardando..." : "Guardar cambios"}
                    </button>
                  </div>

                </form>
              )}
            </div>

          </div>
        </div>
      </div>

      <div className="modal fade" id="modalConfirmarEliminar" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">

            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title fw-bold">Eliminar producto</h5>
              <button className="btn-close btn-close-white" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body text-center">
              <p>¿Seguro que deseas eliminar <strong>{productoAEliminar?.nombre}</strong>?</p>
              <p className="text-muted small mb-0">Esta acción no se puede deshacer.</p>
            </div>

            <div className="modal-footer justify-content-center">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
              <button className="btn btn-danger" onClick={onEliminarConfirmado}>Eliminar</button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
