import { useState } from "react";
import { useCart } from "../contexts/CartContext";

function toCLP(n) {
  return (Number(n) || 0).toLocaleString("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  });
}
function resolveImage(p) {
  const direct =
    p?.imagenUrl || p?.imageUrl || p?.imagen || p?.image || p?.urlImagen || "";
  if (direct) return direct;

  const sku = (p?.sku || "").toString().trim();
  if (sku) {
    return `/img/products/${sku.toLowerCase()}.jpg`;
  }
  return "/img/products/placeholder.jpg"; 
}

export default function ProductCard({ product }) {
  const { add } = useCart();
  const [adding, setAdding] = useState(false);

  const img = resolveImage(product);
  const disponible = Number(product?.stock) > 0 && product?.activo !== false;

  async function onAdd() {
    if (!product?.id || !disponible) return;
    setAdding(true);
    try {
      await add({ id: product.id }, 1);
    } finally {
      setAdding(false);
    }
  }

  return (
    <div className="card h-100 shadow-sm">
      <img
        src={img}
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = "/img/products/placeholder.jpg";
        }}
        className="card-img-top"
        alt={product?.nombre || product?.sku || "producto"}
        style={{ objectFit: "cover", height: 180 }}
      />
      <div className="card-body d-flex flex-column">
        <h6 className="card-title mb-1">{product?.nombre}</h6>
        <div className="text-muted small mb-2">
          SKU: {product?.sku || "—"} · {product?.categoria?.nombre || "Sin categoría"}
        </div>

        <div className="mt-auto d-flex align-items-center justify-content-between">
          <div className="fw-bold">{toCLP(product?.precio)}</div>
          {disponible ? (
            <button className="btn btn-dark btn-sm" onClick={onAdd} disabled={adding}>
              {adding ? "Agregando..." : "Agregar"}
            </button>
          ) : (
            <span className="badge text-bg-secondary">Sin stock</span>
          )}
        </div>
      </div>
    </div>
  );
}
