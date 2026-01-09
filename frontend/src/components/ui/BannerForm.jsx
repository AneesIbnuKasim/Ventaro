import React, { useEffect, useState } from "react";
import { useFormik, FieldArray } from "formik";

import Button from "./Button";
import { useProduct } from "../../context/ProductContext";
import { useCategory } from "../../context/CategoryContext";

import FormInput from "./FormInput";
import FormSelect from "./FormSelect";
import { bannerSchema } from "../../validation/userSchema";
import { useSelector } from "react-redux";

export default function BannerForm({ onConfirm, onCancel, editData = "" }) {
  const { loading } = useSelector((state) => state.banner);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ---- IMAGE HANDLING ----
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  //CLEAN PREVIEW
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  //EDIT IMAGE HANDLE
  useEffect(() => {
    if (editData?.image) {
      setPreview(editData.image); // backend URL
      setImage(null); // only send new file if changed
    }
  }, [editData]);

  // ---- FORM STATE ----
  const formik = useFormik({
    initialValues: editData
      ? {
          title: editData.title,
          subTitle: editData.subTitle,
          urlLink: editData.urlLink,
          position: editData.position,
          isActive: editData.isActive,
          order: editData.order,
        }
      : {
          title: "",
          subTitle: "",
          urlLink: "",
          position: "",
          isActive: "",
          order: "",
        },
    validationSchema: bannerSchema,

    onSubmit: (values) => {
      const finalData = {
        ...values,
        image,
      };

      console.log("final data", finalData);

      onConfirm(finalData);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      noValidate
      className="w-full h-[80vh] overflow-y-auto bg-white p-6 rounded-xl shadow-sm grid grid-cols-1 gap-6"
    >
      <div className="flex flex-col gap-4">
        {/* banner title */}
        <FormInput
          label="Banner Title"
          name="title"
          required
          placeholder="Enter banner title..."
          value={formik.values.title}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.title && formik.errors.title}
        />

        <FormInput
          label="Sub Title"
          name="subTitle"
          required
          placeholder="Enter banner sub-title..."
          value={formik.values.subTitle}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          error={formik.touched.subTitle && formik.errors.subTitle}
        />

        {/* Position */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Position"
            name="position"
            value={formik.values.position}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose position"
            options={(["HOME_TOP", "HOME_MIDDLE"] || []).map((p) => ({
              value: p,
              label: p.replace("_", " "),
            }))}
            error={formik.touched.position && formik.errors.position}
          />

          <FormInput
            label="URL Link"
            name="urlLink"
            required
            type="string"
            placeholder="Enter URL link..."
            value={formik.values.urlLink}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.urlLink && formik.errors.urlLink}
          />
        </div>
        {/* Active + Order */}
        <div className="grid grid-cols-2 gap-4">
          <FormSelect
            label="Active"
            name="isActive"
            value={formik.values.isActive}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            required
            placeholder="Choose position"
            options={(["Yes", "No"] || []).map((p) => ({
              value: p === "Yes" ? true : false,
              label: p,
            }))}
            error={formik.touched.isActive && formik.errors.isActive}
          />
          <FormInput
            label="Order"
            name="order"
            type="number"
            min="0"
            step="1"
            placeholder="Enter order"
            value={formik.values.order}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.order && formik.errors.order}
          />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3">
          <label className="cursor-pointer">
            {preview ? (
              <img
                src={preview}
                alt="preview"
                className="w-full h-48 object-scale-down rounded-xl border border-dashed hover:opacity-90 transition"
              />
            ) : (
              <div className="w-full h-48 border-2 border-dashed rounded-xl flex items-center justify-center text-gray-400">
                Click to upload banner image
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  hidden
                />
              </div>
            )}
          </label>
        </div>

        <div className="flex  justify-end gap-4 mt-4">
          {/* <Button
            variant="danger"
            onClick={onCancel}
            size="sm"
            className={'flex-1'}
          >
            CANCEL
          </Button> */}

          <Button
            type="submit"
            variant="custom"
            size="sm"
            loading={loading}
            className={"flex-1"}
          >
            {editData ? "UPDATE BANNER" : "ADD BANNER"}
          </Button>
        </div>
      </div>
    </form>
  );
}
