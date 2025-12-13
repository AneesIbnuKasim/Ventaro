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
const SearchPage = memo(() => {

  const { filters, setFilters, pagination, products, fetchSearch, allCategories, debouncedSearch, resetAllFilters } = useProduct();
  useEffect(() => {
    fetchSearch()
  },[   debouncedSearch,
        filters.category,
        filters.sortBy,
        filters.sortOrder,
        filters.minPrice,
        filters.maxPrice,
        pagination.page,
        pagination.limit])


  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/products/${id}`)
  }

  const resetAll = () => {
    resetAllFilters()
  }

  return (
    <>
      <AppLayout>
        <div className="flex ml-0 m-2">
          {/* filters */}
          <div className="w-[20%]">
            <ProductFilter resetAll= {resetAll} />
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col items-center w-full m-5">
            <div className=" w-full flex justify-between p-5">
              <h1>Showing Search result for '{filters.search || null}'</h1>

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
            <div className="mt-5 w-[70vw]">
              <Pagination className="mr-20" />
            </div>
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default SearchPage;
