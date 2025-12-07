// hooks/useSyncedReducer.js
import { useReducer, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";

export function useSyncedReducer(reducer, initialState, options = {}) {
  const { syncKeys = [], pageKey = "page" } = options;

  const [searchParams, setSearchParams] = useSearchParams();

  // Step 1: Extract values from URL into state
  const urlState = {};
  syncKeys.forEach((key) => {
    const value = searchParams.get(key);
    if (value !== null) {
      urlState[key] = isNaN(value) ? value : Number(value);
    }
  });

  const mergedInitial = { ...initialState, ...urlState };
  const [state, dispatch] = useReducer(reducer, mergedInitial);

  // Track previous synced state to detect changes
  const prevSyncStateRef = useRef({});

  // Step 2: auto-reset page when other sync keys change
  useEffect(() => {
    const prev = prevSyncStateRef.current;

    let shouldResetPage = false;

    syncKeys.forEach((key) => {
      if (key === pageKey) return; // skip page itself

      if (prev[key] !== state[key]) {
        shouldResetPage = true;
      }
    });

    if (shouldResetPage && state[pageKey] !== 1) {
      dispatch({ type: "SET_PAGE", payload: 1 });
    }

    prevSyncStateRef.current = syncKeys.reduce((obj, key) => {
      obj[key] = state[key];
      return obj;
    }, {});
  }, [state, syncKeys, pageKey]);

  // Step 3: sync to URL
  useEffect(() => {
    const updatedParams = new URLSearchParams(searchParams);

    syncKeys.forEach((key) => {
      const value = state[key];
      if (value === "" || value === null || value === undefined) {
        updatedParams.delete(key);
      } else {
        updatedParams.set(key, value);
      }
    });

    setSearchParams(updatedParams);
  }, [state, syncKeys, searchParams, setSearchParams]);

  return { state, dispatch };
}


 prevSyncStateRef.current = syncKeys.reduce((obj, key) => {
      obj[key] = state[key];
      return obj;
    }, {});