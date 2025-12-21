import React, { useEffect, useState } from "react";
import { useFormik, FieldArray } from "formik";

import Button from "./Button";
import { useProduct } from "../../context/ProductContext";
import { useCategory } from "../../context/CategoryContext";

import FormInput from "./FormInput";
import FormTextarea from "./FormTextArea";
import FormSelect from "./FormSelect";
import { ImageInput } from "./imageInput";
import { productAddSchema } from "../../validation/userSchema";

export default function ProductForm({ onConfirm, onCancel, editData = '' }) {
  const { loading } = useProduct();
  const { categories, fetchCategories } = useCategory();
  useEffect(() => {
    if (categories.length === 0) {
      const load = async () => {
        await fetchCategories()
      }
      load()
    }
  },[])

  const [previews, setPreviews] = useState([]);
  const [images, setImages] = useState([]);

  // ---- IMAGE HANDLING ----
  const handleMultiple = (e) => {
    const files = [...e.target.files];
    setImages((prev) => [...prev, ...files]);

    const urls = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...urls]);
  };

  // ---- FORM STATE ----
  const formik = useFormik({
    initialValues:
      editData ? {
      name: editData.name,
      categoryId: editData.categoryId,
      brandName: editData.brandName,
      basePrice: editData.basePrice,
      discount: editData.discount,
      description: editData.description,
      stock: editData.stock
    } : {
      name: "",
      categoryId: "",
      brandName: "",
      basePrice: '',
      discount: '',
      description: "",
      stock: ""
    }
     ,

    validationSchema: productAddSchema,

    onSubmit: (values) => {
      const finalData = {
        ...values,
        images,
      };

      onConfirm(finalData)
      
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit} noValidate
      className="w-full h-[80vh] overflow-y-auto bg-white p-6 rounded-xl shadow-sm border grid grid-cols-1 gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* Product Name */}
        <FormInput
          label="Product Name"
          name="name"
          required
          placeholder="Enter product name..."
          value={formik.values.name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.name && formik.errors.name}
        />

        {/* Category + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Category"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose category"
            options={(categories || []).map((c) => ({
              value: c._id,
              label: c.name,
            }))}
            error={formik.touched.categoryId && formik.errors.categoryId}
          />

          <FormInput
            label="Stock"
            name="stock"
            required
            type="number"
            min="0"
            step="1"
            placeholder="Enter stock..."
            value={formik.values.stock}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.stock && formik.errors.stock}
          />
        </div>
        {/* basePrice+discount */}
        <div className="grid grid-cols-2 gap-4">
          <FormInput
            label="basePrice"
            name="basePrice"
            required
            type="number"
            min="0"
            step="1"
            placeholder="Enter basePrice..."
            value={formik.values.basePrice}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.basePrice && formik.errors.basePrice}
          />
          <FormInput
            label="Discount"
            name="discount"
            type="number"
            min="0"
            step="1"
            placeholder="Enter discount..."
            value={formik.values.discount}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.discount && formik.errors.discount}
          />
        </div>
        {/* Brand */}
        <FormInput
          label="Brand Name"
          name="brandName"
          required
          placeholder="Enter brand name..."
          value={formik.values.brandName}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.brandName && formik.errors.brandName}
        />

        {/* Description */}
        <div className="relative">
          <FormTextarea
            label="Description"
            name="description"
            required
            placeholder="Enter description..."
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.description && formik.errors.description}
          />

          <p className="text-xs text-gray-400 absolute bottom-[-5px]">
            Do not exceed 100 characters when entering the description.
          </p>
        </div>
      </div>

      {/* RIGHT SECTION */}
      <div className="flex flex-col ml-10 gap-4">
        <div className="grid grid-cols-4 gap-3">
          {previews.map((src, i) => (
            <img key={i} src={src} className="w-24 h-24 object-cover rounded" />
          ))}
        </div>

        <ImageInput handleMultiple={handleMultiple} editData={editData} />

        <div className="flex justify-end gap-4 mt-4">
          <Button
            variant="danger"
            onClick={onCancel}
            size="md"
            loading={loading}
          >
            CANCEL
          </Button>

          <Button type="submit" variant="primary" size="md" loading={loading}>
           {editData ?  'UPDATE PRODUCT' : 'ADD PRODUCT'}
          </Button>
        </div>
      </div>
    </form>
  );
}