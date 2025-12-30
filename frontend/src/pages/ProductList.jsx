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
            <aside className="w-full p-5 bg-white shadow-md">
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

          {
            loading && (
              <div className="flex flex-col items-center justify-center m-auto">
              <div className="flex justify-center w-screen">
                <Loading size="xl" fullScreen={true} text="Loading search result..." className="flex gap-5 items-center justify-center text-2xl"/>
              </div>
              </div>
            )
          }

          <div className="flex flex-col items-center w-full m-5">
            {/* CONTENT */}
            {!loading && (
              <div className="w-full flex flex-col justify-between p-5">
                {/* HEADERS */}
                {products.length > 0 && (
                  <div className=" w-full flex h2 justify-between p-5">
                <h1>{category.charAt(0).toUpperCase()+category.slice(1)}</h1>
              </div>
                )}

                {/* GRID / EMPTY STATE */}
                {!loading && products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                    {products.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        handleClick={handleClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center min-h-[50vh]">
                    <SearchNotFound searchQuery={filters.search} />
                  </div>
                )}
              </div>
            )}

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
    </>
  );
});

export default ProductList;