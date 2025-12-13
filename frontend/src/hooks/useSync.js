// // import { useReducer, useEffect, useRef, useState } from "react";
// // import { useSearchParams } from "react-router-dom";

// // // ─── Debounce hook ────────────────────────────────────────
// // function useDebounce(value, delay = 500) {
// //   const [debouncedValue, setDebouncedValue] = useState(value);

// //   useEffect(() => {
// //     const timer = setTimeout(() => {
// //       setDebouncedValue(value);
// //     }, delay);

// //     return () => clearTimeout(timer);
// //   }, [value, delay]);

// //   return debouncedValue;
// // }

// // // ─── Main Hook ───────────────────────────────────────────────
// // export function useSyncedReducer(reducer, initialState, options = {}) {
// //   const { syncKeys = [], pageKey = "page", searchKey = "search" } = options;

// //   const [searchParams, setSearchParams] = useSearchParams();

// //   // Merge URL to initialState
// //   const urlState = {};
// //   syncKeys.forEach((key) => {
// //     const value = searchParams.get(key);
// //     if (value !== null) {
// //       urlState[key] = isNaN(value) ? value : Number(value);
// //     }
// //   });

// //   const mergedInitial = { ...initialState, ...urlState };
// //   const [state, dispatch] = useReducer(reducer, mergedInitial);

// //   // Debounce search
// //   const debouncedSearch = useDebounce(state[searchKey], 500);

// //   // Auto-reset page when ANY other filter changes
// //   const prevRef = useRef({});
// //   useEffect(() => {
// //     const prev = prevRef.current;
// //     let shouldResetPage = false;

// //     syncKeys.forEach((key) => {
// //       if (key === pageKey) return;
// //       if (key === searchKey) return;
// //       if (prev[key] !== state[key]) shouldResetPage = true;
// //     });

// //     if (shouldResetPage && state[pageKey] !== 1) {
// //       dispatch({ type: "SET_PAGE", payload: 1 });
// //     }

// //     prevRef.current = syncKeys.reduce((acc, k) => ({ ...acc, [k]: state[k] }), {});
// //   }, [state, syncKeys, pageKey]);

// //   // Sync state to URL
// //   useEffect(() => {
// //     const updated = new URLSearchParams(searchParams);

// //     syncKeys.forEach((key) => {
// //       let value = key === searchKey ? debouncedSearch : state[key];

// //       if (!value) updated.delete(key);
// //       else updated.set(key, value);
// //     });

// //     setSearchParams(updated);
// //   }, [debouncedSearch, ...syncKeys.map(key=> state[key])]); //dynamic dependency array

// //   return { state, dispatch, debouncedSearch };
// // }

// // import { useReducer, useEffect, useRef, useState } from "react";
// // import { useSearchParams } from "react-router-dom";

// // // Get nested value from dot notation

// // function getNested(obj, path) {
// //     return path.split(".").reduce((o, k) =>
// //     (o ? o[k] : undefined), obj);
// // }

// // //Set nested value into an object

// // function setNested(obj, path, value) {
// //   const keys = path.split(".");
// //   const last = keys.pop();
// //   const target = keys.reduce((o, k) => {
// //     if (!o[k]) o[k] = {};
// //     return o[k];
// //   }, obj);
// //   target[last] = value;
// // }

// // // Debounce Hook
// // function useDebounce(value, delay = 8000) {
// //   const [debouncedValue, setDebouncedValue] = useState(value);

// //   console.log('search values in:', value);

// //   useEffect(() => {
// //     const timer = setTimeout(() => setDebouncedValue(value), delay);
// //     return () => clearTimeout(timer);
// //   }, [value, delay]);

// //   return debouncedValue;
// // }

// // // Main Hook: Synced + Debounced + Nested
// // export function useSyncedReducer(reducer, initialState, options = {}) {
// //   const {
// //     syncKeys = [],      // e.g. ["filters.search", "pagination.page"]
// //     pageKey = "pagination.page",
// //     searchKey = "filters.search",
// //   } = options;

// //   const [searchParams, setSearchParams] = useSearchParams();

// //   // Merge URL to initialState

// //   const urlState = {};

// //   syncKeys.forEach((key) => {
// //     const paramName = key.replace(/^pagination\./,'').replace(/^filters\./,''); // pagination.page to page
// //     const value = searchParams.get(paramName);

// //     if (value !== null) {
// //       const parsed = isNaN(value) ? value : Number(value);
// //       setNested(urlState, key, parsed);
// //     }
// //   });

// //   const mergedInitial = { ...initialState, ...urlState };
// //   const [state, dispatch] = useReducer(reducer, mergedInitial);

// //   // Debounce ONLY search

// //   const searchValue = getNested(state, searchKey);
// //   console.log('search val:', searchValue);

