// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/home/Home";
import Login from "./pages/Login/Login";
import Admin from "./pages/Admin/Admin";
import AdminProductos from "./pages/Admin/AdminProductos";
import AdminUsuarios from "./pages/Admin/AdminUsuarios";
import RequireAdmin from "./components/RequireAdmin";
import Registro from "./pages/registro/Registro.jsx";
import Nosotros from "./pages/nosotros/Nosotros.jsx";
import Blog from "./pages/blog/Blog.jsx";
import Contacto from "./pages/contacto/Contacto.jsx";

export default function App() {
  return (
    <Routes>
      {/* Redirección al home */}
      <Route path="/" element={<Navigate to="/home" replace />} />

      {/* Público */}
      <Route path="/home" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />
      <Route path="/nosotros" element={<Nosotros />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/contacto" element={<Contacto />} />

      {/* Panel administrador con protección */}
      <Route
        path="/admin"
        element={
          <RequireAdmin>
            <Admin />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin-productos"
        element={
          <RequireAdmin>
            <AdminProductos />
          </RequireAdmin>
        }
      />
      <Route
        path="/admin-usuarios"
        element={
          <RequireAdmin>
            <AdminUsuarios />
          </RequireAdmin>
        }
      />

      {/* 404 → redirección */}
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}
