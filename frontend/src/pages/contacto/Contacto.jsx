// src/pages/contacto/Contacto.jsx
import { useState } from "react";
import MainNavbar from "../../components/MainNavbar";
import CartModal from "../../components/CartModal";

export default function Contacto() {
  const MAX_CHARS = 500;

  const [form, setForm] = useState({
    nombre: "",
    correo: "",
    mensaje: "",
  });

  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("");
  const [statusType, setStatusType] = useState("success"); // "success" | "danger"

  const restantes = Math.max(0, MAX_CHARS - (form.mensaje?.length || 0));

  function validar() {
    const e = {};

    // Nombre
    if (!form.nombre.trim()) {
      e.nombre = "Nombre requerido";
    }

    // Correo
    if (!form.correo.trim()) {
      e.correo = "Correo requerido";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.correo.trim())) {
      e.correo = "Correo inválido";
    }

    // Mensaje
    const msg = form.mensaje.trim();
    if (!msg) {
      e.mensaje = "Mensaje requerido";
    } else if (msg.length > MAX_CHARS) {
      e.mensaje = `Máximo ${MAX_CHARS} caracteres`;
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function onChange(e) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error de ese campo cuando el usuario lo corrige
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));

    // Si el usuario está escribiendo de nuevo, limpiamos mensaje general
    setStatus("");
  }

  function onSubmit(e) {
    e.preventDefault();
    setStatus("");

    if (!validar()) {
      setStatus("Faltan datos en el formulario.");
      setStatusType("danger");
      return;
    }

    // Aquí podrías hacer un fetch a tu backend en el futuro
    setStatus("Mensaje enviado (demo). Pronto nos pondremos en contacto.");
    setStatusType("success");
  }

  function onReset() {
    setForm({
      nombre: "",
      correo: "",
      mensaje: "",
    });
    setErrors({});
    setStatus("");
    setStatusType("success");
  }

  return (
    <div className="container-fluid p-0">
      {/* NAVBAR SUPERIOR */}
      <MainNavbar />

      {/* === FORMULARIO DE CONTACTO === */}
      <section id="contacto" className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="card border-0 rounded-4 formulario-fondo">
              <div className="card-body p-4">
                <h2 className="h4 mb-3">Contáctanos</h2>

                {/* Mensaje de estado (éxito / error) */}
                {status && (
                  <div
                    className={`alert alert-${statusType} py-2 mb-3`}
                  >
                    {status}
                  </div>
                )}

                <form
                  id="form-contacto"
                  noValidate
                  onSubmit={onSubmit}
                  onReset={onReset}
                >
                  {/* Nombre completo */}
                  <div className="mb-3">
                    <label htmlFor="cNombre" className="form-label">
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.nombre ? "is-invalid" : ""
                      }`}
                      id="cNombre"
                      name="nombre"
                      placeholder="Tu nombre y apellidos"
                      autoComplete="name"
                      value={form.nombre}
                      onChange={onChange}
                    />
                    {errors.nombre && (
                      <div className="invalid-feedback">
                        {errors.nombre}
                      </div>
                    )}
                  </div>

                  {/* Correo */}
                  <div className="mb-3">
                    <label htmlFor="cEmail" className="form-label">
                      Correo electrónico
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        errors.correo ? "is-invalid" : ""
                      }`}
                      id="cEmail"
                      name="correo"
                      placeholder="tucorreo@ejemplo.com"
                      autoComplete="email"
                      value={form.correo}
                      onChange={onChange}
                    />
                    {errors.correo && (
                      <div className="invalid-feedback">
                        {errors.correo}
                      </div>
                    )}
                  </div>

                  {/* Mensaje */}
                  <div className="mb-3">
                    <label htmlFor="cMensaje" className="form-label">
                      Mensaje
                    </label>
                    <textarea
                      className={`form-control ${
                        errors.mensaje ? "is-invalid" : ""
                      }`}
                      id="cMensaje"
                      name="mensaje"
                      rows={5}
                      placeholder="Escribe tu mensaje aquí…"
                      value={form.mensaje}
                      onChange={onChange}
                    />
                    {errors.mensaje && (
                      <div className="invalid-feedback">
                        {errors.mensaje}
                      </div>
                    )}

                    <div className="d-flex justify-content-between mt-1">
                      <small className="text-muted">
                        Máximo {MAX_CHARS} caracteres.
                      </small>
                      <small className="text-muted">
                        Restantes: <span>{restantes}</span>
                      </small>
                    </div>
                  </div>

                  <div className="d-grid d-sm-flex gap-2">
                    <button type="submit" className="btn btn-dark">
                      Enviar
                    </button>
                    <button type="reset" className="btn btn-outline-secondary">
                      Limpiar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === DESTACADOS (ICONOS) === */}
      <div className="container-fluid my-5">
        <div className="row text-center">
          <div className="col-md-3 col-6 mb-4">
            <img
              src="/img/diamante.png"
              alt="Descubre Joyas"
              style={{ width: "50px", height: "50px" }}
            />
            <h5 className="mt-3">Descubre tu estilo</h5>
            <p className="text-muted small">
              Encuentra la joya perfecta para ti y luce única cada día.
            </p>
          </div>

          <div className="col-md-3 col-6 mb-4">
            <img
              src="/img/presenta.png"
              alt="Empaque de regalo"
              style={{ width: "50px", height: "50px" }}
            />
            <h5 className="mt-3">Empaque para regalar</h5>
            <p className="text-muted small">
              Agrega nuestro empaque especial y sorprende con tu regalo.
            </p>
          </div>

          <div className="col-md-3 col-6 mb-4">
            <img
              src="/img/entrega.png"
              alt="Envíos rápidos"
              style={{ width: "50px", height: "50px" }}
            />
            <h5 className="mt-3">Envíos rápidos</h5>
            <p className="text-muted small">
              Entrega en RM el mismo día y 1 a 3 días en regiones.
            </p>
          </div>

          <div className="col-md-3 col-6 mb-4">
            <img
              src="/img/tarjeta-de-credito.png"
              alt="Pago seguro"
              style={{ width: "50px", height: "50px" }}
            />
            <h5 className="mt-3">Pago seguro</h5>
            <p className="text-muted small">
              Compra tranquila con tarjetas a través de WebPay.
            </p>
          </div>
        </div>
      </div>

      {/* === BLOQUE NEGRO DE INFO === */}
      <div className="container-fluid p-5 my-4 bg-black rounded text-white">
        <div className="info-item mb-3">
          <h5>Envio Joyas Vs</h5>
          <p style={{ color: "#e0c050" }}>
            Envío gratis en pedidos superiores a $50.000
          </p>
        </div>

        <div className="info-item mb-3">
          <h5>Devoluciones Joyas Vs</h5>
          <p style={{ color: "#e0c050" }}>
            Devoluciones: Hasta 10 días para devolver
          </p>
        </div>

        <div className="info-item mb-3">
          <h5>Teléfono Joyas Vs</h5>
          <p style={{ color: "#e0c050" }}>+56 966 266 046</p>
          <p style={{ color: "#e0c050" }}>
            ¿Necesitas ayuda? Conéctese usando nuestro chat
          </p>
          <p style={{ color: "#e0c050" }}>Escríbenos tu opinión:</p>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Escribe tu opinión"
          />
        </div>

        <div className="info-item mb-3">
          <h5>Redes Sociales</h5>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <a
              href="https://www.instagram.com/joyass.vs?igsh=ejhyd2liMHY2Yjhx"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/img/instagram.png"
                alt="Instagram"
                width="40"
                height="40"
              />
            </a>
            <a
              href="https://www.tiktok.com/@joyas.vs?_t=ZM-8zTkFxbGvf4&_r=1"
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/img/social-media.png"
                alt="TikTok"
                width="40"
                height="40"
              />
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="site-footer text-center py-4">
        <p className="mb-0">© 2025 Joyas VS. Todos los derechos reservados.</p>
      </footer>

      {/* MODAL CARRITO (con CartModal) */}
      <div className="modal fade" id="cartModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Carrito de compras</h5>
              <button className="btn-close" data-bs-dismiss="modal" />
            </div>
            <div className="modal-body">
              <CartModal />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
