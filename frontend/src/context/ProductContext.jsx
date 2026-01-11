import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { toast } from "react-toastify";
import { productAPI } from "../services/productService";
import useDebounce from "../hooks/useDebounce";
import useSyncedReducer from "../hooks/useSyncReducer";
import { clearTokens, getAuthToken } from "../utils/apiClient";
import { useAdmin } from "./AdminContext";
import { useLocation } from "react-router-dom";

const ProductContext = createContext();

const initialState = {
  loading: false,
  error: null,
  products: [],
  filters: {
    search: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "createdAt",
    sortOrder: "asc",
    rating: [],
    category: [],
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: "",
    totalProducts: "",
  },
};

const PRODUCT_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  SET_PRODUCT: "SET_PRODUCTS",
  ADD_PRODUCT: "ADD_PRODUCT",
  UPDATE_PRODUCT: "UPDATE_PRODUCT",
  DELETE_PRODUCT: "DELETE_PRODUCT",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
  SET_ALL_CATEGORIES: "SET_ALL_CATEGORIES",
  CLEAR_ERROR: "CLEAR_ERROR",
};

const ProductReducer = (state, action) => {
  switch (action.type) {
    case "SET_FROM_URL":
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload.filters,
        },
        pagination: {
          ...state.pagination,
          ...action.payload.pagination,
        },
      };

    case PRODUCT_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case PRODUCT_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          ...action.payload,
        },
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };

    case PRODUCT_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case PRODUCT_ACTIONS.CLEAR_FILTERS:
      return {
        ...state,
        filters: initialState.filters,
        pagination: {
          ...state.pagination,
          page: 1,
        },
      };

    case PRODUCT_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case PRODUCT_ACTIONS.SET_PRODUCT:
      return {
        ...state,
        products: action.payload.products || [],
        pagination: action.payload.pagination || state.pagination,
        loading: false,
      };

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
  const [product, setProduct] = useState();
  const [globalCategory, setGlobalCategory] = useState();
  const [allCategories, setAllCategories] = useState();
  const location = useLocation();

  const [state, dispatch] = useSyncedReducer(
    ProductReducer,
    initialState,
    true,
    {
      filterKeys: [
        "search",
        "sortBy",
        "sortOrder",
        "rating",
        "minPrice",
        "maxPrice",
        "category",
      ],
      paginationKeys: ["page", "limit"],
      routes: ["/products", "/search"]
    }
  );

  const debouncedSearch = useDebounce(state.filters.search, 500);
  const { category, sortBy, sortOrder, minPrice, maxPrice, rating } =
    state.filters;
  const { page, limit } = state.pagination;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [state.pagination.page]);

  useEffect(() => {
    console.log("all filters:", state.filters);
  }, [state.filters]);

  const setPagination = useCallback((payload) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload });
  }, []);

  const setFilters = useCallback((payload) => {
    dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload });
  }, []);

  const resetAllFilters = useCallback(() => {
    dispatch({
      type: PRODUCT_ACTIONS.CLEAR_FILTERS,
      payload: initialState.filters,
    });
  }, [dispatch]);

  //ADMIN FETCHES ALL PRODUCTS
  const fetchProduct = useCallback(async () => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

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

      dispatch({
        type: PRODUCT_ACTIONS.SET_PRODUCT,
        payload: { products: products, pagination },
      });

      setAllCategories(allCategories);

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });

      return { success: false, error: errorMessage };
    }
  }, [
    dispatch,
    debouncedSearch,
    category,
    sortBy,
    sortOrder,
    minPrice,
    maxPrice,
    page,
    limit,
    setAllCategories,
  ]);

  //USER PRODUCTS PAGE BY CATEGORY
  const fetchProductByCategory = useCallback(
    async (category) => {
      try {
        dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

        console.log('in prod', category);

        const response = await productAPI.fetchProductByCategory(category, {
          sortBy,
          sortOrder,
          rating,
          minPrice,
          maxPrice,
          page,
          limit,
        });

        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCT,
          payload: {
            products: response.data.products,
            pagination: response.data.pagination,
          },
        });
      } catch (error) {
        dispatch({
          type: PRODUCT_ACTIONS.SET_ERROR,
          payload: { error: error.message },
        });
      }
    },
    [dispatch, sortBy, limit, page, minPrice, maxPrice, rating, sortOrder]
  );

  //GET SEARCH SUGGESTION
  const searchSuggestion = useCallback(async (search) => {
    try {
      const response = await productAPI.searchSuggestion({ search });

      return response.data.suggestions;
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      console.log(error);
    }
  }, []);

  //HANDLE GLOBAL SEARCH
  const fetchSearch = useCallback(
    async (search) => {
      try {
        dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

        const res = await productAPI.fetchSearch({ 
          search,
          sortBy,
          sortOrder,
          minPrice,
          maxPrice,
          rating,
          category
         });

         console.log('search response :', res);
         

        dispatch({
          type: PRODUCT_ACTIONS.SET_PRODUCT,
          payload: {
            products: res.data.products,
            pagination: res.data.pagination,
            loading: false,
          },
        });
        setAllCategories(res.data.allCategories);
        return { success: true };
      } catch (error) {
        dispatch({
          type: PRODUCT_ACTIONS.SET_ERROR,
          payload: { error: error.message },
        });
      }
    },
    [category, rating, sortBy, sortOrder, minPrice, maxPrice, page, limit]
  );

  const addProduct = useCallback(async (ProductData) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.addProduct(ProductData);

      dispatch({
        type: PRODUCT_ACTIONS.ADD_PRODUCT,
        payload: response.data.product,
      });

      toast(response.message);

      return { success: true };
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      toast.error(error.message);
      console.log(error);
      // if (error.status === 401 || error.status === 403 ) {
      //   clearTokens()
      //   window.location.href = '/login'
      // }
    }
  }, []);

  const updateProduct = useCallback(async (ProductId, ProductData) => {
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
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  const deleteProduct = async (ProductId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.deleteProduct(ProductId);

      dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: ProductId });

      toast(response.message);
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  //USER SINGLE PRODUCT HANDLE
  const fetchSingleProduct = useCallback(async (productId, userId) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.fetchSingleProduct({productId, userId});

      console.log('fetch single response', response.data);
      

      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: false });

      setProduct(response.data.product);

      return { success: true, hasPurchased:response.data.hasPurchased, hasReviewed: response.data.hasReviewed };
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  //TOGGLE PRODUCT STATUS
  const toggleProductStatus = useCallback(async (productId, userId) => {
    try {
      const response = await productAPI.toggleProductStatus(productId);

      console.log('fetch status response', response.data);
      

      dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: response.data.product });
      toast.success('Product status changed successfully')
      return { success: true}
    } catch (error) {
      dispatch({
        type: PRODUCT_ACTIONS.SET_ERROR,
        payload: { error: error.message },
      });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  //SUBMIT REVIEW AND COMMENT
  const submitReview = useCallback(async(values) => {
    try {
      dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true });

      const response = await productAPI.submitReview(values)

      console.log('review respo:', response);
      

      dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: response.data });
      

      toast.success(response.message)

      return { success: true };
      
    } catch (error) {
       console.log(error);
      return { success: false, error: error.message };
    }

    
  })

  //LOAD NOT LOGGED IN USER CART FROM LOCAL STORAGE
  const loadCart = () => {
    try {
      const data = localStorage.getItem("cart");

      if (!data) return [];

      const parsed = JSON.parse(data);

      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      toast.error("Loading cart failed");
      return [];
    }
  };

  // //CLEAN PRODUCT BEFORE ADDING TO CART
  // const cleanCartItem = (product) => ({
  //   _id: product._id,
  //   name: product.name,
  //   price: product.price,
  //   image: product.images?.[0] || "",
  //   quantity: 1,
  // });

  // //ADDING PRODUCT TO TEMP CART FOR NON LOGGED IN USERS
  // const handleAddToCart = useCallback((product) => {
  //   try {
  //     const token = getAuthToken();
  //     const isAuthenticated = !!token;

  //     if (isAuthenticated) {
  //       console.log("logged in user cart");
  //       return;
  //     } else {
  //       const existingCart = loadCart();

  //       //validate if cart value is valid
  //       if (!Array.isArray(existingCart)) {
  //         toast.error("Cart is corrupted, Resetting cart...");
  //         return;
  //       }

  //       product = cleanCartItem(product);

  //       const exist = existingCart.find((item) => item._id === product._id);

  //       let updatedCart;

  //       if (exist) {
  //         // product already exist increase quantity
  //         const updatedCart = existingCart.map((item) =>
  //           item._id === product._id
  //             ? { ...item, quantity: item.quantity + 1 }
  //             : item
  //         );

  //         localStorage.setItem("cart", JSON.stringify(updatedCart));
  //       } else {
  //         //add new product
  //         updatedCart = [...existingCart, { ...product, quantity: 1 }];

  //         localStorage.setItem("cart", JSON.stringify(updatedCart));
  //       }

  //       toast.success("Product added to cart");
  //     }
  //   } catch (error) {
  //     dispatch({
  //       type: PRODUCT_ACTIONS.SET_ERROR,
  //       payload: { error: error.message },
  //     });
  //     console.log(error.message);
  //     return { success: false, error: error.message };
  //   }
  // }, []);


  const values = useMemo(
    () => ({
      products: state.products,
      loading: state.loading,
      error: state.error,
      pagination: state.pagination,
      fetchProduct,
      fetchProductByCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchSingleProduct,
      toggleProductStatus,
      // handleAddToCart,
      resetAllFilters,
      filters: state.filters,
      setFilters,
      setPagination,
      debouncedSearch,
      allCategories,
      product,
      globalCategory,
      setGlobalCategory,
      fetchSearch,
      searchSuggestion,
      loadCart,
      submitReview
    }),
    [
      state.products,
      state.loading,
      state.error,
      state.pagination,
      fetchProduct,
      fetchProductByCategory,
      addProduct,
      updateProduct,
      deleteProduct,
      fetchSingleProduct,
      toggleProductStatus,
      // handleAddToCart,
      resetAllFilters,
      setFilters,
      setPagination,
      debouncedSearch,
      allCategories,
      product,
      globalCategory,
      setGlobalCategory,
      fetchSearch,
      searchSuggestion,
      loadCart,
      submitReview
    ]
  );

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