// //   const debouncedSearch = useDebounce(searchValue, 500);

// //   // Auto-reset page when filters change

// //   const prevRef = useRef({});

// ///prev useffect
// //   useEffect(() => {
// //     const prev = prevRef.current;
// //     let shouldResetPage = false;

// //     syncKeys.forEach((key) => {
// //       if (key === pageKey) return;

// //       const currentVal = getNested(state, key);
// //       const prevVal = getNested(prev, key);

// //       console.log(`current: ${currentVal} and prev val: ${prevVal}`)

// //       if (currentVal !== prevVal) shouldResetPage = true;
// //     })

// //     if (shouldResetPage && getNested(state, pageKey) !== 1) {
// //       dispatch({ type: "SET_PAGE", payload: 1 });
// //     }

// //     prevRef.current = JSON.parse(JSON.stringify(state));
// //   }, [state, syncKeys, pageKey]);

// // //new useffect
// // useEffect(() => {
// //   const prev = prevRef.current;
// //   let shouldResetPage = false;

// //   syncKeys.forEach((key) => {
// //     if (key === pageKey) return;

// //     const currentVal = getNested(state, key);
// //     const prevVal = getNested(prev, key);

// //     if (currentVal !== prevVal) {
// //       shouldResetPage = true;
// //     }
// //   });

// //   if (shouldResetPage && getNested(state, pageKey) !== 1) {
// //     dispatch({ type: "SET_PAGE", payload: 1 });
// //   }

// //   prevRef.current = JSON.parse(JSON.stringify(state));
// // }, [state]);

// //   const otherKeys = syncKeys.filter(k => k !== searchKey)
// //   // Sync state to URL
// //   useEffect(() => {
// //     const updated = new URLSearchParams();

// //     syncKeys.forEach((key) => {
// //       const paramName = key.replace(/^pagination\./,'').replace(/^filters\./,'')

// //       const value =
// //         key === searchKey ? debouncedSearch : getNested(state, key);

// //         console.log('keys', key)
// //         console.log('val', value)

// //       if (
// //         value === "" ||
// //         value === null ||
// //         value === undefined ||
// //         (key === "filters.sortBy" && value === "createdAt") ||
// //         (key === "filters.sortOrder" && value === "asc") ||
// //         (key === "pagination.page" && value === 1) ||
// //         (key === "pagination.limit" && value === 10)

// //       ) {

// //         updated.delete(paramName);
// //       } else {
// //         updated.set(paramName, value);
// //       }
// //     });

// //     if ([...updated.keys()].length > 0) {
// //     setSearchParams(updated);
// //   } else {
// //     setSearchParams({});
// //   }

// //   }, [
// //     debouncedSearch,
// //     ...otherKeys.map((key) => getNested(state, key))
// //   ]);

// //   return { state, dispatch, debouncedSearch };
// // }

// //without debounce.

// import { useReducer, useEffect, useRef } from "react";
// import { useSearchParams, useLocation } from "react-router-dom";

// // Nested getter
// function getNested(obj, path) {

//   return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
// }

// // Nested setter
// function setNested(obj, path, value) {
//   const keys = path.split(".");
//   const last = keys.pop();
//   const target = keys.reduce((o, k) => {
//     if (!o[k]) o[k] = {};
//     return o[k];
//   }, obj);

//   last === 'limit' ? value || 10 : null
//   target[last] = value;
// }

// export function useSyncedReducer(reducer, initialState, options = {}) {
//   const {
//     syncKeys = [],
//     pageKey = "pagination.page",
//     // searchKey = "filters.search",
//   } = options;

//   const [searchParams, setSearchParams] = useSearchParams();
//   const location = useLocation()

//   // Only sync on these routes
//   const shouldSync =
//   location.pathname.includes("categories") ||
//   location.pathname.includes("products");

//   // --- Load URL state into reducer ---
//   const urlState = {};
//   syncKeys.forEach((key) => {
//     const param = key.replace(/^pagination\./, "").replace(/^filters\./, "");
//     const value = searchParams.get(param);

//     if (value !== null) {
//       setNested(urlState, key, isNaN(value) ? value : Number(value));
//     }
//     // if (key === 'pagination.limit' && value === null) {
//     //   setNested(urlState, key, Number('10'))  //made limit default to 10 if no limit set
//     // }
//     // if (key === 'pagination.page' && value === null) {
//     //   setNested(urlState, key, Number('1'))  //made limit default to 10 if no limit set
//     // }
//   });

//   const [state, dispatch] = useReducer(reducer, {
//     ...initialState,
//     ...urlState,
//   });

//   // --- Auto reset page when any filter changes ---
//   const prevRef = useRef({});
//   useEffect(() => {
//     const prev = prevRef.current;

//     let resetPage = false;

//     syncKeys.forEach((key) => {

