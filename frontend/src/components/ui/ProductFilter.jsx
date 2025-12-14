import React from 'react'
import PriceFilter from './PriceFilter'
import GenderFilter from './GenderFilter'
import RatingFilter from './RatingFilter'
import CategoryFilter from './CategoryFilter'
import SortFilter from "./SortFilter";

function ProductFilter({
    resetAll,
    filters,
    setFilters,
    allCategories
}) {
  return (
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
      <SortFilter setFilters={setFilters} filters={filters} />
      <PriceFilter
      filters={filters}
      setFilters={setFilters}
      applyPrice = {()=>console.log('price applied')}
       />
      {/* <GenderFilter /> */}
      <RatingFilter filters={filters} setFilters={setFilters} ratingsCount= {2} />
      <CategoryFilter filters={filters} setFilters={setFilters} allCategories= {allCategories}  />

    </aside>
  )
}

export default ProductFilter
