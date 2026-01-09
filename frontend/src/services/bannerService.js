import { useLocation } from "react-router-dom"
import makeRequest from "../utils/apiClient"
import axios from "axios"

const bannerAPI = {
    
    fetchBanner: (params= {}) => {
        
        const urlParams = new URLSearchParams(params)
        
        return makeRequest(({
            method: 'get',
            url: `/api/banner?${urlParams.toString()}`
        }))
    },

    createBanner: async(data={}) => {

         const { title, subTitle, urlLink, position, isActive, order, image } = data

        const formData = new FormData()

        formData.append('image', image)
        formData.append('title', title)
        formData.append('subTitle', subTitle)
        formData.append('urlLink', urlLink)
        formData.append('position', position)
        formData.append('isActive', isActive)
        formData.append('order', order)

        const token = localStorage.getItem("adminToken");
        
        const res = await axios.post(`http://localhost:5001/api/banner`, formData, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        return res.data
    },

    updateBanner: (bannerId, data={}) => {
        console.log('data update', data);
        
        return makeRequest(({
            method: 'put',
            url: `/api/banner/${bannerId}`,
            data
        }))
    },

    removeBanner: (bannerId) => {
        console.log('coup:', bannerId);
        
        return makeRequest(({
            method: 'delete',
            url: `/api/banner/${bannerId}`,
        }))
    },
    
}

export default bannerAPI