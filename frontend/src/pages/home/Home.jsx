// src/pages/home/Home.jsx
import { useEffect, useState } from "react";
import { listarProductos } from "../../services/productServices";
import { useCart } from "../../context/CartContext";
import CartModal from "../../components/CartModal";
import MainNavbar from "../../components/MainNavbar";

export default function Home() {
  const [best, setBest] = useState([]);
  const [loadingBest, setLoadingBest] = useState(true);
  const [errBest, setErrBest] = useState("");

  const [product, setProduct] = useState(null);
  const [principalImg, setPrincipalImg] = useState("");
  const [qty, setQty] = useState(1);
  const [cartMsg, setCartMsg] = useState(""); // mensaje "añadido al carrito"

  const { add } = useCart();
  const NO_IMAGE = "/img/no-image.png";

  const getCategoriaNombre = (c) =>
    c && typeof c === "object" ? c.nombre : c || "";

  const getImg = (p) => {
    return (
      p?.imagenUrl ||
      p?.imagen ||
      (Array.isArray(p?.imagenes) && p.imagenes[0]) ||
      NO_IMAGE
    );
  };

  const toCLP = (n) =>
    (Number(n) || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  useEffect(() => {
    (async () => {
      try {
        setLoadingBest(true);
        const data = await listarProductos();
        setBest(Array.isArray(data) ? data.slice(0, 4) : []);
      } catch (e) {
        setErrBest("No se pudieron cargar los productos");
      } finally {
        setLoadingBest(false);
      }
    })();
  }, []);

  function openProductModal(p) {
    setProduct(p);
    setPrincipalImg(getImg(p));
    setQty(1);
    setCartMsg(""); // limpiar mensaje al abrir
    if (window.bootstrap) {
      const el = document.getElementById("modalProducto");
      (window.bootstrap.Modal.getInstance(el) ||
        new window.bootstrap.Modal(el)
      ).show();
    }
  }

  function addToCart() {
    if (!product) return;
    add(product.id, qty);
    setCartMsg("Producto añadido al carrito.");

  }
  return (
    <div className="container-fluid p-0">
      {/* Navbar arriba */}
      <MainNavbar />

      {/* Carrusel centrado */}
      <div className="container my-4">
        <div
          id="homeCarousel"
          className="carousel slide mx-auto shadow rounded-4 overflow-hidden"
          data-bs-ride="carousel"
          style={{
            maxWidth: "900px",
            maxHeight: "420px",
          }}
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="0"
              className="active"
            ></button>
            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="1"
            ></button>
            <button
              type="button"
              data-bs-target="#homeCarousel"
              data-bs-slide-to="2"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <img
                src="/img/foto carrusel/cadenaypulseravan.png"
                className="d-block w-100"
                style={{ maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="/img/foto carrusel/aritos2.png"
                className="d-block w-100"
                style={{ maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
            <div className="carousel-item">
              <img
                src="/img/foto carrusel/imagencarrusel.PNG"
                className="d-block w-100"
                style={{ maxHeight: "420px", objectFit: "cover" }}
              />
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon"></span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#homeCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon"></span>
          </button>
        </div>
      </div>

      {/* Más vendidos */}
      <div className="my-3 text-center">
        <div className="p-3 bg-white rounded">
          <h3 className="fw-bold">💎 Joyas Más Vendidas 💎</h3>
          <p className="text-muted">
            Joyas inspiradas en tendencias internacionales
          </p>
        </div>
      </div>

      <div className="container mb-5">
        <div className="row" style={{ marginTop: 15 }}>
          {loadingBest && (
            <div className="col-12 text-center">Cargando…</div>
          )}
          {errBest && <div className="alert alert-danger">{errBest}</div>}
          {!loadingBest && !errBest && best.length === 0 && (
            <div className="col-12 text-center text-muted">
              Sin productos
            </div>
          )}

          {!loadingBest &&
            best.map((p) => (
              <div className="col-6 col-md-4 col-lg-3 mb-4" key={p.id}>
                <div className="card h-100">
                  <div className="product-img-wrap p-2 bg-white">
                    <img
                      src={getImg(p)}
                      onError={(e) => {
                        e.target.src = NO_IMAGE;
                      }}
                      className="product-img"
                      alt={p.nombre}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h6>{p.nombre}</h6>
                    <div className="text-muted small mb-2">
                      {getCategoriaNombre(p.categoria)}
                    </div>
                    <div className="fw-bold mb-3">
                      {toCLP(p.precio)}
                    </div>
                    <button
                      className="btn btn-dark mt-auto"
                      onClick={() => openProductModal(p)}
                    >
                      Ver detalle
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Destacados */}
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
              Entregas en RM el mismo día y 1 a 3 días en regiones.
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

      {/* Información adicional */}
      <div className="container-fluid p-5 my-4 bg-black rounded text-white">
        <div className="mb-3">
          <h5>Envío Joyas VS</h5>
          <p style={{ color: "#e0c050" }}>
            Envío gratis en pedidos superiores a $50.000
          </p>
        </div>

        <div className="mb-3">
          <h5>Devoluciones Joyas VS</h5>
          <p style={{ color: "#e0c050" }}>
            Se realizan devoluciones solo cuando el producto está dañado.
          </p>
        </div>

        <div className="mb-3">
          <h5>Teléfono Joyas VS</h5>
          <p style={{ color: "#e0c050" }}>+56 966 266 046</p>
          <p style={{ color: "#e0c050" }}>
            ¿Necesitas ayuda? Escríbenos tu opinión:
          </p>
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Escribe tu opinión"
          />
        </div>

        <div className="mb-3">
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

      {/* Footer */}
      <footer className="text-center py-3 mt-3">
        <p className="mb-0">© 2025 Joyas VS. Todos los derechos reservados.</p>
      </footer>

      {/* Modal detalle producto */}
      <div className="modal fade" id="modalProducto" tabIndex="-1">
        <div className="modal-dialog modal-xl modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <button className="btn-close" data-bs-dismiss="modal"></button>
            </div>

            <div className="modal-body">
              {product && (
                <div className="row g-4">
                  <div className="col-lg-7">
                    <img src={principalImg} alt="" className="w-100" />
                  </div>

                  <div className="col-lg-5">
                    <h3>{product.nombre}</h3>
                    <h4 className="text-primary">{toCLP(product.precio)}</h4>

                    <div className="d-flex align-items-center gap-2 mt-3">
                      <label className="form-label mb-0">Cantidad:</label>
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm"
                        style={{ width: "80px" }}
                        value={qty}
                        onChange={(e) =>
                          setQty(Number(e.target.value) || 1)
                        }
                      />
                    </div>

                    <button
                      className="btn btn-primary w-100 mt-3"
                      onClick={addToCart}
                    >
                      Añadir al carrito
                    </button>

                    {cartMsg && (
                      <div className="alert alert-success mt-3 py-2 mb-0">
                        {cartMsg}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal carrito */}
      <div className="modal fade" id="cartModal" tabIndex="-1">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5>Carrito</h5>
              <button className="btn-close" data-bs-dismiss="modal"></button>
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
