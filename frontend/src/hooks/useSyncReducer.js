import { useEffect, useReducer, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function useSyncReducer(
  reducer,
  initialState,
  { filterKeys = [], paginationKeys = [] }
) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const location = useLocation();
  const lastSyncedState = useRef(null);
  const navigate = useNavigate()

  const applyUrlToState = () => {
    const params = new URLSearchParams(window.location.search);

    const filters = { ...initialState.filters };

    const pagination = { ...initialState.pagination };

    filterKeys.forEach((key) => {
      if (params.has(key)) filters[key] = params.get(key);
    });

    paginationKeys.forEach((key) => {
      if (params.has(key)) pagination[key] = Number(params.get(key));
    });

    return { filters, pagination };
  };

  const initialized = useRef(false);

  // --- 1) URL → state on mount ---
  useEffect(() => {
    const newState = applyUrlToState();
    lastSyncedState.current = newState;

    //prevent un necessary updates
    if (JSON.stringify(newState) === JSON.stringify(lastSyncedState.current)) {
    return;
  }

    dispatch({ type: "SET_FROM_URL", payload: newState });
  }, []);

//   --- 2) STATE → URL ---
  useEffect(() => {
    const current = {
      filters: state.filters,
      pagination: state.pagination,
    };

    // avoid looping
    if (JSON.stringify(current) === JSON.stringify(lastSyncedState.current)) {
      return;
    }
    lastSyncedState.current = current;

    if (!initialized.current) {
      initialized.current = true;
      return; // skip first run
    }

    const params = new URLSearchParams();

    filterKeys.forEach((key) => {
      const value = state.filters[key];
      if (value !== "" && value != null) params.set(key, value);
    });

    paginationKeys.forEach((key) => {
      const value = state.pagination[key];
      if (value !== "" && value != null) params.set(key, value);
    });

    const newUrl = `${location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  }, [state.filters, state.pagination, location.pathname]);


  // --- 3) Browser back/forward → apply URL → state ---
//   useEffect(() => {
//     const onPopState = () => {
//       const newState = applyUrlToState();
//       lastSyncedState.current = newState;
//       dispatch({ type: "SET_FROM_URL", payload: newState });
//     };
//     window.addEventListener("popstate", onPopState);
//     return () => window.removeEventListener("popstate", onPopState);
//   }, []);

useEffect(() => {
  // every time URL (pathname or search) changes:
  const newState = applyUrlToState();
  lastSyncedState.current = newState;
  dispatch({ type: "SET_FROM_URL", payload: newState });
}, [location.search, location.pathname]);

  return [state, dispatch];
}