//       if (key === pageKey) return;
//       const curr = getNested(state, key);

//       const prevVal = getNested(prev, key);
//       // console.log(`curr:${curr} and prevVal:${prevVal}`);
//       if (curr !== prevVal) resetPage = true;
//     });

//     if (resetPage && getNested(state, pageKey) !== 1) {
//       dispatch({ type: "SET_PAGE", payload: 1 });
//     }

//     prevRef.current = JSON.parse(JSON.stringify(state));
//   }, [state]);

//   // --- Sync to URL ---

//   useEffect(() => {

//      if (!shouldSync) return;

//     const params = new URLSearchParams();

//     syncKeys.forEach((key) => {
//       const param = key.replace(/^pagination\./, "").replace(/^filters\./, "");
//       const value = getNested(state, key);

//       const isDefault =
//         value === "" ||
//         value === null ||
//         value === undefined ||
//         (key === "filters.sortBy" && value === "createdAt") ||
//         (key === "filters.sortOrder" && value === "asc")

//       if (!isDefault) params.set(param, value);
//     });

//     setSearchParams(params, {replace:true});
//   }, [...syncKeys.map((k) => getNested(state, k))]);

//   // When URL changes (Back/Forward), update reducer state
// // Sync URL → State when user clicks Back/Forward
// useEffect(() => {

//    if (!shouldSync) return;

//   const params = new URLSearchParams(location.search);

//   const paginationUpdate = {};
//   const filtersUpdate = {};

//   syncKeys.forEach((key) => {
//     const param = key.replace(/^pagination\./, "").replace(/^filters\./, "");
//     const value = params.get(param);

//     if (value !== null) {
//       if (key.startsWith("pagination.")) {
//         paginationUpdate[param] = isNaN(value) ? value : Number(value);
//       }
//       if (key.startsWith("filters.")) {
//         filtersUpdate[param] = isNaN(value) ? value : Number(value);
//       }
//     }
//   });

//   // Dispatch only if something changed
//   if (Object.keys(paginationUpdate).length) {
//     dispatch({
//       type: "SET_PAGINATION",
//       payload: paginationUpdate
//     });
//   }

//   if (Object.keys(filtersUpdate).length) {
//     dispatch({
//       type: "SET_FILTERS",
//       payload: filtersUpdate
//     });
//   }

// }, [location.search]);

//   return { state, dispatch };
// }

// import { useEffect, useReducer } from "react";
// import { useLocation, useNavigate } from "react-router-dom";

// export default function useSyncReducer(reducer, initialState) {
//   const location = useLocation();
//   const navigate = useNavigate();

//   const [state, dispatch] = useReducer(reducer, initialState);

//   // ---- URL → STATE ----
//   useEffect(() => {
//     const params = new URLSearchParams(location.search);

//     const parsed = parseUrlParams(params);

//     dispatch({
//       type: "SET_FROM_URL",
//       payload: parsed
//     });
//   }, []);

//   // ---- STATE → URL ----
//   useEffect(() => {
//     const newParams = stateToUrlParams(state);

//     navigate(`${location.pathname}?${newParams}`, { replace: true });
//   }, [state]);

//   return [state, dispatch];
// }

// import { useEffect, useReducer, useRef } from "react";

// export default function useSyncReducer(reducer, initialState) {
//   const [state, dispatch] = useReducer(reducer, initialState);

//   const isInitial = useRef(true);

//   // -------------------------------
//   // 1) URL → STATE (load initial)
//   // -------------------------------
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const newState = structuredClone(initialState);

//     // Load filters
//     Object.entries(newState.filters).forEach(([key]) => {
//       if (params.has(key)) {
//         const raw = params.get(key);

//         // Try parsing arrays
//         try {
//           const parsed = JSON.parse(raw);

//           if (Array.isArray(parsed)) {
//             newState.filters[key] = parsed;
//           } else {
//             newState.filters[key] = raw;
//           }
//         } catch {
//           newState.filters[key] = raw; // simple string
//         }
//       }
//     });

//     // Load pagination
//     Object.entries(newState.pagination).forEach(([key]) => {
//       if (params.has(key)) {
//         newState.pagination[key] = Number(params.get(key)) || 1;
//       }
//     });

//     dispatch({ type: "SET_FROM_URL", payload: newState });
//   }, []);

//   // -----------------------------------
//   // 2) STATE → URL (sync back to URL)
//   // -----------------------------------
//   useEffect(() => {
//     // Skip syncing the first hydration
//     if (isInitial.current) {
//       isInitial.current = false;
//       return;
//     }

//     const params = new URLSearchParams(window.location.search);

//     // Sync filters
//     Object.entries(state.filters).forEach(([key, value]) => {
//       if (!key) return;
//       if (Array.isArray(value) || typeof value === "object") {
//         params.set(key, JSON.stringify(value));
//       } else {
//         params.set(key, value);
//       }
//     });

