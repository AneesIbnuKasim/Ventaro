import React, { useCallback, useEffect, useState } from 'react'
import SingleProduct from '../components/ui/SingleProduct'
import { ReviewsList } from '../components/ui/Reviews';
import { ReviewForm } from '../components/ui/ReviewForm';
import Slider from '../components/ui/Slider';
import ProductCard from '../components/ui/ProductCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { getUser } from '../utils/apiClient';
import ProductDetailsSkeleton from '../components/ui/ProductDetailsSkeleton';

function ProductDetails() {

    const {id} = useParams()
    const { fetchSingleProduct, fetchProduct, products, product, submitReview, loading } = useProduct()
    const [ hasPurchased, setHasPurchased ] = useState('false')
    const [ hasReviewed, setHasReviewed ] = useState('false')
    const [ reviews, setReviews ] = useState([])
    const user = getUser()

    const totalRating = (reviews ?? []).reduce((acc, item) => (
      (acc + item?.rating)
    ), 0)

    const avgRating = totalRating/reviews?.length

    useEffect(() => {
      setReviews(product?.ratings)
      
    }, [product?.ratings])
    
    useEffect(() => {
      if (!products.length > 0) {
        fetchProduct()
      }
    }, [products])

    
    
    const navigate = useNavigate()

    useEffect(() => {
      const loadProduct = async() => {
      const response = await fetchSingleProduct(id, user?.id)
      setHasPurchased(response.hasPurchased)
      setHasReviewed(response.hasReviewed)
      
    }

    loadProduct()
      window.scrollTo(0, 0)
  }, [id])
    
  const handleClick = (id) => {
    navigate(`/product/${id}`)
  }

  const handleReviewSubmit = useCallback((values) => {
      submitReview({id, ...values})
  }, [])

  return (
    <>
        <div className='m-10 flex flex-col gap-10'>
            {loading || !product ? (
                <ProductDetailsSkeleton />
            ):(
                <SingleProduct product={product} avgRating= {avgRating} />

            )}
        <Slider 
        title='Related Products'
        items={products}
        renderItem={(item)=><ProductCard 
            product={item}
            />}
            handleClick = {handleClick}
            />
       <div className='flex flex-col gap-5'>
        <h1 className='h3'>Reviews & Ratings</h1>
         { reviews?.length > 0 ? (
          <ReviewsList reviews={reviews} avgRating={avgRating} />
        ) : (
  <span className="text-lg text-gray-400">No ratings yet</span>
        )}
        {hasPurchased && !hasReviewed && (<ReviewForm onSubmitReview={handleReviewSubmit}/>)}
       </div>
        </div>
    </>
  )
}

export default ProductDetails
