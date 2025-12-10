import React, { memo, useState } from 'react'
import AppLayout from '../components/AppLayout'
import ProductFilter from '../components/ui/ProductFilter'
import { Card, Pagination } from '../components/ui'
import ProductCard from '../components/ui/ProductCard'


//USER PRODUCTS UI PAGE
const ProductList = memo(() => {

    const products = [
  {
    id: "p1",
    name: "Wireless Bluetooth Headphones",
    price: 2499,
    category: "Electronics",
    images: ["https://cdn.pixabay.com/photo/2016/11/19/14/58/headphones-1836069_1280.jpg"],
    rating: 4.5,
    stock: 25,
    discountPercent: 20
  },
  {
    id: "p2",
    name: "Running Sports Shoes",
    price: 1899,
    category: "Footwear",
    images: ["https://cdn.pixabay.com/photo/2017/03/27/14/56/running-shoes-2178463_1280.jpg"],
    rating: 4.2,
    stock: 40
  },
  {
    id: "p3",
    name: "Smart Fitness Band",
    price: 1499,
    category: "Electronics",
    images: ["https://cdn.pixabay.com/photo/2019/05/04/22/22/smartwatch-4172169_1280.jpg"],
    rating: 4.0,
    stock: 32
  },
  {
    id: "p4",
    name: "Cotton Oversized T-Shirt",
    price: 599,
    category: "Fashion",
    images: ["https://cdn.pixabay.com/photo/2016/03/27/21/56/t-shirt-1282558_1280.jpg"],
    rating: 4.3,
    stock: 60
  },
  {
    id: "p5",
    name: "Stainless Steel Water Bottle",
    price: 399,
    category: "Home",
    images: ["https://cdn.pixabay.com/photo/2016/03/27/22/13/water-bottle-1281804_1280.jpg"],
    rating: 4.6,
    stock: 75
  },
  {
    id: "p6",
    name: "Laptop Backpack 30L",
    price: 1299,
    category: "Accessories",
    images: ["https://cdn.pixabay.com/photo/2017/08/10/07/24/backpack-2618938_1280.jpg"],
    rating: 4.4,
    stock: 22
  },
  {
    id: "p7",
    name: "Analog Men’s Wrist Watch",
    price: 1799,
    category: "Fashion",
    images: ["https://cdn.pixabay.com/photo/2015/12/15/17/43/watch-1090951_1280.jpg"],
    rating: 4.1,
    stock: 18
  },
  {
    id: "p8",
    name: "Portable Bluetooth Speaker",
    price: 999,
    category: "Electronics",
    images: ["https://cdn.pixabay.com/photo/2016/11/29/04/26/speaker-1867045_1280.jpg"],
    rating: 4.5,
    stock: 27
  },
  {
    id: "p9",
    name: "Ceramic Coffee Mug",
    price: 299,
    category: "Home",
    images: ["https://cdn.pixabay.com/photo/2016/11/29/09/32/coffee-1869565_1280.jpg"],
    rating: 4.7,
    stock: 50
  },
  {
    id: "p10",
    name: "Gaming Mechanical Keyboard",
    price: 2999,
    category: "Electronics",
    images: ["https://cdn.pixabay.com/photo/2015/12/23/09/59/keyboard-1107326_1280.jpg"],
    rating: 4.8,
    stock: 14
  }
];

  const [ searchQuery] = useState('Mobile')

  return (
    <>
      <AppLayout >
        <div className='flex ml-0 m-2'>

          {/* filters */}
          <div className='w-[20%]'>
          <ProductFilter />
        </div >

        {/* MAIN CONTENT AREA */}
          <div className='flex flex-col w-full m-5'>
            <div className=' w-full flex justify-between p-5'>
            <h1>Showing Search result for '{searchQuery}'</h1>
            <div>
              <label>sortBy</label>
            <select name="sortBy" className='border ml-1' id="">
              <option>Name</option>
              <option>Price</option>
              <option>Relevant</option>
            </select>
            </div>
          </div>


                    {/* card layout */}
          <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6'>
            {
              products && 
              products.map(item=>(
                <ProductCard 
                product= {item}
                />
              ))
            }
          </div>

          {/* PAGINATION */}
          <div className='mt-5'>
            <Pagination className='mr-20' />

          </div>
          </div>
        </div>
          
        
      </AppLayout>
    </>
  )
})

export default ProductList
