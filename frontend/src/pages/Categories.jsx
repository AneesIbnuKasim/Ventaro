import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  FormInput,
  Modal,
  Pagination,
  StatCard,
  UserCard,
  UserTableRow,
} from "../components/ui";
import Table from "../components/ui/Table";
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import CategoryForm from "../components/ui/CategoryForm";
import { useCategory } from "../context/CategoryContext";
import SearchNotFound from "../components/ui/SearchNotFound";
import { useSearchParams } from "react-router-dom";


const Categories = memo(() => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const {
    categories,
    pagination,
    filters,
    setFilters,
    setPagination,
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    debouncedSearch
  } = useCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  

  // useEffect(() => {
  //   const page = Number(searchParams.get('page')) || 1
  //   const search = searchParams.get('search') || ''
  //   setPagination({ page })
  //   setFilters({ search })
  // }, [searchParams])

  //   const updateURL = (field, value) => {
  //   const params = new URLSearchParams(searchParams);
  //   params.set(field, value);
  //   params.set("limit", pagination.limit);
  //   setSearchParams(params);

  //   if (field === "page") setPagination({ page: Number(value) });
  //   if (field === "search") setFilters({ search: value });

  // }
  // console.log('page', pagination.totalPages)

  //fetch categories on load
  useEffect(() => {
    fetchCategories();
  }, [pagination.page, pagination.limit, debouncedSearch]);

  //pagination page change handler
  const onPageChange = (value) => {
    setPagination({ page: value });
  };

  const handleDeleteCategory = useCallback((category) => {
    setIsDelete(true);
    setDeleteData(category);
  });

  const handleDeleteSubmit = useCallback(() => {
    setIsDelete(false);

    deleteCategory(deleteData._id);

    setDeleteData(null);
  }, [deleteData]);

  //open category form edit/add
  const handleCategoryForm = useCallback((category) => {
    if (category) setEditData(category);
    setOpen(true);
  });

  const closeCategoryForm = useCallback(() => {
    updateCategory;
    setEditData(null);
    setOpen((prev) => !prev);
  });

  //handle search inputs
  const handleSearch = useCallback((e) => {
    setFilters({ search: e.target.value });
    setPagination({ page: 1 });
  }, []);

  const handleSubmit = async (values) => {
    if (editData?._id) {
      const res = await updateCategory(editData._id, values);

      if (res.success) {
        setEditData(null);
        setOpen(false);
      }
    } else {
      const res = await addCategory(values);

      if (res.success) {
        setOpen(false);
      }
    }
  };

  const totalItems = pagination?.totalCategories || 30;
  const totalPages = pagination?.totalPages;

  return (
    <>
      {open && (
        <Modal
          isOpen={open}
          size="md"
          onClose={closeCategoryForm}
          title={editData ? "Edit Category" : "Add Category"}
        >
          <CategoryForm
            initialData={editData}
            // onClose={closeCategoryForm}
            handleSubmit={handleSubmit}
          />
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {isDelete && (
        <ConfirmDialog
          isOpen={isDelete}
          title="Are you sure to delete"
          onCancel={handleDeleteCategory}
          onConfirm={handleDeleteSubmit}
        />
      )}

      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">
        <FormInput
          placeholder="Search"
          icon={<IoSearch />}
          value={filters.search || ""}
          onChange={(e) => handleSearch(e)}
        />

        <Button
          size="lg"
          style={{ height: 30 }}
          onClick={() => handleCategoryForm()}
        >
          ADD CATEGORY
        </Button>
      </div>

      {filters.search && !categories?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["name", "description", "createdAt"]}
          data={categories}
          actions={{
            onEdit: handleCategoryForm,
            onDelete: handleDeleteCategory,
          }}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          onPageChange={onPageChange}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={totalItems}
        />
      )}
    </>
  );
});

export default Categories;
