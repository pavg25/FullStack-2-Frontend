import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Home from "../pages/home/Home";
import * as cartContext from "../context/CartContext";
import * as productServices from "../services/productServices";

test("muestra joyas más vendidas desde el servicio", async () => {
  vi.spyOn(cartContext, "useCart").mockReturnValue({
    cart: { items: [] },
    add: vi.fn(),
  });

  vi.spyOn(productServices, "listarProductos").mockResolvedValue([
    { id: 1, nombre: "Anillo Oro", precio: 10000, activo: true },
    { id: 2, nombre: "Collar Plata", precio: 8000, activo: true },
  ]);

  render(
    <MemoryRouter>
      <Home />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/Joyas Más Vendidas/i)
  ).toBeInTheDocument();

  expect(
    await screen.findByText(/Anillo Oro/i)
  ).toBeInTheDocument();

  expect(
    await screen.findByText(/Collar Plata/i)
  ).toBeInTheDocument();
});
