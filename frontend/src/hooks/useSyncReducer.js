// import { useReducer, useEffect, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";

// // ─── Debounce hook ────────────────────────────────────────
// function useDebounce(value, delay = 500) {
//   const [debouncedValue, setDebouncedValue] = useState(value);

//   useEffect(() => {
//     const timer = setTimeout(() => {
//       setDebouncedValue(value);
//     }, delay);

//     return () => clearTimeout(timer);
//   }, [value, delay]);

//   return debouncedValue;
// }

// // ─── Main Hook ───────────────────────────────────────────────
// export function useSyncedReducer(reducer, initialState, options = {}) {
//   const { syncKeys = [], pageKey = "page", searchKey = "search" } = options;

//   const [searchParams, setSearchParams] = useSearchParams();

//   // Merge URL to initialState
//   const urlState = {};
//   syncKeys.forEach((key) => {
//     const value = searchParams.get(key);
//     if (value !== null) {
//       urlState[key] = isNaN(value) ? value : Number(value);
//     }
//   });

//   const mergedInitial = { ...initialState, ...urlState };
//   const [state, dispatch] = useReducer(reducer, mergedInitial);

//   // Debounce search
//   const debouncedSearch = useDebounce(state[searchKey], 500);

//   // Auto-reset page when ANY other filter changes
//   const prevRef = useRef({});
//   useEffect(() => {
//     const prev = prevRef.current;
//     let shouldResetPage = false;

//     syncKeys.forEach((key) => {
//       if (key === pageKey) return;
//       if (key === searchKey) return; 
//       if (prev[key] !== state[key]) shouldResetPage = true;
//     });

//     if (shouldResetPage && state[pageKey] !== 1) {
//       dispatch({ type: "SET_PAGE", payload: 1 });
//     }

//     prevRef.current = syncKeys.reduce((acc, k) => ({ ...acc, [k]: state[k] }), {});
//   }, [state, syncKeys, pageKey]);

//   // Sync state to URL
//   useEffect(() => {
//     const updated = new URLSearchParams(searchParams);

//     syncKeys.forEach((key) => {
//       let value = key === searchKey ? debouncedSearch : state[key];

//       if (!value) updated.delete(key);
//       else updated.set(key, value);
//     });

//     setSearchParams(updated);
//   }, [debouncedSearch, ...syncKeys.map(key=> state[key])]); //dynamic dependency array

//   return { state, dispatch, debouncedSearch };
// }











import { useReducer, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

// ───────────────────────────────────────────
// Helper: Get nested value from dot notation
// ───────────────────────────────────────────
function getNested(obj, path) {
  return path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj);
}

// ───────────────────────────────────────────
// Helper: Set nested value into an object
// ───────────────────────────────────────────
function setNested(obj, path, value) {
  const keys = path.split(".");
  const last = keys.pop();
  const target = keys.reduce((o, k) => {
    if (!o[k]) o[k] = {};
    return o[k];
  }, obj);
  target[last] = value;
}

// ───────────────────────────────────────────
// Debounce Hook
// ───────────────────────────────────────────
function useDebounce(value, delay = 500) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}

// ───────────────────────────────────────────
// Main Hook: Synced + Debounced + Nested
// ───────────────────────────────────────────
export function useSyncedReducer(reducer, initialState, options = {}) {
  const {
    syncKeys = [],          // e.g. ["filters.search", "pagination.page"]
    pageKey = "pagination.page",
    searchKey = "filters.search",
  } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // ───────────────────────────────────────────
  // STEP 1: Merge URL → initialState
  // ───────────────────────────────────────────
  const urlState = {};

  syncKeys.forEach((key) => {
    const paramName = key.replace(/\./g, "_"); // pagination.page → pagination_page
    const value = searchParams.get(paramName);

    if (value !== null) {
      const parsed = isNaN(value) ? value : Number(value);
      setNested(urlState, key, parsed);
    }
  });

  const mergedInitial = { ...initialState, ...urlState };
  const [state, dispatch] = useReducer(reducer, mergedInitial);

  // ───────────────────────────────────────────
  // STEP 2: Debounce ONLY search
  // ───────────────────────────────────────────
  const searchValue = getNested(state, searchKey);
  const debouncedSearch = useDebounce(searchValue, 500);

  // ───────────────────────────────────────────
  // STEP 3: Auto-reset page when filters change
  // ───────────────────────────────────────────
  const prevRef = useRef({});

  useEffect(() => {
    const prev = prevRef.current;
    let shouldResetPage = false;

    syncKeys.forEach((key) => {
      if (key === pageKey) return;
      if (key === searchKey) return;

      const currentVal = getNested(state, key);
      const prevVal = getNested(prev, key);

      if (currentVal !== prevVal) shouldResetPage = true;
    });

    if (shouldResetPage && getNested(state, pageKey) !== 1) {
      dispatch({ type: "SET_PAGE", payload: 1 });
    }

    prevRef.current = JSON.parse(JSON.stringify(state));
  }, [state, syncKeys, pageKey]);

  // ───────────────────────────────────────────
  // STEP 4: Sync state → URL (debounced search)
  // ───────────────────────────────────────────
  useEffect(() => {
    const updated = new URLSearchParams(searchParams);

    syncKeys.forEach((key) => {
      const paramName = key.replace(/\./g, "_");

      const value =
        key === searchKey ? debouncedSearch : getNested(state, key);

      if (
        value === "" ||
        value === null ||
        value === undefined
      ) {
        updated.delete(paramName);
      } else {
        updated.set(paramName, value);
      }
    });

    setSearchParams(updated);
  }, [
    debouncedSearch,
    ...syncKeys.map((key) => getNested(state, key))
  ]);

  return { state, dispatch, debouncedSearch };
}