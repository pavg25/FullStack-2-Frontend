import { render, screen } from "@testing-library/react";

// Componente de prueba simple
function HolaTests() {
  return <h1>Hola tests</h1>;
}

test("muestra el texto 'Hola tests'", () => {
  render(<HolaTests />);

  const title = screen.getByText(/hola tests/i);
  expect(title).toBeInTheDocument();
});
