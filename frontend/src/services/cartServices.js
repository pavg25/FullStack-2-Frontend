import { httpJson } from "../utils/http";

const API_BASE = "http://localhost:8081/api/orders";

export async function simularCheckout(items, email) {
  if (!Array.isArray(items) || !items.length) {
    throw new Error("El carrito está vacío.");
  }

  if (!email) {
    throw new Error("Correo del cliente no especificado.");
  }

  const normalizedItems = items
    .map((it) => {
      const productId =
        it.productId ??        
        it.id ??               
        (it.product && it.product.id); 

      const quantity =
        it.qty ??              
        it.cantidad ??
        it.quantity ??
        1;

      return { productId, quantity };
    })
    .filter((it) => it.productId && it.quantity > 0);

  if (!normalizedItems.length) {
    throw new Error("No hay items válidos en el carrito.");
  }

  const body = {
    email,
    items: normalizedItems,
  };

  return httpJson(`${API_BASE}/checkout`, {
    method: "POST",
    body,
  });
}
