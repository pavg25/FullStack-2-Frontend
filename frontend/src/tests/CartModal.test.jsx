import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

import CartModal from "../components/CartModal";
import * as cartContext from "../context/CartContext";
import * as productServices from "../services/productServices";

test("muestra items del carrito y resumen", async () => {
  // Mock del contexto del carrito
  vi.spyOn(cartContext, "useCart").mockReturnValue({
    cart: {
      items: [
        { productId: 1, qty: 2 },
        { productId: 2, qty: 1 },
      ],
    },
    setQty: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  });

  // Mock del servicio de productos
  vi.spyOn(productServices, "listarProductos").mockResolvedValue([
    { id: 1, nombre: "Anillo oro", precio: 5000 },
    { id: 2, nombre: "Collar plata", precio: 8000 },
  ]);

  render(<CartModal />);

  // Productos en la tabla
  expect(await screen.findByText(/Anillo oro/i)).toBeInTheDocument();
  expect(await screen.findByText(/Collar plata/i)).toBeInTheDocument();

  // Resumen (ítems, subtotal, envío)
  expect(await screen.findByText(/Ítems:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Subtotal:/i)).toBeInTheDocument();
  expect(await screen.findByText(/Envío:/i)).toBeInTheDocument();

  // Botón "Ir a pagar"
  expect(
    await screen.findByRole("button", { name: /Ir a pagar/i })
  ).toBeInTheDocument();
});
