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
    const { fetchSingleProduct, products, product, loading } = useProduct()
    const navigate = useNavigate()

    useEffect(() => {
      const loadProduct = async() => {
      const response = await fetchSingleProduct(id)
    }
    loadProduct()
  }, [id])

  const handleClick = (id) => {
    navigate(`/product/${id}`)
  }

//related
// const relatedProducts = [
//   {
//     id: 1,
//     title: "SROK Smart Phone 128GB, OLED Retina",
//     brand: "SROK",
//     price: 15000,
//     oldPrice: 20000,
//     discount: "12% OFF",
//     rating: 4.4,
//     reviews: 128,
//     image:
//       "https://m.media-amazon.com/images/I/71d5fMdB3FL._AC_SL1500_.jpg",
//   },
//   {
//     id: 2,
//     title: "Xiaomi Redmi Note 13 Pro 5G",
//     brand: "Xiaomi",
//     price: 18999,
//     oldPrice: 23999,
//     discount: "20% OFF",
//     rating: 4.5,
//     reviews: 310,
//     image:
//       "https://m.media-amazon.com/images/I/71vo8H5HnGL._AC_UL1500_.jpg",
//   },
//   {
//     id: 3,
//     title: "Samsung Galaxy A34 5G",
//     brand: "Samsung",
//     price: 25999,
//     oldPrice: 29999,
//     discount: "15% OFF",
//     rating: 4.3,
//     reviews: 221,
//     image:
//       "https://m.media-amazon.com/images/I/71gyNRoK8CL._AC_SL1500_.jpg",
//   },
//   {
//     id: 4,
//     title: "Realme Narzo 70 Pro",
//     brand: "Realme",
//     price: 16999,
//     oldPrice: 19999,
//     discount: "10% OFF",
//     rating: 4.2,
//     reviews: 188,
//     image:
//       "https://m.media-amazon.com/images/I/61E+J7a6sVL._AC_UL1500_.jpg",
//   },
//   {
//     id: 5,
//     title: "Samsung Galaxy A34 5G",
//     brand: "Samsung",
//     price: 25999,
//     oldPrice: 29999,
//     discount: "15% OFF",
//     rating: 4.3,
//     reviews: 221,
//     image:
//       "https://m.media-amazon.com/images/I/71gyNRoK8CL._AC_SL1500_.jpg",
//   },
//   {
//     id: 6,
//     title: "Realme Narzo 70 Pro",
//     brand: "Realme",
//     price: 16999,
//     oldPrice: 19999,
//     discount: "10% OFF",
//     rating: 4.2,
//     reviews: 188,
//     image:
//       "https://m.media-amazon.com/images/I/61E+J7a6sVL._AC_UL1500_.jpg",
//   },
// ];

// //Deal products
// const dealProducts = [
//   {
//     id: 11,
//     title: "Apple iPhone 13 (128GB)",
//     brand: "Apple",
//     price: 51999,
//     oldPrice: 69900,
//     discount: "25% OFF",
//     rating: 4.7,
//     reviews: 9000,
//     image:
//       "https://m.media-amazon.com/images/I/71GLMJ7TQiL._AC_SL1500_.jpg",
//   },
//   {
//     id: 12,
//     title: "OnePlus Nord CE4",
//     brand: "OnePlus",
//     price: 22999,
//     oldPrice: 28999,
//     discount: "21% OFF",
//     rating: 4.5,
//     reviews: 3400,
//     image:
//       "https://m.media-amazon.com/images/I/61abLrCfF7L._AC_UL1500_.jpg",
//   },
//   {
//     id: 13,
//     title: "Samsung Galaxy M34 5G",
//     brand: "Samsung",
//     price: 15999,
//     oldPrice: 24999,
//     discount: "36% OFF",
//     rating: 4.4,
//     reviews: 5400,
//     image:
//       "https://m.media-amazon.com/images/I/81RYfYF+5ML._AC_UL1500_.jpg",
//   },
//   {
//     id: 14,
//     title: "Vivo Y200 5G",
//     brand: "Vivo",
//     price: 20999,
//     oldPrice: 26999,
//     discount: "18% OFF",
//     rating: 4.2,
//     reviews: 1400,
//     image:
//       "https://m.media-amazon.com/images/I/71k3gOik46L._AC_UL1500_.jpg",
//   },
// ];


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
      <AppLayout>
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
      </AppLayout>
    </>
  )
}

export default ProductDetails
