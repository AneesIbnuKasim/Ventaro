import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminService";
import { useSyncedReducer } from "../hooks/useSyncReducer";
import useDebounce from "../hooks/useDebounce";


const CategoryContext = createContext();

const initialState = {
  loading: false,
  error: null,
  categories: [],
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    status: "",
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: "",
    totalCategories: null,
  },
}

const syncKeys = [
  "filters.search",
  "filters.category",
  "filters.sortBy",
  "filters.sortOrder",
  "pagination.page",
  "pagination.limit",
];

const CATEGORY_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_CATEGORY: "SET_CATEGORIES",
  ADD_CATEGORY: "ADD_CATEGORY",
  UPDATE_CATEGORY: "UPDATE_CATEGORY",
  DELETE_CATEGORY: "DELETE_CATEGORY",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const categoryReducer = (state, action) => {
  switch (action.type) {
    case CATEGORY_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case CATEGORY_ACTIONS.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };

    case CATEGORY_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case CATEGORY_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case CATEGORY_ACTIONS.SET_CATEGORY:
      return { ...state, categories: action.payload, loading: false };

    case CATEGORY_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload],
        loading: false,
      };

    case CATEGORY_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(
          (category) => category._id !== action.payload
        ),
        loading: false,
      };

    case CATEGORY_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case CATEGORY_ACTIONS.UPDATE_CATEGORY:
      return {
        ...state,
        categories: state.categories.map((category) =>
          category._id === action.payload._id ? action.payload : category
        ),
        loading: false,
      };

    default:
      return state;
  }
};

export const CategoryProvider = ({ children }) => {
  const { state, dispatch } = useSyncedReducer(categoryReducer, initialState, {
    syncKeys,
    pageKey: "pagination.page",
  });

  const debouncedSearch = useDebounce(state.filters.search, 500);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: CATEGORY_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  const setPagination = useCallback((payload) => {
    dispatch({ type: CATEGORY_ACTIONS.SET_PAGINATION, payload });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: CATEGORY_ACTIONS.SET_FILTERS, payload });
  }, []);

  const fetchCategories = async () => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });

      
      
      const { status, sortBy, sortOrder } = state.filters;
      const { page, limit = 10 } = state.pagination;
      console.log('here');

      const response = await adminAPI.getAllCategory({
        search: debouncedSearch,
        sortBy,
        sortOrder,
        page,
        status,
        limit,
      });

      console.log('category fetch response:', response.data);
      

      dispatch({
        type: CATEGORY_ACTIONS.SET_CATEGORY,
        payload: response.data.categories,
      });

      dispatch({
        type: CATEGORY_ACTIONS.SET_PAGINATION,
        payload: response.data.pagination,
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  };

  const addCategory = async (categoryData) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.addCategory(categoryData);

      dispatch({ type: CATEGORY_ACTIONS.ADD_CATEGORY, payload: response.data });

      await fetchCategories();

      toast(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error.message);
    }
  };

  const updateCategory = async (categoryId, categoryData) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.updateCategory(categoryId, categoryData);

      dispatch({
        type: CATEGORY_ACTIONS.UPDATE_CATEGORY,
        payload: response.data,
      });

      toast(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  const deleteCategory = async (categoryId) => {
    try {
      dispatch({ type: CATEGORY_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.deleteCategory(categoryId);

      dispatch({ type: CATEGORY_ACTIONS.DELETE_CATEGORY, payload: categoryId });

      toast(response.message);
    } catch (error) {
      dispatch({ type: CATEGORY_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  const values = {
    categories: state.categories,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    filters: state.filters,
    setFilters,
    setPagination,
    debouncedSearch
  };

  return (
    <CategoryContext.Provider value={values}>
      {children}
    </CategoryContext.Provider>
  );
};

export const useCategory = () => {
  const context = useContext(CategoryContext);

  if (!context) {
    throw new Error("useCategory must be used within an AuthProvider");
  }

  return context;
};
