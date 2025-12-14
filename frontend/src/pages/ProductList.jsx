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

//USER PRODUCTS UI PAGE
const ProductList = memo(() => {
  const {
    filters,
    setFilters,
    setPagination,
    pagination,
    products,
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

  const resetAll = () => {};

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <>
      <AppLayout>
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
          {products.length > 0 ? (
            <div className="flex flex-col w-full m-5">
              <div className=" w-full flex h2 justify-between p-5">
                <h1>{category.charAt(0).toUpperCase()+category.slice(1)}</h1>
              </div>

              {/* card layout */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                {products &&
                  products.map((item) => (
                    <ProductCard handleClick={handleClick} product={item} />
                  ))}
              </div>

              {/* PAGINATION */}
              {pagination.totalPages > 1 && (
                <div className="mt-5">
                  <Pagination
                    currentPage={pagination.page}
                    totalItems={pagination.totalProducts}
                    totalPages={pagination.totalPages}
                    itemsPerPage={pagination.limit}
                    onPageChange={setPagination}
                    className="mr-20"
                  />
                </div>
              )}
            </div>
          ) : (
            <div className="flex w-full bg-blend-hard-light items-center justify-center">
              <ProductNotFound keyWord="No products found..." />
            </div>
          )}
        </div>
      </AppLayout>
    </>
  );
});

export default ProductList;
