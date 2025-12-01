import { Link, useNavigate } from "react-router-dom";
import { getAuth, logout as authLogout } from "../services/authServices";

export default function MainNavbar({ showCart = true }) {
  const navigate = useNavigate();

  const { user } = getAuth();
  const userEmail = user?.correo;
  const rol = user?.rol;

  function handleLogout() {
    authLogout(); 
    navigate("/login", { replace: true });
  }

  return (
    <nav
      className="navbar navbar-expand-sm navbar-dark"
      style={{ background: "#000" }}
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/home">
          <img
            src="/img/logotienda.jpeg"
            alt="logo"
            className="rounded-pill"
            style={{ width: 50 }}
          />
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#menuNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="menuNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/home">
                Tienda
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/nosotros">
                Nosotros
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/blog">
                Blog
              </Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/contacto">
                Contacto
              </Link>
            </li>

            {rol?.toLowerCase() === "administrador" && (
              <li className="nav-item">
                <Link className="nav-link" to="/admin">
                  Administrar
                </Link>
              </li>
            )}
          </ul>

          <ul className="navbar-nav ms-auto align-items-center">
            {showCart && (
              <li className="nav-item me-2">
                <button
                  className="btn btn-outline-light btn-sm position-relative"
                  type="button"
                  data-bs-toggle="modal"
                  data-bs-target="#cartModal"
                >
                  <img src="/img/bolsa.png" style={{ width: 25 }} />
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger d-none cart-badge">
                    0
                  </span>
                </button>
              </li>
            )}

            {!userEmail ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/login">
                    Login
                  </Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registro">
                    Registro
                  </Link>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <button
                  className="btn btn-danger btn-sm ms-2"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
}
