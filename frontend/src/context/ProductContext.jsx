import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { toast } from "react-toastify";
import { productAPI } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import  useSyncedReducer  from "../hooks/useSyncReducer";
import { clearTokens } from "../utils/apiClient";

const ProductContext = createContext();

const initialState = {
  loading: false,
  error: null,
  products: [],
  filters: {
    search: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    rating: [],
    category: []
  },
  pagination: {
    page: 1,
    limit: 10,
  },
}

const ARRAY_FILTERS = ['rating', 'category']

const PRODUCT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_PRODUCT: "SET_PRODUCTS",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SET_FILTERS: "SET_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_ALL_CATEGORIES: "SET_ALL_CATEGORIES",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const ProductReducer = (state, action) => {
  switch (action.type) {

        case "SET_FROM_URL":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload.filters },
        pagination: { ...state.pagination, ...action.payload.pagination },
      };

    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case PRODUCT_ACTIONS.SET_FILTERS:
      console.log(('action payyyy new', action.payload));
      
      const {key, value} = action.payload
      const isArrayFilter = ARRAY_FILTERS.includes(key)

      console.log('isa araaY:', isArrayFilter);
      
      
      if (isArrayFilter) {
        const current = state.filters[key] || []
        const exist = current.includes(value)
      
      return {
        ...state,
        filters: {
          ...state.filters,
          [key] : exist ? current.filter(v => v!==value) : [...current, value]
        },
        pagination: {
      ...state.pagination,
      page: 1,
      }
    }
      }
      return {
        ...state,
        filters: {
          ...state.filters,
          [key]: value
        },
        pagination: {
      ...state.pagination,
      page: 1
      }
    }

    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case PRODUCT_ACTIONS.SET_PRODUCT:
      return { ...state,     products: action.payload.products || [],
    pagination: action.payload.pagination || state.pagination, };

    case PRODUCT_ACTIONS.ADD_PRODUCT:
      return {
        ...state,
        products: [...state.products, action.payload],
        loading: false,
      };

    case PRODUCT_ACTIONS.DELETE_PRODUCT:
      
      return {
        ...state,
        products: state.products.filter(
          (product) => product._id !== action.payload
        ),
        loading: false,
      };

    case PRODUCT_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

    case PRODUCT_ACTIONS.UPDATE_PRODUCT:
      return {
        ...state,
        products: state.products.map((product) =>
          product._id === action.payload._id ? action.payload : product
        ),
        loading: false,
      };

    case PRODUCT_ACTIONS.SET_ALL_CATEGORIES:
      return { ...state, allCategories: action.payload };

    default:
      return state;
  }
};

export const ProductProvider = ({ children }) => {
  const [ state, dispatch ] = useSyncedReducer(ProductReducer, initialState);
  const [ product, setProduct ] = useState()


  const [allCategories, setAllCategories] = useState();
  const debouncedSearch = useDebounce(state.filters.search, 500);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  useEffect(()=>{
    console.log('all filters:', state.filters);
    
  }, [state.filters])

  const setPagination = useCallback((payload) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload });
  }, []);

  const setFilters = useCallback((key, value) => {

    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload: {key, value} });
  }, []);

  const fetchProduct = async () => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });
      console.log("here");

      const { category, sortBy, sortOrder, minPrice, maxPrice } = state.filters;
      const { page, limit } = state.pagination;

      const response = await productAPI.getAllProduct({
        search: debouncedSearch,
        category,
        sortBy,
        sortOrder,
        minPrice,
        maxPrice,
        page,
        limit,
      });

      const { products, pagination, allCategories } = response.data;

      console.log("product response:", response);

      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCT,
        payload: { products: products, pagination },
      });

      setAllCategories(allCategories)

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  };

  const addProduct = async (ProductData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.addProduct(ProductData);

      dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: response.data.product });

      toast(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      toast.error(error.message)
      console.log(error);
      // if (error.status === 401 || error.status === 403 ) {
      //   clearTokens()
      //   window.location.href = '/login'
      // }
    }
  };

  const updateProduct = async (ProductId, ProductData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.updateProduct(ProductId, ProductData);

      dispatch({
        type: PRODUCT_ACTIONS.UPDATE_PRODUCT,
        payload: response.data,
      });

      toast(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  const deleteProduct = async (ProductId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.deleteProduct(ProductId);

      dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: ProductId });

      toast(response.message);
    } catch (error) {
      dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  };


  //USER PRODUCT HANDLE

  const fetchSingleProduct = useCallback(async(productId) => {
      try {
        dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true})

      const response = await productAPI.fetchSingleProduct(productId)

      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false})

      console.log('product', response.data.product);
      

      setProduct(response.data.product)

      return {success: true}
      
      } catch (error) {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
      }


  }, [])

  const values = {
    products: state.products,
    loading: state.loading,
    error: state.error,
    pagination: state.pagination,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    fetchSingleProduct,
    filters: state.filters,
    setFilters,
    setPagination,
    debouncedSearch,
    allCategories,
    product
  };

  return (
    <ProductContext.Provider value={values}>{children}</ProductContext.Provider>
  );
};

export const useProduct = () => {
  const context = useContext(ProductContext);

  if (!context) {
    throw new Error("useProduct must be used within an AuthProvider");
  }

  return context;
};
