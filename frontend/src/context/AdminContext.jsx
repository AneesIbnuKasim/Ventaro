import { createContext, useContext, useEffect, useReducer } from "react";
import { getAdmin, getAdminToken, setAdmin } from "../utils/apiClient";
import { toast } from "react-toastify";
import { adminAPI } from "../services/adminService";


const AdminContext = createContext()

const initialState = {
    admin: getAdmin(),
    token: getAdminToken(),
    isAuthenticated: !!getAdmin(),
    loading: false,
    error: null,
    users: [],
    pagination: null
}

const ADMIN_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    LOGIN_START: 'LOGIN_START', 
    LOGIN_SUCCESS: 'LOGIN_SUCCESS',
    SET_ERROR: 'SET_ERROR',
    LOGIN_FAILURE: 'LOGIN_FAILURE',
    CLEAR_ERROR: 'CLEAR_ERROR',
    SET_USERS: 'SET_USERS',
    UPDATE_USER: 'UPDATE_USER'
}

const adminReducer = (state, action) =>{
    switch (action.type) {
        case ADMIN_ACTIONS.SET_LOADING: 
        return {...state, loading: action.payload, error: null}

        case ADMIN_ACTIONS.LOGIN_SUCCESS: 
        return {...state, admin: action.payload.admin, token:action.payload.token, loading: false, isAuthenticated: true}

        case ADMIN_ACTIONS.LOGIN_FAILURE: 
        return { ...state, error: action.payload.error, loading: false }

        case ADMIN_ACTIONS.SET_ERROR: 
        return { ...state, error: action.payload.error, loading: false }

        case ADMIN_ACTIONS.CLEAR_ERROR: 
        return { ...state, error: null, loading: false }

        case ADMIN_ACTIONS.SET_USERS:
        return { ...state, users: action.payload.users ||action.payload ,
                pagination: action.payload.pagination,
                loading: false }
        
        case ADMIN_ACTIONS.UPDATE_USER: 
        return { ...state,
            users: state.users.map(user=> user._id === action.payload._id ? action.payload : user),
            loading: false
        }
        
        
    }
}

export const AdminProvider = ({children})=>{
    const [ state, dispatch ] = useReducer(adminReducer, initialState)
    
    useEffect(()=>{
        if (state.admin) {
            setAdmin(state.admin)
        }
    },[ state.admin ])

    useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR });
    }
    }, [state.error])

    //login logic
    const login = () => {
        try {
            dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true})
            dispatch({ type: ADMIN_ACTIONS.LOGIN_SUCCESS, payload: { admin, token }})


        } catch (error) {
            const errorMessage = error.message || 'Login failed'
            dispatch({ type: ADMIN_ACTIONS.LOGIN_FAILURE, payload: error.message })

            return { success: false, error: errorMessage}
        }
        finally {
            dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR })
        }

    }

    const register = () => {
        try {
            dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true})
            dispatch({ type: ADMIN_ACTIONS.LOGIN_SUCCESS, payload: { admin, token }})
            
        } catch (error) {
            const errorMessage = error.message || 'Register failed'
            dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message })

            return { success: false, error: errorMessage}
        }
        finally{
            dispatch({ type: ADMIN_ACTIONS.CLEAR_ERROR })
        }
    }

    const getUsers = async({ page= 1, limit= 10, search= '', status= ''}) => {
        try {
            dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true })

        const response= await adminAPI.getUsers({ page, limit, search, status })

        dispatch({ type: ADMIN_ACTIONS.SET_USERS, payload: {
            users: response.data.users,
            pagination: response.data.pagination
        }})

        } catch (error) {
            const errorMessage = error.message
            dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message })

            return { success: false, error: errorMessage}
        }
    }

    const addUser = async(userData) => {
       try {
         dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true})

        const response = await adminAPI.addUser(userData)   
        
        console.log('reponse:', response);
        
       } catch (error) {
        dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error.message)
       }
    }

    const updateUser = async (userData) => {
        try {
        dispatch({ type: ADMIN_ACTIONS.SET_LOADING, payload: true})

        const response = await adminAPI.updateUser(userData)

        dispatch({ type: ADMIN_ACTIONS.UPDATE_USER, payload: response.data.user })
            
        } catch (error) {
        dispatch({ type: ADMIN_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
        return { success: false, error: error.message}
        }
    }

    const values = {
        users: state.users,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        error: state.loading,
        token: state.token,
        login,
        register,
        getUsers,
        addUser,
        updateUser,
        
    }

    return (
        <AdminContext.Provider value={values} >
            {children}
        </AdminContext.Provider>
    )

}

export const useAdmin = () => {
    const context = useContext(AdminContext)

    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }

    return context
}


