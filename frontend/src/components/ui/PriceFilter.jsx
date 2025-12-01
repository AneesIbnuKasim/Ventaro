import React, { memo, useState } from 'react'

const PriceFilter = memo(({
    applyPrice
}) => {
    const [ localPrice, setLocalPrice ] = useState({
        min: 0,
        max: 10000
    })
  return (
    <div className="mb-8">
        <h4 className="font-medium mb-3 text-[15px]">By Price</h4>

        {/* Slider range */}
        <input
          type="range"
          min="0"
          max="10000"
          value={localPrice.min}
          onChange={(e) =>
            setLocalPrice({ ...localPrice, min: Number(e.target.value) })
          }
          className="w-full accent-purple-500"
        />
        <input
          type="range"
          min="0"
          max="10000"
          value={localPrice.max}
          onChange={(e) =>
            setLocalPrice({ ...localPrice, max: Number(e.target.value) })
          }
          className="w-full accent-purple-500"
        />

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center gap-2">
            <span className="text-sm">Rs.</span>
            <input
              type="number"
              value={localPrice.min}
              onChange={(e) =>
                setLocalPrice({ ...localPrice, min: Number(e.target.value) })
              }
              className="w-20 p-1 rounded border text-sm"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm">Rs.</span>
            <input
              type="number"
              value={localPrice.max}
              onChange={(e) =>
                setLocalPrice({ ...localPrice, max: Number(e.target.value) })
              }
              className="w-20 p-1 rounded border text-sm"
            />
          </div>

          <button
            onClick={applyPrice}
            className="py-1 px-4 bg-purple-600 text-white rounded-lg text-sm"
          >
            Go
          </button>
        </div>
      </div>
  )
})

export default PriceFilter
