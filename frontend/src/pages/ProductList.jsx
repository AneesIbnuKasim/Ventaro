import React, { memo, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import ProductFilter from "../components/ui/ProductFilter";
import { Card, FormInput, Pagination } from "../components/ui";
import ProductCard from "../components/ui/ProductCard";
import { IoSearch } from "react-icons/io5";
import { useProduct } from "../context/ProductContext";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

//USER PRODUCTS UI PAGE
const ProductList = memo(() => {

  const { filters, setFilters, products, fetchProduct, fetchSingleProduct, allCategories } = useProduct();
  useEffect(() => {
    fetchProduct()
  },[])


  const [searchQuery] = useState("Mobile");
  const navigate = useNavigate()

  console.log('products', products);
  

  const handleClick = (id) => {
    navigate(`/products/${id}`)
  }

  return (
    <>
      <AppLayout>
        <div className="flex ml-0 m-2">
          {/* filters */}
          <div className="w-[20%]">
            <ProductFilter />
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col w-full m-5">
            <div className=" w-full flex justify-between p-5">
              <h1>Showing Search result for '{searchQuery}'</h1>

              <div className="hidden sm:block relative w-64">
                <input
                  type="text"
                  value={filters.search}
                  onChange={(e) => setFilters('search', e.target.value)}
                  placeholder="Search products..."
                  className="w-full bg-[#F3F3F5] rounded-full py-2.5 pl-5 pr-12 text-sm outline-none border border-transparent focus:border-gray-300 transition"
                />

                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => console.log("Button clicked")}
                >
                  <Search
                    color="orange"
                    size={22}
                    className="text-white bg-[#6D3CF8] p-1 rounded-full"
                  />
                </button>
              </div>

              <div>
                <label>sortBy</label>
                <select name="sortBy" className="border ml-1" id="">
                  <option>Name</option>
                  <option>Price</option>
                  <option>Relevant</option>
                </select>
              </div>
            </div>

            {/* card layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
              {products &&
                products.map((item) => <ProductCard handleClick={handleClick} product={item} />)}
            </div>

            {/* PAGINATION */}
            <div className="mt-5">
              <Pagination className="mr-20" />
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default ProductList;
