// import { useEffect, useReducer, useRef } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function useSyncReducer(
//   reducer,
//   initialState,
//   { filterKeys = [], paginationKeys = [] }
// ) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const location = useLocation();
//   const lastSyncedState = useRef(null);
//   const navigate = useNavigate()

//   const applyUrlToState = () => {
//   const params = new URLSearchParams(location.search);

//   const filters = { ...state.filters };
//   const pagination = { ...state.pagination };

//   // filterKeys.forEach((key) => {
//   //   if (params.has(key)) {
//   //     const value = params.get(key);
//   //     filters[key] = key === "rating" ? value.split(",") : value;
//   //   }
//   // });

// filterKeys.forEach((key) => {
//   if (params.has(key)) {
//     const value = params.get(key);

//     if (key === "rating") {
//       filters[key] = value
//         .split(",")
//         .map(Number)
//         .filter((n) => !Number.isNaN(n));
//     } else {
//       filters[key] = value;
//     }
//   }
// });

//   return { filters, pagination };
// };

//   const initialized = useRef(false);

//   // --- 1) URL → state on mount ---
// useEffect(() => {
//   const newState = applyUrlToState();

//   if (
//     lastSyncedState.current &&
//     JSON.stringify(newState) === JSON.stringify(lastSyncedState.current)
//   ) {
//     return;
//   }

//   lastSyncedState.current = newState;
//   dispatch({ type: "SET_FROM_URL", payload: newState });
// }, [location.search]);

// //   --- 2) STATE → URL ---
// useEffect(() => {
//   if (!initialized.current) {
//     initialized.current = true;
//     return;
//   }

//   const params = new URLSearchParams();

//   filterKeys.forEach((key) => {
//     const value = state.filters[key];
//     if (value != null && value !== "" && value.length !== 0) {
//       params.set(key, Array.isArray(value) ? value.join(",") : value);
//     }
//   });

//   paginationKeys.forEach((key) => {
//     params.set(key, state.pagination[key]);
//   });

//   window.history.replaceState(
//     {},
//     "",
//     `${location.pathname}?${params.toString()}`
//   );
// }, [state.filters, state.pagination, location.pathname]);

//   // // --- 3) Browser back/forward → apply URL → state ---
//   // useEffect(() => {
//   //   const onPopState = () => {
//   //     const newState = applyUrlToState();
//   //     lastSyncedState.current = newState;
//   //     dispatch({ type: "SET_FROM_URL", payload: newState });
//   //   };
//   //   window.addEventListener("popstate", onPopState);
//   //   return () => window.removeEventListener("popstate", onPopState);
//   // }, []);

//   return [state, dispatch];
// }

// page doesnt work
import { useEffect, useReducer, useRef } from "react";
import { useLocation } from "react-router-dom";

export default function useSyncReducer(
  reducer,
  initialState,
  isEnabled,
  { filterKeys = [], paginationKeys = [] }
) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const isHydrated = useRef(false);
  console.log("location :", location.pathname);
  const isProductsRoute =
    location.pathname.startsWith("/products") ||
    location.pathname.startsWith("/search");

  // URL → STATE (ONCE ON LOAD)

  console.log("isProductsRoute", isProductsRoute);
  console.log("isEnabled", isEnabled);

  useEffect(() => {
    if (!isEnabled) return;
    if (!isProductsRoute) return;
    if (isHydrated.current) return;

    const params = new URLSearchParams(location.search);

    const filters = { ...initialState.filters };
    const pagination = { ...initialState.pagination };

    filterKeys.forEach((key) => {
      if (!params.has(key)) return;

      const value = params.get(key);

      // array support (rating)
      if (key === "rating") {
        filters[key] = value.split(",").map(Number);
      }

      // array support (category)
      if (key === "category") {
        filters[key] = value.split(",").map((v) => v.trim());
      }
      
      // number support (price)
      else if (key === "minPrice" || key === "maxPrice") {
        filters[key] = Number(value);
      } else {
        filters[key] = value;
      }
    });

    paginationKeys.forEach((key) => {
      if (params.has(key)) {
        pagination[key] = Number(params.get(key));
      }
    });

    dispatch({
      type: "SET_FROM_URL",
      payload: { filters, pagination },
    });

    isHydrated.current = true;
  }, [location.search, location.pathname]);

  // 2️⃣ STATE → URL

  useEffect(() => {
    if (!isEnabled) return;
    if (!isProductsRoute) return;
    if (!isHydrated.current) return;

    const params = new URLSearchParams();

    filterKeys.forEach((key) => {
      const value = state.filters[key];

      if (Array.isArray(value) && value.length) {
        params.set(key, value.join(","));
      } else if (value !== "" && value !== null && value !== undefined) {
        params.set(key, value);
      }
    });

    paginationKeys.forEach((key) => {
      const value = state.pagination[key];
      if (Number.isFinite(value)) {
        params.set(key, value);
      }
    });

    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [state.filters, state.pagination, location.pathname]);

  return [state, dispatch];
}
