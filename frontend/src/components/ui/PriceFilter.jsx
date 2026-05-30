
import React, { useEffect, useState } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

export default function PriceFilter({
  filters,
  setFilters
}) {
    const [values, setValues] = useState([0,1500])

  const handleChange = (val) => {
    setValues(val)
  };

  useEffect(() => {
    const minVal = filters.minPrice || values[0]
    const maxVal = filters.maxPrice || values[1]
    setValues([minVal, maxVal])
  }, [filters.minPrice, filters.maxPrice])
  
  const handlePriceFilter = ()=>{
    setFilters({minPrice: values[0]})
    setFilters({maxPrice: values[1]})
  }

  return (
    <div className="w-full">
        <h4 className="mb-4 text-sm font-bold text-secondary">Price Range</h4>

      {/* Slider */}
     <div className="flex items-center gap-3">
         <RangeSlider
        min={0}
        max={100000}
        step={10}
        value={values}
        thumbSize={4}
        onInput={handleChange}
        className="accent-blue-500"
        />
                <button className="primary-action px-3 py-2 text-xs" type="button" onClick={handlePriceFilter}>Go</button>

     </div>
      

      <div className="text-center w-[80%] helper text-sm mb-3">
        Rs.{values[0]} — Rs.{values[1]}
        
      </div>
      
    </div>
  );
}