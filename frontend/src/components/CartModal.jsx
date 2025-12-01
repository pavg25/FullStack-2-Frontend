// src/components/CartModal.jsx
import { useEffect, useMemo, useState } from "react";
import { useCart } from "../context/CartContext";
import { simularCheckout } from "../services/cartServices";
import { getAuth } from "../services/authServices";
import { listarProductos } from "../services/productServices";

export default function CartModal() {
  const { cart, setQty, remove, clear } = useCart();

  const items = cart.items || [];

  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // 🔹 Productos desde el backend para poder mostrar nombre y precio
  const [productosIndex, setProductosIndex] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const data = await listarProductos();
        const idx = {};
        if (Array.isArray(data)) {
          data.forEach((p) => {
            if (p && p.id != null) {
              idx[Number(p.id)] = p;
            }
          });
        }
        setProductosIndex(idx);
      } catch (e) {
        console.error("Error cargando productos para el carrito", e);
      }
    })();
  }, []);

  // 🔹 Normalizamos items del carrito a { productId, qty } válidos
  const normalizedItems = useMemo(
    () =>
      items
        .map((it) => {
          const pid = Number(it.productId);
          const qty = Number(it.qty) || 1;
          if (!pid || Number.isNaN(pid)) return null;
          return { productId: pid, qty };
        })
        .filter(Boolean),
    [items]
  );

  const totalQty = normalizedItems.reduce(
    (s, it) => s + it.qty,
    0
  );

  // Subtotal con precios reales (si existen)
  const subtotal = normalizedItems.reduce((sum, it) => {
    const prod = productosIndex[it.productId];
    const precio = Number(prod?.precio) || 0;
    return sum + precio * it.qty;
  }, 0);

  const toCLP = (n) =>
    (Number(n) || 0).toLocaleString("es-CL", {
      style: "currency",
      currency: "CLP",
      maximumFractionDigits: 0,
    });

  async function handlePagar() {
    setError("");
    setSuccess("");

    if (!normalizedItems.length) {
      setError("El carrito está vacío.");
      return;
    }

    const { user } = getAuth();
    const email = user?.correo;
    const rol = user?.rol;

    if (!email) {
      setError("Debes iniciar sesión para completar la compra.");
      return;
    }

    // Admin NO puede comprar
    if (rol?.toLowerCase() === "administrador") {
      setError("Un administrador no puede realizar compras.");
      return;
    }

    try {
      setProcessing(true);

      // Enviamos los items normalizados al backend
      const resp = await simularCheckout(normalizedItems, email);

      clear();

      setSuccess(
        `Compra realizada con éxito. N° de orden: ${
          resp.orderId || resp.id || "—"
        }`
      );
    } catch (e) {
      // Aquí el 403 se refleja como mensaje amigable
      setError(
        e.message ||
          "No se pudo procesar el pago (puede ser un problema de permisos / 403)."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <>
      {error && (
        <div className="alert alert-danger py-2">{error}</div>
      )}
      {success && (
        <div className="alert alert-success py-2">{success}</div>
      )}

      {!normalizedItems.length ? (
        <div className="text-center text-muted py-4">
          Tu carrito está vacío.
        </div>
      ) : (
        <>
          <table className="table align-middle">
            <thead>
              <tr>
                <th>Producto</th>
                <th className="text-end">Precio</th>
                <th className="text-center" style={{ width: 120 }}>
                  Cantidad
                </th>
                <th className="text-end">Total</th>
                <th className="text-center" style={{ width: 90 }}>
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {normalizedItems.map((it) => {
                const prod = productosIndex[it.productId];
                const nombre =
                  prod?.nombre || `Producto #${it.productId}`;
                const precio = Number(prod?.precio) || 0;
                const linea = precio * it.qty;

                return (
                  <tr key={it.productId}>
                    <td>{nombre}</td>
                    <td className="text-end">
                      {toCLP(precio)}
                    </td>
                    <td className="text-center">
                      <input
                        type="number"
                        min={1}
                        className="form-control form-control-sm text-center"
                        value={it.qty}
                        onChange={(e) =>
                          setQty(
                            it.productId,
                            Number(e.target.value) || 1
                          )
                        }
                      />
                    </td>
                    <td className="text-end">
                      {toCLP(linea)}
                    </td>
                    <td className="text-center">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => remove(it.productId)}
                      >
                        Quitar
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <div>
                Ítems: <strong>{totalQty}</strong>
              </div>
              <div>
                Subtotal: <strong>{toCLP(subtotal)}</strong>
              </div>
              <div>
                Envío: <strong>{toCLP(0)}</strong>
              </div>
              <div>
                Total: <strong>{toCLP(subtotal)}</strong>
              </div>
            </div>
            <div className="d-flex gap-2">
              <button
                className="btn btn-outline-danger"
                onClick={clear}
                disabled={processing}
              >
                Vaciar
              </button>
              <button
                className="btn btn-dark"
                disabled={!normalizedItems.length || processing}
                onClick={handlePagar}
              >
                {processing ? "Procesando..." : "Ir a pagar"}
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}
