import React, { useEffect, useState } from 'react'
import AppLayout from '../components/AppLayout'
import SingleProduct from '../components/ui/SingleProduct'
import { ReviewsList } from '../components/ui/Reviews';
import { ReviewForm } from '../components/ui/ReviewForm';
import Slider from '../components/ui/Slider';
import ProductCard from '../components/ui/ProductCard';
import { useNavigate, useParams } from 'react-router-dom';
import { useProduct } from '../context/ProductContext';

function ProductDetails() {

    const {id} = useParams()
    const { fetchSingleProduct, products, product, loading, fetchProductByCategory } = useProduct()
    
    const navigate = useNavigate()

    useEffect(() => {
      const loadProduct = async() => {
      const response = await fetchSingleProduct(id)
    }
    loadProduct()
      window.scrollTo(0, 0)
  }, [id])


  const handleClick = (id) => {
    navigate(`/products/${id}`)
  }


//reviews
const reviews = [
  {
    name: "Aarav Sharma",
    location: "Mumbai, India",
    rating: 5,
    review: "Excellent product! The build quality feels premium and the performance is smooth. Totally worth the price.",
    likes: 42,
    comments: 6,
  },
  {
    name: "Sofia Patel",
    location: "Bangalore, India",
    rating: 4,
    review: "Very good overall! Fast delivery and well-packaged. Just wished the battery lasted a bit longer.",
    likes: 27,
    comments: 3,
  },
  {
    name: "Rahul Verma",
    location: "Delhi, India",
    rating: 3,
    review: "The product is decent for daily use. Some features feel slightly overpriced but still acceptable.",
    likes: 18,
    comments: 2,
  },
  {
    name: "Emily Fernandes",
    location: "Goa, India",
    rating: 5,
    review: "Loved it! Super smooth performance, lightweight, and looks great. Highly recommended!",
    likes: 55,
    comments: 8,
  },
  {
    name: "Karan Mehta",
    location: "Pune, India",
    rating: 4,
    review: "Good value for money. Customer support was helpful when I had a small setup issue.",
    likes: 31,
    comments: 4,
  },
];

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
            handleClick = {handleClick}
        />}
        />
        <ReviewsList reviews={reviews} />
        <ReviewForm />
        </div>
    </>
  )
}

export default ProductDetails
