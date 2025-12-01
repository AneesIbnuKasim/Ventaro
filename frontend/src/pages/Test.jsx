import React from 'react'
import PriceFilter from '../components/ui/PriceFilter'
import GenderFilter from '../components/ui/GenderFilter'
import RatingFilter from '../components/ui/RatingFilter'
import CategoryFilter from '../components/ui/CategoryFilter'

function Test({
    resetAll
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
      <PriceFilter
      applyPrice = {()=>console.log('price applied')}
       />
      <GenderFilter />
      <RatingFilter />
      <CategoryFilter />

    </aside>
  )
}

export default Test
