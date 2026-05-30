import React from "react";
import PriceFilter from "./PriceFilter";
import RatingFilter from "./RatingFilter";
import CategoryFilter from "./CategoryFilter";
import SortFilter from "./SortFilter";

function ProductFilter({ resetAll, filters, setFilters, allCategories }) {
  return (
    <aside className="w-full">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-black text-[15px] tracking-wide">Filters</h3>
        <button
          className="text-sm font-bold text-[var(--color-primary)] hover:underline"
          onClick={resetAll}
        >
          Reset All
        </button>
      </div>
      <SortFilter setFilters={setFilters} filters={filters} />
      <PriceFilter
        filters={filters}
        setFilters={setFilters}
        applyPrice={() => console.log("price applied")}
      />
      {/* <Rating /> */}
      <RatingFilter
        filters={filters}
        setFilters={setFilters}
        ratingsCount={2}
      />
      <CategoryFilter
        filters={filters}
        setFilters={setFilters}
        allCategories={allCategories}
      />
    </aside>
  );
}

export default ProductFilter;
