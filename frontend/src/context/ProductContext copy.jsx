import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import { productAPI } from "../services/productService";


const ProductContext = createContext()

const initialState = {
    loading: false,
    error: null,
    products: [],
    filters: {
        search: ''
    },
    pagination: {
        page: 1,
        limit: 10,
    },
    allCategories: []
}

const PRODUCT_ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_PRODUCT: 'SET_PRODUCTS',
    ADD_PRODUCT: 'ADD_PRODUCT',
    UPDATE_PRODUCT: 'UPDATE_PRODUCT',
    DELETE_PRODUCT: 'DELETE_PRODUCT',
    SET_FILTERS: 'SET_FILTERS',
    SET_PAGINATION: 'SET_PAGINATION',
    SET_ALL_CATEGORIES: 'SET_ALL_CATEGORIES',
    CLEAR_ERROR: 'CLEAR_ERROR'
}

const ProductReducer = (state, action) =>{
    switch (action.type) {
        case PRODUCT_ACTIONS.SET_LOADING: 
        return {...state, loading: action.payload, error: null}

        case PRODUCT_ACTIONS.SET_FILTERS:
        return {...state, filters:{...state.filters, ...action.payload}}

        case PRODUCT_ACTIONS.SET_ERROR: 
        return { ...state, error: action.payload.error, loading: false }

        case PRODUCT_ACTIONS.CLEAR_ERROR: 
        return { ...state, error: null, loading: false }

        case PRODUCT_ACTIONS.SET_PRODUCT:
        return { ...state, products: action.payload ,
                loading: false }

        case PRODUCT_ACTIONS.ADD_PRODUCT:
        return { ...state, products: [...state.products,
            action.payload ] ,
                loading: false }

        case PRODUCT_ACTIONS.DELETE_PRODUCT:
        return { ...state, products: state.products.filter(product=> product._id !== action.payload) ,
                loading: false }

        case PRODUCT_ACTIONS.SET_PAGINATION:
        return { ...state, pagination: {
            ...state.pagination,
            ...action.payload
        }}
        
        case PRODUCT_ACTIONS.UPDATE_PRODUCT: 
        return { ...state,
            products: state.products.map(product=> product._id === action.payload._id ? action.payload : product),
            loading: false
        }

        case PRODUCT_ACTIONS.SET_ALL_CATEGORIES: 
        return { ...state,
            allCategories: action.payload
        }
        
        default : return state
    }
}

export const ProductProvider = ({children})=>{
    const [ state, dispatch ] = useReducer(ProductReducer, initialState)

    useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      dispatch({ type: PRODUCT_ACTIONS.CLEAR_ERROR });
    }
    }, [state.error])

    useEffect(() => {
        fetchProduct()
    }, [state.pagination.page, state.pagination.totalProducts, state.filters.search])

    const setPagination = useCallback((payload) => {
        dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload})
    },[])

    const setFilters = useCallback((payload) => {
        dispatch({ type: PRODUCT_ACTIONS.SET_FILTERS, payload})
    }, [])

    const fetchProduct = async() => {
        try {
            dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true })

            const { search= '' } = state.filters
            const { page, limit } = state.pagination
        
        const response= await productAPI.getAllProduct({ page, limit, search })

        dispatch({ type: PRODUCT_ACTIONS.SET_PRODUCT, payload: response.data.products })

        dispatch({ type: PRODUCT_ACTIONS.SET_PAGINATION, payload: response.data.pagination })

        dispatch({ type: PRODUCT_ACTIONS.SET_ALL_CATEGORIES, payload: response.data.allCategories })

        return { success: true }

        } catch (error) {
            const errorMessage = error.message
            dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message })

            return { success: false, error: errorMessage}
        }
    }

    const addProduct = async(ProductData) => {
       try {
         dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true})

        const response = await productAPI.addProduct(ProductData)   

        dispatch({ type: PRODUCT_ACTIONS.ADD_PRODUCT, payload: response.data})

        toast(response.message)

        return { success: true }
        
       } catch (error) {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error.message)
       }
    }

    const updateProduct = async (ProductId, ProductData) => {
        try {
        dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true})

        const response = await productAPI.updateProduct(ProductId, ProductData)

        dispatch({ type: PRODUCT_ACTIONS.UPDATE_PRODUCT, payload: response.data })

        toast(response.message)

        return { success: true }
            
        } catch (error) {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
        return { success: false, error: error.message}
        }
    }

    const deleteProduct = async (ProductId) => {
        try {
        dispatch({ type: PRODUCT_ACTIONS.SET_LOADING, payload: true})
            
        const response = await productAPI.deleteProduct(ProductId)

        dispatch({ type: PRODUCT_ACTIONS.DELETE_PRODUCT, payload: ProductId})

        toast(response.message)
        } catch (error) {
        dispatch({ type: PRODUCT_ACTIONS.SET_ERROR, payload: error.message})
        console.log(error)
        return { success: false, error: error.message}   
        }
    }

    const values = {
        products: state.products,
        loading: state.loading,
        error: state.error,
        pagination: state.pagination,
        fetchProduct,
        addProduct,
        updateProduct,
        deleteProduct,
        filters: state.filters,
        setFilters,
        setPagination
    }

    return (
        <ProductContext.Provider value={values} >
            {children}
        </ProductContext.Provider>
    )

}

export const useProduct = () => {
    const context = useContext(ProductContext)

    if (!context) {
        throw new Error('useProduct must be used within an AuthProvider')
    }

    return context
}