//     // Sync pagination
//     Object.entries(state.pagination).forEach(([key, value]) => {
//       params.set(key, value);
//     });

//     window.history.replaceState({}, "", `?${params.toString()}`);
//   }, [state]);

//   return [state, dispatch];
// }

// import { useEffect, useReducer, useRef } from "react";

// export default function useSyncReducer(
//   reducer,
//   initialState,
//   enabled,
//   skipKeys = []
// ) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const isInitial = useRef(true);

//   // -------------------------------
//   // 1) URL → STATE (load initial)
//   // -------------------------------
//   useEffect(() => {
//     if (!enabled) return;
//     const params = new URLSearchParams(window.location.search);
//     const newState = structuredClone(initialState);

//     // Load filters
//     Object.entries(newState.filters).forEach(([key]) => {
//       if (!key) return; // skip invalid keys

//       if (skipKeys.includes(key)) return; //skip skipKeys

//       if (params.has(key)) {
//         const raw = params.get(key);
//         if (!raw) return;

//         try {
//           const parsed = JSON.parse(raw);

//           newState.filters[key] = parsed;
//         } catch {
//           newState.filters[key] = raw; // simple string
//         }
//       }
//     });

//     // Load pagination
//     Object.entries(newState.pagination).forEach(([key]) => {
//       if (!key) return;
//       if (params.has(key)) {
//         const val = Number(params.get(key));
//         newState.pagination[key] = isNaN(val) ? 1 : val;
//       }
//     });

//     dispatch({ type: "SET_FROM_URL", payload: newState });
//   }, []);

//   // -----------------------------------
//   // 2) STATE → URL (sync back to URL)
//   // -----------------------------------
//   useEffect(() => {
//     // Skip syncing first hydration
//     console.log("still working:", enabled);
//     if (enabled === false) return;
//     console.log("is working:", enabled);

//     if (isInitial.current) {
//       isInitial.current = false;
//       return;
//     }

//     const params = new URLSearchParams(window.location.search);

//     // Sync filters
//     Object.entries(state.filters).forEach(([key, value]) => {
//       if (!key || value === undefined || value === null) return;

//       if (skipKeys.includes(key)) return;

//       if (Array.isArray(value) || typeof value === "object") {
//         params.set(key, JSON.stringify(value));
//       } else {
//         params.set(key, value);
//       }
//     });

//     // Sync pagination
//     Object.entries(state.pagination).forEach(([key, value]) => {
//       if (!key || value === undefined || value === null) return;
//       params.set(key, value);
//     });

//     window.history.replaceState({}, "", `?${params.toString()}`);
//   }, [state]);

//   return [state, dispatch];
// }



import { useEffect, useReducer, useRef } from "react";

export default function useSyncReducer(
  reducer,
  initialState,
  enabled = false,
  excludeKeys = []
) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Track first load
  const initialLoad = useRef(true);

  // Keep last synced URL state to avoid loops
  const lastSyncedState = useRef(null);

  // -------------------------------
  // 1) URL → STATE (ONLY ON FIRST LOAD)
  // -------------------------------
  useEffect(() => {
    if (!enabled) return;

    if (!initialLoad.current) return;
    initialLoad.current = false;

    const params = new URLSearchParams(window.location.search);
    const newFilters = {};
    const newPagination = {};

    for (const [key, value] of params.entries()) {
      if (excludeKeys.includes(key)) continue;

      if (key === "page" || key === "limit") {
        console.log('value:', value);
        
        newPagination[key] = Number(value);
        console.log('newPagination:', newPagination);
        
      } else {
        newFilters[key] = value;
      }
    }

    // Save URL state snapshot
    lastSyncedState.current = { filters: newFilters, pagination: newPagination };

    dispatch({
      type: "SET_FROM_URL",
      payload: { filters: newFilters, pagination: newPagination },
    });
  }, [enabled]);

  // -------------------------------
  // 2) STATE → URL (only if it actually changed)
  // -------------------------------
  useEffect(() => {
    if (!enabled) return;
    if (initialLoad.current) return;

    const current = {
      filters: state.filters,
      pagination: state.pagination,
    };

    const prev = lastSyncedState.current;

    // Prevent infinite loop by comparing deeply
    if (JSON.stringify(prev) === JSON.stringify(current)) return;

    lastSyncedState.current = current;

    const params = new URLSearchParams();

    Object.entries(state.filters).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;
      if (value !== "" && value != null) params.set(key, value);
    });

    Object.entries(state.pagination).forEach(([key, value]) => {
      if (excludeKeys.includes(key)) return;
      if (value) params.set(key, value);
    });

    const newURL = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newURL);

  }, [enabled, state]);

  return [state, dispatch];
}