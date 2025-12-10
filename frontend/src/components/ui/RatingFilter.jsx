import React, { memo, useState } from 'react'
import { useProduct } from '../../context/ProductContext'

const RatingFilter = memo(({
  ratingsCount
}) => {
  const { filters, setFilters } = useProduct()
  console.log('rat', filters.rating);
  
    const handleFilter = (e) => {
    console.log('e.target', e.target.value);
    setFilters({key:'rating', value: e.target.value})
    
  }
  
  return (
    <>
            <div className="mb-8">
        <h4 className="font-medium mb-3 text-[15px]">By Rating</h4>

        {['5', '4', '3', '2', '1'].map((star) => (
          <label
            key={star}
            className="flex items-center justify-between mb-2 text-sm cursor-pointer"
          >
            <div className="flex items-center gap-1">
              {Array.from({ length: star }).map((_, i) => (
                <span key={i}>⭐</span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                value={star}
                checked={filters.rating.includes(star)}
                onChange={(e) => handleFilter(e)}
              />
              {/* <span>({ratingsCount[star] || 0})</span> */}
            </div>
          </label>
        ))}
      </div>
    </>
  )
})

export default RatingFilter
