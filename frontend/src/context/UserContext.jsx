import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";
import {
  getAdminToken,
  getAuthToken,
  getUser,
  setUser,
} from "../utils/apiClient";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminService";
import { userAPI } from "../services/userService";

const UserContext = createContext();

const initialState = {
  user: {},
  token: getAuthToken(),
  isAuthenticated: !!getUser(),
  loading: false,
  error: null,
};

const USER_ACTIONS = {
  SET_LOADING: "SET_LOADING",
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  SET_ERROR: "SET_ERROR",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_USER: "SET_USER",
  UPDATE_USER: "UPDATE_USER",
  UPDATE_AVATAR: "UPDATE_AVATAR",
};

const userReducer = (state, action) => {
  switch (action.type) {
    case USER_ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload, error: null };

    case USER_ACTIONS.SET_ERROR:
      return { ...state, error: action.payload.error, loading: false };

    case USER_ACTIONS.CLEAR_ERROR:
      return { ...state, error: null, loading: false };

    case USER_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user || action.payload,
        loading: false,
      };

    case USER_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
        loading: false,
      };

    case USER_ACTIONS.UPDATE_AVATAR:
      return {
        ...state,
        user: {
          ...state.user,
          avatar: action.payload,
        },
      };

    default : 
    return state
  }
};

export const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  const { user, isAuthenticated, loading, token, error } = state;

  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: USER_ACTIONS.CLEAR_ERROR });
    }
  }, [state.error]);

  useEffect(() => {
    console.log("user", state.user);
  }, [state.user]);

  const getProfile = useCallback(async (id) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await userAPI.getProfile(id);

      console.log("user response", response);

      dispatch({
        type: USER_ACTIONS.SET_USER,
        payload: {
          user: response.data,
        },
      });

      return { success: true };
    } catch (error) {
      const errorMessage = error.message;
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });

      return { success: false, error: errorMessage };
    }
  }, []);

  const updateProfile = useCallback(async (userData) => {
    try {
      dispatch({ type: USER_ACTIONS.SET_LOADING, payload: true });

      const response = await userAPI.updateProfile(userData);

      console.log("res", response.data);

      dispatch({ type: USER_ACTIONS.UPDATE_USER, payload: response.data.user });
      toast.success(response.data.message);

      return { success: true };
    } catch (error) {
      dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
      return { success: false, error: error.message };
    }
  }, []);

  //UPDATE USER AVATAR 
  const updateAvatar = useCallback(async (file) => {
  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await userAPI.updateAvatar(formData);

    console.log('avatar res:', res);
    
    
    dispatch({
      type: USER_ACTIONS.UPDATE_AVATAR,
      payload: res.data.avatar,
    });

    toast.success("Avatar updated");

    return { success: true };
  } catch (error) {
     dispatch({ type: USER_ACTIONS.SET_ERROR, payload: error.message });
      console.log(error);
  }
}, []);

  const values = useMemo(
    () => ({
      user,
      isAuthenticated,
      loading,
      getProfile,
      updateProfile,
      updateAvatar
    }),
    [user, loading, isAuthenticated, getProfile, updateProfile]
  );

  return <UserContext.Provider value={values}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};
