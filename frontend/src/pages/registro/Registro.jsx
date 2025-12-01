// src/pages/registro/Registro.jsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { crearUsuario } from "../../services/userServices";
import { login } from "../../services/authServices";
import MainNavbar from "../../components/MainNavbar";

export default function Registro() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    run: "",
    nombre: "",
    apellidos: "",
    correo: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errGeneral, setErrGeneral] = useState("");

  function validar() {
    const e = {};

    if (!form.run.trim()) e.run = "RUN requerido";
    if (!form.nombre.trim()) e.nombre = "Nombre requerido";
    if (!form.apellidos.trim()) e.apellidos = "Apellidos requeridos";

    if (!form.correo.trim()) {
      e.correo = "Correo requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      e.correo = "Correo inválido";
    }

    if (!form.password.trim()) {
      e.password = "Contraseña requerida";
    } else if (form.password.length < 6) {
      e.password = "Min 6 caracteres";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
    setErrGeneral("");
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErrGeneral("");

    // 👉 ahora sí se ejecuta validar()
    if (!validar()) return;

    setLoading(true);
    try {
      const payload = {
        ...form,
        rol: "Cliente",
      };

      await crearUsuario(payload);

      // LOGIN AUTOMÁTICO
      await login(form.correo, form.password);

      navigate("/home", { replace: true });
    } catch (err) {
      setErrGeneral(err?.message || "Error al registrar usuario");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Navbar igual que en Login */}
      <MainNavbar />

      {/* Contenedor ancho tipo "login antiguo" */}
      <div className="container mt-4">
        <h2 className="text-center mb-4">Crear cuenta</h2>

        {errGeneral && <div className="alert alert-danger">{errGeneral}</div>}

        {/* 👇 IMPORTANTE: noValidate para desactivar validación nativa */}
        <form
          onSubmit={onSubmit}
          noValidate
          className="p-4 border rounded bg-white"
        >
          {/* RUN */}
          <div className="mb-3">
            <label className="form-label">RUN</label>
            <input
              name="run"
              className={`form-control ${errors.run ? "is-invalid" : ""}`}
              value={form.run}
              onChange={onChange}
              placeholder="20.123.456-7"
              autoComplete="off"
            />
            {errors.run && (
              <div className="invalid-feedback">{errors.run}</div>
            )}
          </div>

          {/* Nombre */}
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              name="nombre"
              className={`form-control ${errors.nombre ? "is-invalid" : ""}`}
              value={form.nombre}
              onChange={onChange}
              autoComplete="given-name"
            />
            {errors.nombre && (
              <div className="invalid-feedback">{errors.nombre}</div>
            )}
          </div>

          {/* Apellidos */}
          <div className="mb-3">
            <label className="form-label">Apellidos</label>
            <input
              name="apellidos"
              className={`form-control ${errors.apellidos ? "is-invalid" : ""}`}
              value={form.apellidos}
              onChange={onChange}
              autoComplete="family-name"
            />
            {errors.apellidos && (
              <div className="invalid-feedback">{errors.apellidos}</div>
            )}
          </div>

          {/* Correo */}
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              name="correo"
              className={`form-control ${errors.correo ? "is-invalid" : ""}`}
              value={form.correo}
              onChange={onChange}
              placeholder="ejemplo@gmail.com"
              autoComplete="email"
            />
            {errors.correo && (
              <div className="invalid-feedback">{errors.correo}</div>
            )}
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              name="password"
              className={`form-control ${
                errors.password ? "is-invalid" : ""
              }`}
              value={form.password}
              onChange={onChange}
              placeholder="********"
              autoComplete="new-password"
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          <button className="btn btn-dark w-100" disabled={loading}>
            {loading ? "Registrando..." : "Crear cuenta"}
          </button>

          <div className="text-center mt-3">
            ¿Ya tienes cuenta? <Link to="/login">Inicia sesión</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
