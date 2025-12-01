// src/context/CartContext.jsx
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

const CartContext = createContext(null);

// ---------- CARGA INICIAL DESDE LOCALSTORAGE ----------
function loadInitial() {
  try {
    const raw = localStorage.getItem("cart");
    if (!raw) return { items: [] };

    const parsed = JSON.parse(raw);
    if (!parsed || !Array.isArray(parsed.items)) return { items: [] };

    const items = parsed.items
      .map((it) => {
        // 1) Formato nuevo: { productId, qty }
        if (it.productId != null) {
          const pid = Number(it.productId);
          const qty = Number(it.qty) || 1;
          if (!pid || Number.isNaN(pid)) return null;
          return { productId: pid, qty };
        }

        // 2) Formato viejo: { product: { id, ... }, qty }
        if (it.product && it.product.id != null) {
          const pid = Number(it.product.id);
          const qty = Number(it.qty) || 1;
          if (!pid || Number.isNaN(pid)) return null;
          return { productId: pid, qty };
        }

        return null;
      })
      .filter(Boolean);

    return { items };
  } catch {
    return { items: [] };
  }
}

function save(state) {
  try {
    localStorage.setItem("cart", JSON.stringify(state));
  } catch {}
}

// ---------- REDUCER ----------
function reducer(state, action) {
  switch (action.type) {
    case "ADD": {
      const { productId, qty } = action.payload;
      const items = [...state.items];
      const idx = items.findIndex((x) => x.productId === productId);

      if (idx >= 0) {
        items[idx] = {
          ...items[idx],
          qty: items[idx].qty + qty,
        };
      } else {
        items.push({ productId, qty });
      }

      return { ...state, items };
    }

    case "SET_QTY": {
      const { productId, qty } = action.payload;
      const items = state.items
        .map((it) =>
          it.productId === productId ? { ...it, qty } : it
        )
        .filter((it) => it.qty > 0);
      return { ...state, items };
    }

    case "REMOVE":
      return {
        ...state,
        items: state.items.filter(
          (it) => it.productId !== action.payload.productId
        ),
      };

    case "CLEAR":
      return { items: [] };

    default:
      return state;
  }
}

// ---------- PROVIDER ----------
export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, undefined, loadInitial);

  // Guardar + actualizar badge del navbar
  useEffect(() => {
    save(state);

    const totalQty = state.items.reduce(
      (s, it) => s + (Number(it.qty) || 0),
      0
    );

    const badge = document.querySelector(".cart-badge");
    if (badge) {
      if (totalQty > 0) {
        badge.classList.remove("d-none");
        badge.textContent = String(totalQty);
      } else {
        badge.classList.add("d-none");
        badge.textContent = "0";
      }
    }
  }, [state]);

  const api = useMemo(
    () => ({
      cart: state,
      add: (productId, qty = 1) => {
        const pid = Number(productId);
        const q = Number(qty) || 1;
        // Si el id es inválido, no hacemos nada (evita productId = NaN)
        if (!pid || Number.isNaN(pid)) return;
        dispatch({
          type: "ADD",
          payload: { productId: pid, qty: q },
        });
      },
      setQty: (productId, qty) => {
        const pid = Number(productId);
        const q = Number(qty) || 1;
        if (!pid || Number.isNaN(pid)) return;
        dispatch({
          type: "SET_QTY",
          payload: { productId: pid, qty: q },
        });
      },
      remove: (productId) => {
        const pid = Number(productId);
        if (!pid || Number.isNaN(pid)) return;
        dispatch({ type: "REMOVE", payload: { productId: pid } });
      },
      clear: () => dispatch({ type: "CLEAR" }),
    }),
    [state]
  );

  return (
    <CartContext.Provider value={api}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
