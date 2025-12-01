import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../services/authServices";
import MainNavbar from "../../components/MainNavbar";

export default function Login() {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  function validarFormulario() {
    const e = {};

    const correoTrim = email.trim();

    if (!correoTrim) {
      e.email = "Correo requerido.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correoTrim)) {
      e.email = "Debe ingresar un correo válido.";
    }

    if (!password) {
      e.password = "Contraseña requerida.";
    } else if (password.length < 6) {
      e.password = "La contraseña debe tener al menos 6 caracteres.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setErr("");

    if (!validarFormulario()) {
      setErr("Debe completar todos los campos correctamente.");
      return;
    }

    setLoading(true);

    try {
      const user = await login(email.trim(), password);

      if (user?.rol?.toLowerCase() === "administrador") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }

    } catch (error) {
      setErr(error?.message || "Credenciales inválidas.");
      setErrors(prev => ({
        ...prev,
        password: "Correo o contraseña incorrectos."
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="container-fluid p-0">
      {/* Navbar como en Registro */}
      <MainNavbar />

      {/* Card centrada */}
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "calc(100vh - 80px)" }}
      >
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">

              <h2 className="text-center mb-4">Iniciar Sesión</h2>

              {err && <div className="alert alert-danger">{err}</div>}

              {/* 👇 Desactivamos validación nativa con noValidate */}
              <form onSubmit={onSubmit} noValidate>

                {/* CORREO */}
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className={`form-control ${errors.email ? "is-invalid" : ""}`}
                    placeholder="ejemplo@gmail.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors(prev => ({ ...prev, email: undefined }));
                      setErr("");
                    }}
                    autoComplete="username"
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email}
                    </div>
                  )}
                </div>

                {/* CONTRASEÑA */}
                <div className="mb-3">
                  <label className="form-label">Contraseña</label>
                  <input
                    type={showPass ? "text" : "password"}
                    className={`form-control ${errors.password ? "is-invalid" : ""}`}
                    placeholder="*********"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setErrors(prev => ({ ...prev, password: undefined }));
                      setErr("");
                    }}
                    autoComplete="current-password"
                  />
                  {errors.password && (
                    <div className="invalid-feedback">
                      {errors.password}
                    </div>
                  )}

                  <button
                    type="button"
                    className="btn btn-link p-0 mt-1"
                    onClick={() => setShowPass(!showPass)}
                  >
                    {showPass ? "Ocultar" : "Ver contraseña"}
                  </button>
                </div>

                <button className="btn btn-dark w-100" disabled={loading}>
                  {loading ? "Ingresando..." : "Ingresar"}
                </button>

                <div className="text-center mt-3">
                  ¿No tienes cuenta? <Link to="/registro">Regístrate</Link>
                </div>

              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
