import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from "react";
import {
  clearTokens,
  getAdminToken,
  getUser,
  setUser,
} from "../utils/apiClient";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminService";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";

const AdminContext = createContext();

const initialState = {
  admin: getUser(),
  token: getAdminToken(),
  isAuthenticated: !!getUser(),
  loading: false,
  error: null,
  users: [],
  filters: {
    search: '',
    status: ''
  },
  pagination: {
    page: 1,
    limit: 10,
    totalPages: "",
    totalUsers: "",
  },
};

const ADMIN_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  SET_ERROR: "SET_ERROR",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_USERS: "SET_USERS",
  SET_ADMIN: "SET_ADMIN",
  UPDATE_ADMIN: "UPDATE_ADMIN",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_AVATAR: "UPDATE_AVATAR",
  SET_FILTERS: "SET_FILTERS",
  CLEAR_FILTERS: "CLEAR_FILTERS",
  SET_PAGINATION: "SET_PAGINATION",
};

const adminReducer = (state, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case ADMIN_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        admin: action.payload.admin,
        token: action.payload.token,
        loading: false,
        isAuthenticated: true,
      };

    case ADMIN_ACTIONS.LOGIN_FAILURE:
      return { ...state, error: action.payload.error, loading: false };

    case ADMIN_ACTIONS.SET_ADMIN:
      return {
        ...state,
        admin: action.payload.admin || action.payload,
        loading: false,
      };

    case ADMIN_ACTIONS.UPDATE_ADMIN:
      return {
        ...state,
        admin: { ...state.admin, ...action.payload },
        loading: false,
      };

    case ADMIN_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case ADMIN_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case ADMIN_ACTIONS.SET_USERS:
      return {
        ...state,
        users: action.payload.users || action.payload,
        pagination: action.payload.pagination,
        loading: false,
      };

    case ADMIN_ACTIONS.UPDATE_USER:
      return {
        ...state,
        users: state.users.map((user) =>
          user._id === action.payload._id ? action.payload : user
        ),
        loading: false,
      };

      case ADMIN_ACTIONS.UPDATE_AVATAR:
      return {
        ...state,
        admin: {
          ...state.admin,
          avatar: action.payload,
        },
      }

      case ADMIN_ACTIONS.SET_FILTERS:
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

      case ADMIN_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          ...action.payload,
        },
      };

      default: return state
  }
};

export const AdminProvider = ({ children }) => {
  const [state, dispatch] = useReducer(adminReducer, initialState);
  const debouncedSearch = useDebounce(state.filters.search, 500)
  const navigate = useNavigate()

  useEffect(() => {
    if (state.admin) {
      setUser(state.admin);
    }
  }, [state.admin]);

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  //SET PAGINATION
  const setPagination = useCallback((payload) => {
      dispatch({ type: ADMIN_ACTIONS.SET_PAGINATION, payload });
    }, []);
  
    const setFilters = useCallback((payload) => {
      dispatch({ type: ADMIN_ACTIONS.SET_FILTERS, payload });
    }, []);
  
    const resetAllFilters = useCallback(() => {
      dispatch({
        type: ADMIN_ACTIONS.CLEAR_FILTERS,
        payload: initialState.filters,
      });
    }, [dispatch]);

  //login logic
  const login = (admin, token) => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
      dispatch({
        type: ADMIN_ACTIONS.LOGIN_SUCCESS,
        payload: { admin, token },
      });
    } catch (error) {
      const errorMessage = error.message || "Login failed";
      dispatch({ type: ADMIN_ACTIONS.LOGIN_FAILURE, payload: error.message });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
    }
  };

  //GET ADMIN PROFILE
  const getProfile = useCallback(async () => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.getProfile();

      dispatch({
        type: ADMIN_ACTIONS.SET_ADMIN,
        payload: {
          admin: response.data.admin,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  }, []);

  //UPDATE ADMIN PROFILE
  const updateProfile = useCallback(async (adminData) => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.updateProfile(adminData);

      dispatch({ type: ADMIN_ACTIONS.UPDATE_ADMIN, payload: response.data.admin });
      toast.success(response.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  const register = () => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });
      dispatch({
        type: ADMIN_ACTIONS.LOGIN_SUCCESS,
        payload: { admin, token },
      });
    } catch (error) {
      const errorMessage = error.message || "Register failed";
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
    }
  };

  const getUsers = async () => {
    try {
      // dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });

      const { page, limit } = state.pagination
      const { status } = state.filters

      const response = await adminAPI.getUsers({ page, limit, search:debouncedSearch, status });

      dispatch({
        type: ADMIN_ACTIONS.SET_USERS,
        payload: {
          users: response.data.users,
          pagination: response.data.pagination,
        },
      });
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  };

  const addUser = async (userData) => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.addUser(userData);
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error.message);
    }
  };

  const updateUser = async (userData) => {
    try {
      dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true });

      const response = await adminAPI.updateUser(userData);

      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER,
        payload: response.data.user,
      });
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  };

  //BAN USER
  const banUser = useCallback(async (userId) => {
    try {
      const response = await adminAPI.banUser(userId);
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER,
        payload: response.data.user,
      });
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  })

  //UN BAN USER
  const unBanUser = useCallback(async (userId) => {
    try {
      const response = await adminAPI.unBanUser(userId);
      dispatch({
        type: ADMIN_ACTIONS.UPDATE_USER,
        payload: response.data.user,
      });
    } catch (error) {
      dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  })

  //UPDATE USER AVATAR 
    const updateAvatar = useCallback(async (file) => {
    try {
      const formData = new FormData();
      formData.append("avatar", file);
  
      const res = await adminAPI.updateAvatar(formData);
console.log('res.vatar', res.data.avatar);

      dispatch({
        type: ADMIN_ACTIONS.UPDATE_AVATAR,
        payload: res.data.avatar,
      });
  
      toast.success("Avatar updated");
  
      return { success: true };
    } catch (error) {
       dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message });
        console.log(error);
    }
  }, []);

  const logout = useCallback(async () => {
    clearTokens();
    setTimeout(() => {
            navigate('/admin/login', {replace: true})
            toast.success('Logged out successfully')
        }, 100)
  }, []);

  const values = {
    users: state.users,
    isAuthenticated: state.isAuthenticated,
    loading: state.loading,
    error: state.error,
    token: state.token,
    admin: state.admin,
    debouncedSearch,
    pagination: state.pagination,
    filters: state.filters,
    setPagination,
    setFilters,
    login,
    register,
    getUsers,
    addUser,
    updateUser,
    updateProfile,
    getProfile,
    updateAvatar,
    banUser,
    unBanUser,
    logout
  };

  return (
    <AdminContext.Provider value={values}>{children}</AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
