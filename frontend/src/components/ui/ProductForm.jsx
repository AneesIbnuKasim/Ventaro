import React, { useEffect, useState } from "react";
import Button from "./Button";
import { useProduct } from "../../context/ProductContext";
import FormInput from "./FormInput";
import { useCategory } from "../../context/CategoryContext";

export default function ProductForm({ onSubmit, onCancel }) {
    const { loading } = useProduct()
    const { categories } = useCategory()

    const [previews, setPreviews] = useState([]);

const handleMultiple = (e) => {
  const files = [...e.target.files];

  console.log('files',files);
  console.log('length',files.length);
  console.log('prev',previews);
  if ( files !== null || files.length !== 0) {
    
  const urls = files.map((file) => URL.createObjectURL(file));
  setPreviews((prev)=>[...prev, urls]);
  }
};

    
  return (
    <div className="w-full bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* LEFT SECTION */}
      <div className="flex flex-col gap-4">
        {/* Product Name */}
        <div className="flex flex-col gap-1">
          <FormInput
            type="text"
            label='Product Name'
            placeholder="Enter product name..."
            required= {true}
            className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Category + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium">Category <span className="text-red-500">*</span></label>
            <select className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none">
              <option>Choose category</option>
              {
                (categories || []).map((c)=>(
                    <option value={c}>{c.name}</option>
                ))
              }
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="font-medium">Stock <span className="text-red-500">*</span></label>
            <input
              type="number"
              placeholder="Enter stock..."
              className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
            />
          </div>
        </div>

        {/* Brand Name */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Brand Name <span className="text-red-500">*</span></label>
          <input
            type="text"
            placeholder="Enter brand name..."
            className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <label className="font-medium">Description</label>
          <textarea
            rows={5}
            placeholder="Enter description..."
            className="border px-3 py-2 rounded-lg focus:ring focus:ring-blue-300 outline-none resize-none"
          />
        </div>

        <p className="text-xs text-gray-400">Do not exceed 100 characters when entering the product name.</p>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col ml-10 gap-4">
        {/* Upload Images */}
        <div className="flex flex-col gap-2">
          <label className="font-medium">Upload Images <span className="text-red-500">*</span></label>

          <div className="grid grid-cols-2 gap-3">
            {/* file input */}
            <input type="file" className="border w-25 h-25" multiple accept="image/*" onChange={handleMultiple} />

            <div className="grid grid-cols-3 gap-2">
            {previews.map((src, i) => (
            <img key={i} src={src} className="w-24 h-24 object-cover rounded" />
            ))}
            </div>
          </div>
        </div>

        {/* ACTION BUTTONS */}
        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant= {'danger'}
            size= 'md'
            loading= {loading}
            onClick={onCancel}
          >
            CANCEL
          </Button>

          <Button
            variant= 'primary'
            size= 'md'
            loading= {loading}
            onClick={onSubmit}
          >
            ADD PRODUCT
          </Button>
        </div>
      </div>
    </div>
  );
}
