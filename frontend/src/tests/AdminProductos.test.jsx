import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import AdminProductos from "../pages/Admin/AdminProductos";
import * as productServices from "../services/productServices";

test("muestra 'Sin productos' cuando la lista está vacía", async () => {
  // Simulamos usuario administrador en localStorage
  localStorage.setItem(
    "auth_user",
    JSON.stringify({
      rol: "Administrador",
      correo: "admin@joyasvs.com",
      nombre: "Admin",
    })
  );

  vi.spyOn(productServices, "listarProductos").mockResolvedValue([]);

  render(
    <MemoryRouter>
      <AdminProductos />
    </MemoryRouter>
  );

  expect(
    await screen.findByText(/Sin productos/i)
  ).toBeInTheDocument();
});
