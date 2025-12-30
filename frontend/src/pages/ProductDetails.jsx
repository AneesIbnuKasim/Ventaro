import React, { useCallback, useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import SingleProduct from '../components/ui/SingleProduct'
import { ReviewsList } from '../components/ui/Reviews';
import { ReviewForm } from '../components/ui/ReviewForm';
import Slider from '../components/ui/Slider';
import ProductCard from '../components/ui/ProductCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';
import { getUser } from '../utils/apiClient';

function ProductDetails() {

    const {id} = useParams()
    const { fetchSingleProduct, fetchProduct, products, product, submitReview, loading } = useProduct()
    const [ hasPurchased, setHasPurchased ] = useState('false')
    const [ hasReviewed, setHasReviewed ] = useState('false')
    const [ reviews, setReviews ] = useState([])
    const user = getUser()

    console.log('ratings', reviews);
    
    const totalRating = (reviews ?? []).reduce((acc, item) => (
      (acc + item?.rating)
    ), 0)

    const avgRating = totalRating/reviews?.length
    console.log('avg rating', avgRating);
    

    useEffect(() => {
      setReviews(product?.ratings)
      
    }, [product?.ratings])
    
    useEffect(() => {
      if (!products.length > 0) {
        fetchProduct()
        console.log('prods', products);
        
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

    useEffect(() => {
      console.log('has', hasPurchased);
      
    }, [hasPurchased])
    
  const handleClick = (id) => {
    navigate(`/product/${id}`)
  }

  const handleReviewSubmit = useCallback((values) => {
      submitReview({id, ...values})
  }, [])


//reviews
// const reviews = [
//   {
//     name: "Aarav Sharma",
//     location: "Mumbai, India",
//     rating: 5,
//     review: "Excellent product! The build quality feels premium and the performance is smooth. Totally worth the price.",
//     likes: 42,
//     comments: 6,
//   },
//   {
//     name: "Sofia Patel",
//     location: "Bangalore, India",
//     rating: 4,
//     review: "Very good overall! Fast delivery and well-packaged. Just wished the battery lasted a bit longer.",
//     likes: 27,
//     comments: 3,
//   },
//   {
//     name: "Rahul Verma",
//     location: "Delhi, India",
//     rating: 3,
//     review: "The product is decent for daily use. Some features feel slightly overpriced but still acceptable.",
//     likes: 18,
//     comments: 2,
//   },
//   {
//     name: "Emily Fernandes",
//     location: "Goa, India",
//     rating: 5,
//     review: "Loved it! Super smooth performance, lightweight, and looks great. Highly recommended!",
//     likes: 55,
//     comments: 8,
//   },
//   {
//     name: "Karan Mehta",
//     location: "Pune, India",
//     rating: 4,
//     review: "Good value for money. Customer support was helpful when I had a small setup issue.",
//     likes: 31,
//     comments: 4,
//   },
// ];

  return (


    <>
        <div className='m-4 flex flex-col gap-10'>
            {loading || !product ? (
                <div className="h-[420px] w-[380px] bg-gray-200 animate-pulse rounded-lg" />
            ):(
                <SingleProduct product={product} />

            )}
        <Slider 
        title='Related Products'
        items={products}
        renderItem={(item)=><ProductCard 
            product={item}
            />}
            handleClick = {handleClick}
            />
        <ReviewsList reviews={reviews} />
        {hasPurchased && !hasReviewed && (<ReviewForm onSubmitReview={handleReviewSubmit}/>)}
        </div>
    </>
  )
}

export default ProductDetails
