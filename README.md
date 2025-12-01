
# Joyas VS – Frontend

Este repositorio contiene el frontend de la tienda de joyas, Joyas VS. Desarrollado con React, React Router y Vite.
Frontend de la tienda de joyas Joyas VS construido con React, React Router y Vite. El proyecto usa Vitest + React Testing Library para pruebas.

1. Requisitos

Node.js 20 o superior  
npm (incluido con Node)
Backend de productos ejecutándose en `http://localhost:8081` (microservicio ProductosJSS)

2. Instalación
bash
## Instalación
```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/TU_REPO_FRONT.git
cd TU_REPO_FRONT

# Instalar dependencias
npm install
```

## Scripts principales
- `npm run dev`: servidor de desarrollo.
- `npm run build`: compila la app para producción.
- `npm run preview`: vista previa del build.
- `npm run lint`: ejecuta ESLint.
- `npm test`: corre la suite de pruebas con Vitest.
- `npm run test:ui`: abre la interfaz de Vitest para depurar pruebas.

## Pruebas y cobertura
### Stack de pruebas
- Entorno `jsdom` con Vitest y React Testing Library.
- Configuración global en `src/tests/setupTests.js` que agrega aserciones de `@testing-library/jest-dom`.

### Cobertura actual (`src/tests`)
| Área / Componente | Archivo de prueba | Qué valida | Dependencias simuladas |
| --- | --- | --- | --- |
| Página de inicio (Home) | `Home.test.jsx` | Renderiza el bloque "Joyas Más Vendidas" y los nombres devueltos por el servicio de productos. | `useCart` y `listarProductos` son mockeados para controlar el carrito y el catálogo. |
| Formulario de login | `Login.test.jsx` | Envía el correo y la contraseña capturados en los inputs al servicio `login` al presionar "Ingresar". | `login` es mockeado para evitar llamadas reales. |
| Administración de productos | `AdminProductos.test.jsx` | Muestra el estado vacío "Sin productos" cuando el servicio devuelve una lista vacía; simula a un usuario administrador en `localStorage`. | `listarProductos` es mockeado y se precarga `auth_user` en `localStorage`. |
| Modal del carrito | `CartModal.test.jsx` | Renderiza los ítems del carrito, el resumen (ítems, subtotal, envío) y el botón "Ir a pagar" usando datos de catálogo. | `useCart` y `listarProductos` son mockeados para controlar cantidades y precios. |
| Prueba de humo | `smoke.test.jsx` | Verifica que el entorno de pruebas renderice un componente sencillo y encuentre su texto. | Sin mocks externos. |

### Huecos y riesgos
- No hay pruebas que ejerciten el enrutado completo ni los guards de administrador (`RequireAdmin`).
- Las vistas de registro, blog, contacto y nosotros carecen de cobertura.
- No se cubren estados de error o carga para servicios remotos (fallos de red, vacíos de datos en Home, etc.).
- Las integraciones con `localStorage` y `sessionStorage` solo se validan parcialmente; faltan flujos de cierre de sesión y expiración de token.
- Falta validar la lógica del carrito (añadir, editar cantidad, limpiar) y la gestión de productos en el panel admin.

### Cómo ejecutar la suite
Desde `frontend/`:
```bash
npm test
```

Modo interactivo:
```bash
npm run test:ui
```




# Guía de repositorios y ejecución

Resumen organizado de las rutas de GitHub/monorepo y las instrucciones clave para frontend y backend.

## 1. GitHub
### Repositorio Frontend (`frontend/`)
- **URL sugerida**: este frontend vive en la carpeta `frontend/` del monorepo. Si se separa, documenta la URL pública del repo correspondiente.
- **Instrucciones de instalación**
  1. Tener Node.js 20+ y npm.
  2. Clonar el repositorio y entrar a `frontend/`:
     ```bash
     git clone <URL_DEL_REPO>
     cd frontend
     npm install
     ```
- **Instrucciones de ejecución**
  - Desarrollo: `npm run dev` (Vite en `http://localhost:5173`).
  - Producción: `npm run build` y `npm run preview` para validar el artefacto.
  - Pruebas: `npm test` o `npm run test:ui`.

### Repositorio Backend (`backend/ProductosJSS/`)
- **URL sugerida**: carpeta `backend/ProductosJSS/` dentro de este monorepo. Si se aloja por separado, especifica la URL pública del repo.
- **README**: ver [`backend/ProductosJSS/README.md`](backend/ProductosJSS/README.md) para el detalle completo.
  - **Instrucciones de instalación**: requisitos Java/Maven/MySQL y configuración en `application.properties`.
  - **Instrucciones de ejecución**: `./mvnw spring-boot:run` exponiendo `http://localhost:8081`.
  - **Credenciales de prueba**: incluye ejemplo de inserción SQL para crear un administrador (`admin@joyasvs.cl` / `1234`).
  - **Documentación de API**: Swagger UI en `http://localhost:8081/swagger-ui/index.html` y OpenAPI en `/v3/api-docs`; no hay colección Postman incluida.
