import { Search } from 'lucide-react'
import React, { memo, useState } from 'react'
import { useProduct } from '../../context/ProductContext'

const CategoryFilter = memo(() => {
  // const { allCategories } = useProduct(['mobile','shirt'])
  const allCategories = ['mobile', 'laptop']
  const {filters, setFilters } = useProduct()
  console.log('filters on category page::', filters);

  const handleFilter = (e) => {
    console.log('e.target', e.target.value);
    setFilters('category', e.target.value)
    
  }
  
  return (
    <>
      <div className="mb-4">
        <h4 className="font-medium mb-3 text-[15px]">Categories</h4>

        {/* Search box */}
        <div className="relative mb-3">
          <input
            type="text"
            placeholder="Search categories..."
            className="w-full p-2 pl-4 pr-10 rounded-full border text-sm"
          />
          <Search className="absolute right-3 top-3 text-gray-600" size={14} />
        </div>

        {/* Category list */}
        <div className="flex flex-col gap-2 text-sm">
          {allCategories.map((c) => (
            <label key={c} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={c}
                checked={filters.category.includes(c)}
                onChange={(e) => handleFilter(e)}
              />
              {c}
            </label>
          ))}
        </div>
      </div>
    </>
  )
})

export default CategoryFilter
