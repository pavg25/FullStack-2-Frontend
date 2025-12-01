import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";

import Login from "../pages/Login/Login";
import * as authServices from "../services/authServices";

test("envía correo y contraseña al hacer login", async () => {
  const loginMock = vi
    .spyOn(authServices, "login")
    .mockResolvedValue({
      correo: "cliente@prueba.com",
      rol: "Cliente",
      token: "fake-token",
    });

  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

  const emailInput = screen.getByPlaceholderText(/ejemplo@gmail.com/i);
  const passwordInput = screen.getByPlaceholderText(/\*+/);

  fireEvent.change(emailInput, { target: { value: "cliente@prueba.com" } });
  fireEvent.change(passwordInput, { target: { value: "123456" } });

  fireEvent.click(screen.getByRole("button", { name: /ingresar/i }));

  await waitFor(() => {
    expect(loginMock).toHaveBeenCalledWith("cliente@prueba.com", "123456");
  });
});
