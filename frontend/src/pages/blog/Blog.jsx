import MainNavbar from "../../components/MainNavbar";
import CartModal from "../../components/CartModal";

export default function Blog() {
  return (
    <div className="container-fluid p-0">
      <MainNavbar />

      <main className="container my-4">
        <section className="news-hero mb-4">
          <div className="row align-items-center">
            <div className="col-lg-7">
              <h1 className="mb-2">Noticias &amp; Destacados</h1>
              <p className="mb-0">
                Guías de cuidado, destacados y limpieza para que tus joyas brillen siempre.
              </p>
            </div>
            <div className="col-lg-5 mt-3 mt-lg-0">
              <div className="bg-light rounded-4 p-3 text-dark">
                <strong className="d-block mb-1">Artículo destacado</strong>
                <div className="d-flex gap-3 align-items-center">
                  <div className="ratio ratio-16x9 flex-shrink-0" style={{ width: "140px" }}>
                    <div
                      className="rounded-3"
                      style={{
                        background:
                          "#ddd url('/img/fotos de cards/anillovanclef.png') center/cover no-repeat",
                      }}
                    />
                  </div>
                  <div>
                    <div className="badge text-bg-dark mb-1">Anillo Van Cleef</div>
                    <div className="news-meta">05 Sep 2025 · 3 min</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="row g-3">
          <div className="col-12 col-md-6 col-lg-4">
            <article className="card news-card h-100">
              <div className="news-thumb ratio ratio-16x9">
                <div
                  style={{
                    background: "#ddd url('/img/limpiezajoya.PNG') center/cover no-repeat",
                  }}
                />
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge text-bg-dark">Cuidados</span>
                  <span className="news-meta">28 Ago 2025 · 2 min</span>
                </div>
                <h5 className="card-title">Limpieza de plata 925 en casa</h5>
                <p className="card-text text-muted">
                  Métodos seguros para devolver brillo y evitar rayas o químicos agresivos.
                </p>
              </div>
            </article>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <article className="card news-card h-100">
              <div className="news-thumb ratio ratio-16x9">
                <div
                  style={{
                    background: "#ddd url('/img/limpiador.png') center/cover no-repeat",
                  }}
                />
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge text-bg-dark">Cuidados</span>
                  <span className="news-meta">02 Ago 2025 · 3 min</span>
                </div>
                <h5 className="card-title">Nuevo limpiador de joyas</h5>
                <p className="card-text text-muted">
                  Limpiador para plata 925: elimina la oxidación y recupera el brillo en minutos.
                  Incluye canastilla de inmersión.
                </p>
              </div>
            </article>
          </div>

          <div className="col-12 col-md-6 col-lg-4">
            <article className="card news-card h-100">
              <div className="news-thumb ratio ratio-16x9">
                <div
                  style={{
                    background:
                      "#ddd url('/img/fotos de cards/anillovanclef.png') center/cover no-repeat",
                  }}
                />
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="badge text-bg-dark">Destacados</span>
                  <span className="news-meta">21 Ago 2025 · 1 min</span>
                </div>
                <h5 className="card-title">Destacados</h5>
                <p className="card-text text-muted">
                  El producto que todos quieren.
                </p>
              </div>
            </article>
          </div>
        </section>
      </main>

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

      <div className="container-fluid p-5 my-4 bg-black rounded text-white">
        <div className="info-item mb-3">
          <h5>Envio Joyas VS</h5>
          <p style={{ color: "#e0c050" }}>
            Envío gratis en pedidos superiores a $50.000
          </p>
        </div>
        <div className="info-item mb-3">
          <h5>Devoluciones Joyas VS</h5>
          <p style={{ color: "#e0c050" }}>
            Se realizan devoluciones solo cuando el producto esté dañado.
          </p>
        </div>
        <div className="info-item mb-3">
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
        <div className="info-item mb-3">
          <h5>Redes Sociales</h5>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
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

      <footer className="site-footer text-center py-4">
        <p className="mb-0">© 2025 Joyas VS. Todos los derechos reservados.</p>
      </footer>

      <div className="modal fade" id="cartModal" tabIndex={-1} aria-hidden="true">
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Carrito</h5>
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
