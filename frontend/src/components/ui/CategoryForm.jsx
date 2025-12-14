import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormInput from "./FormInput";
import FormTextarea from "./FormTextArea";
import Button from "./Button";
import { IoIosAddCircle } from "react-icons/io";

const CategoryForm = ({ initialData= null, handleSubmit }) => {

  const initialValues = {
    name: initialData?.name || "",
    description: initialData?.description || "",
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Category name is required"),
    description: Yup.string().required('Description is required'),
  });

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      enableReinitialize
      onSubmit={handleSubmit}
    >
      {({ values, errors, touched, handleChange, handleBlur }) => (
        <Form>
          <div className="flex flex-col">

            {/* NAME */}
            <FormInput
              label="Category Name"
              name="name"
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.name && errors.name}
              placeholder="Enter category name"
            />

            {/* DESCRIPTION */}
            <FormTextarea
              label="Description"
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              error={touched.description && errors.description}
              placeholder="Enter description"
            />

            <Button
              icon={<IoIosAddCircle />}
              className="mt-4"
              type="submit"
            >
              {initialData ? "EDIT CATEGORY" : "ADD CATEGORY"}
            </Button>

          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CategoryForm;