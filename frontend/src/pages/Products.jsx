import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  FormInput,
  Modal,
  Pagination,
} from "../components/ui";
import Table from "../components/ui/Table";
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import { useProduct } from "../context/ProductContext";
import SearchNotFound from "../components/ui/SearchNotFound";
import ProductForm from "../components/ui/ProductForm";
import { TableSkeleton } from "../components/ui/TableSkeleton";

///Admin product page

const Products = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

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
    debouncedSearch,
    toggleProductStatus,
    loading
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

  const handleSubmit = async(values) => {
    if (editData?._id) {
      updateProduct(editData._id, values);
      setEditData(null);
      setOpen(false);
    } else {
        const res = await addProduct(values);
        if (res.success) {
        setOpen(false);
        }
    }
  }

  const totalItems = pagination?.totalProducts || 30;
  const totalPages = pagination?.totalPages;

  return (
    loading ? (
      <TableSkeleton />
    ) :
    (
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

      <div className="flex justify-around items-center bg-white mb-5 rounded-lg">
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
          // style={{ height: 0 }}
          onClick={() => handleProductForm()}
          className={'m-4 min-h-[10px]'}
        >
          ADD PRODUCT
        </Button>
      </div>

      {filters.search && !products?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["images", "name", "stock", "sellingPrice", "status"]}
          type="status"
          data={products}
          actions={{
            onEdit: handleProductForm,
            onDelete: handleDeleteProduct,
          }}
          onStatusChange={toggleProductStatus}
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
    )
  );
});

export default Products;
