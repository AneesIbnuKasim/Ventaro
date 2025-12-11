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

//USER PRODUCTS UI PAGE
const ProductList = memo(() => {
  const {
    filters,
    setFilters,
    pagination,
    products,
    fetchProduct,
    resetAllFilters,
    fetchSingleProduct,
    allCategories,
    debouncedSearch,
  } = useProduct();
  const { category } = useParams();

  useEffect(() => {
    // remove category filter for category page
    setFilters("category", null);

    // fetch products for this category
    fetchProduct(category);
  }, [
    category,
    filters.sortBy,
    filters.sortOrder,
    filters.minPrice,
    filters.maxPrice,
    pagination.page,
    pagination.limit,
  ]);

  // useEffect(() => {
  //   fetchProduct()
  // },[
  //       filters.sortBy,
  //       filters.sortOrder,
  //       filters.minPrice,
  //       filters.maxPrice,
  //       pagination.page,
  //       pagination.limit])

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
          <div className="w-[20%]">
            <aside className="w-full p-5 bg-white shadow-md">
              {/* Header */}
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-[18px]">FILTERS</h3>
                <button
                  className="text-sm text-purple-600 font-medium hover:underline"
                  onClick={resetAll}
                >
                  Reset All
                </button>
              </div>
              <PriceFilter applyPrice={() => console.log("price applied")} />
              {/* <GenderFilter /> */}
              <RatingFilter ratingsCount={2} />
              {/* <CategoryFilter /> */}
            </aside>
          </div>

          {/* MAIN CONTENT AREA */}
          <div className="flex flex-col w-full m-5">
            <div className=" w-full flex justify-between p-5">
              <h1>{}</h1>

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
                products.map((item) => (
                  <ProductCard handleClick={handleClick} product={item} />
                ))}
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
