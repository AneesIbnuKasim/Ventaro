import React, { memo, useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import ProductFilter from "../components/ui/ProductFilter";
import { Card, FormInput, Pagination } from "../components/ui";
import ProductCard from "../components/ui/ProductCard";
import { IoSearch } from "react-icons/io5";
import { useProduct } from "../context/ProductContext";
import { Search } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import PriceFilter from "../components/ui/PriceFilter";
import RatingFilter from "../components/ui/RatingFilter";
import CategoryFilter from "../components/ui/CategoryFilter";
import SortFilter from "../components/ui/SortFilter";
import SearchNotFound from "../components/ui/SearchNotFound";
import ProductNotFound from "../components/ui/ProductNotFound";
import Loading from "../components/ui/Loading";
import ToggleChat from "../components/ui/ToggleChat";
import ProductsGridSkeleton from "../components/ui/ProductGridSkeleton";

//USER PRODUCTS UI PAGE
const ProductList = memo(() => {
  const {
    filters,
    setFilters,
    setPagination,
    pagination,
    products,
    loading,
    fetchProductByCategory,
    resetAllFilters,
    fetchSingleProduct,
    allCategories,
    debouncedSearch,
  } = useProduct();
  const { category } = useParams();

  //CLEAR CATEGORY FILTER IF ANY
  //   useEffect(() => {
  //   if (filters.category !== null) {
  //     setFilters({category: null});
  //   }
  // }, [filters.category]);

  

  useEffect(() => {
    fetchProductByCategory(category);
  }, [category, fetchProductByCategory]);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
        <div className="flex ml-0 m-2">
          {/* filters */}
          <div className="w-[50%] md:w-[20%] lg:w-[25%]">
            <aside className="w-full p-5 bg-card shadow-md">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[18px]">FILTERS</h3>
                <button
                  className="text-sm text-purple-500 font-medium hover:underline"
                  onClick={resetAllFilters}
                >
                  Reset All
                </button>
              </div>
              <div className="flex flex-col gap-5">
                <SortFilter setFilters={setFilters} filters={filters} />
                {/* <PRICE FILTER /> */}
                <PriceFilter setFilters={setFilters} filters={filters} />
                {/* <RATING FILTER /> */}
                <RatingFilter
                  filters={filters}
                  setFilters={setFilters}
                  ratingsCount={2}
                />
              </div>
            </aside>
          </div>

          {/* MAIN CONTENT AREA */}

          <div className="w-full flex flex-col justify-between p-5">

<div className="min-h-60vh">
    
  {/* HEADER */}
  {!loading && products.length > 0 && (
    <div className="w-full flex justify-between p-5">
      <h1 className="text-xl font-semibold">
        {category.charAt(0).toUpperCase() + category.slice(1)}
      </h1>
    </div>
  )}

  {/* CONTENT STATES */}

  {loading ? (
      <ProductsGridSkeleton length={8} />
  ) : filters.search && products.length === 0 ? (
    <div className="w-full flex justify-center items-center min-h-[50vh]">
      <SearchNotFound searchQuery={filters.search} />
    </div>
  ) : products.length === 0  ? (
    <div className="w-full flex justify-center items-center min-h-[50vh]">
      <ProductNotFound content= 'Product not found' sub='Please use other filters...' />
    </div>
  ) : (
    <div className="grid 
    items-stretch
    grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 p-2">
      {products.map((item) => (
        <ProductCard
          key={item._id}
          buttons={true}
          product={item}
          handleClick={handleClick}
        />
      ))}
    </div>
  )}
</div>
            {/* PAGINATION */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-5 w-[70vw]">
                <Pagination
                  className="mr-20"
                  totalPages={pagination.totalPages}
                  itemsPerPage={pagination.limit}
                  totalItems={pagination.totalProducts}
                  currentPage={pagination.page}
                  onPageChange={setPagination}
                />
              </div>
            )}
          </div>
          </div>
        
        <ToggleChat />
    </>
  );
});

export default ProductList;