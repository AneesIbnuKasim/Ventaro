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
import { useProduct } from "../context/ProductContext";
import SearchNotFound from "../components/ui/SearchNotFound";
import ProductForm from "../components/ui/ProductForm";
import { useCategory } from "../context/CategoryContext";

///Admin product page

const Products = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { fetchCategories, categories } = useCategory();
  

  const {
    products,
    pagination,
    filters,
    setFilters,
    setPagination,
    fetchProduct,
    addProduct,
    updateProduct,
    deleteProduct,
    debouncedSearch
  } = useProduct();

  //fetch products on page load
  useEffect(() => {
    fetchProduct();
  }, [
    pagination.page,
    pagination.limit,
    filters.category,
    filters.sortBy,
    filters.sortOrder,
    debouncedSearch,
  ]);

  const handleDeleteProduct = useCallback((product) => {
    setIsDelete(true);
    setDeleteData(product);
  }, []);

  const handleDeleteCancel = () => {
    setIsDelete(false)
    setDeleteData(null)
  }

  const handleDeleteSubmit = useCallback(() => {
    setIsDelete(false);

    deleteProduct(deleteData._id);

    setDeleteData(null);
  }, [deleteData]);

  //open product form edit/add
  const handleProductForm = useCallback((product) => {
    if (product) setEditData(product);
    setOpen(true);
  }, []);

  const closeProductForm = useCallback(() => {
    setEditData(null);
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (editData) setEditData(null);
    setOpen(false);
  }, []);

  const handleSubmit = (values) => {
    if (editData?._id) {
      updateProduct(editData._id, values);
        setEditData(null);
        setOpen(false);
    } else {
        addProduct(values);
        setOpen(false);
    }
  };

  const totalItems = pagination?.totalProducts || 30;
  const totalPages = pagination?.totalPages;

  return (
    <>
      {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeProductForm}
          className= 'overflow-y-auto'
          title={editData ? "Edit Product" : "Add Product"}
        >
          <ProductForm onConfirm={handleSubmit} editData={editData} onCancel={handleCancel} />
        </Modal>
      )}

      {/* Delete confirmation modal */}
      {isDelete && (
        <ConfirmDialog
          isOpen={isDelete}
          title="Are you sure to delete"
          onCancel={handleDeleteCancel}
          onConfirm={handleDeleteSubmit}
        />
      )}

      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">
        <FormInput
          placeholder="Search"
          icon={<IoSearch />}
          value={filters.search || ""}
          onChange={(e) => setFilters({ search: e.target.value })}
          className={'flex-1 m-5'}
        />

        <Button
          size="sm"
          variant={'custom'}
          style={{ height: 30 }}
          onClick={() => handleProductForm()}
          className={'m-4'}
        >
          ADD PRODUCT
        </Button>
      </div>

      {filters.search && !products?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["images", "name", "description", "sellingPrice", "status"]}
          data={products}
          actions={{
            onEdit: handleProductForm,
            onDelete: handleDeleteProduct,
          }}
        />
      )}

      {totalPages > 1 && (
        <Pagination
          setPagination={setPagination}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.limit}
          totalItems={pagination.totalProducts}
          onPageChange={setPagination}
        />
      )}
    </>
  );
});

export default Products;
