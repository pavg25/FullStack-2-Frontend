import MainNavbar from "../../components/MainNavbar";
import CartModal from "../../components/CartModal";

export default function Nosotros() {
  return (
    <div className="container-fluid p-0">
      {/* Navbar arriba */}
      <MainNavbar />

      {/* Sección principal "Acerca de Nosotros" */}
      <div
        className="container-fluid p-5 my-3 rounded text-center"
        style={{
          backgroundColor: "whitesmoke",
          boxShadow: "0 4px 15px rgba(0,0,0,0.6)",
        }}
      >
        <h1 className="mb-4" style={{ color: "black" }}>
          Acerca de Nosotros
        </h1>
        <p
          style={{
            color: "black",
            maxWidth: "700px",
            margin: "0 auto",
            textAlign: "justify",
            lineHeight: 1.6,
          }}
        >
          Somos una tienda online de joyas, iniciada como proyecto en Instagram
          juntos como pareja. Ofrecemos joyas de plata 925 nacional y aros de
          plata italiana 925, incluyendo collares, anillos y modelos inspirados
          en marcas reconocidas como Van Cleef, entre otras. Realizamos
          entregas coordinadas y ocasionalmente mostramos nuestro stock en
          lives de TikTok, brindando un servicio cercano y confiable a nuestros
          clientes.
        </p>
        <div className="mt-4">
          {/* Asegúrate de que el logo esté en public/img/logojoyas.jpn.png */}
          <img
            src="/img/logojoyas.jpn.png"
            alt="Logo Joyas VS"
            style={{ width: "100px" }}
          />
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

      {/* Modal carrito */}
      <div className="modal fade" id="cartModal" tabIndex="-1" aria-hidden="true">
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
