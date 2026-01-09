import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  FormInput,
  Modal,
} from "../components/ui";
import Table from "../components/ui/Table";
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import SearchNotFound from "../components/ui/SearchNotFound";
import { useCategory } from "../context/CategoryContext";
import { useDispatch, useSelector } from "react-redux";
import BannerForm from "../components/ui/BannerForm";
import { createBannerThunk, fetchBannerThunk } from "../redux/slices/bannerSlice";

///Admin product page

const Products = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { fetchCategories, categories } = useCategory();
  const {banners, filters, loading } = useSelector(state => state.banner)
  const dispatch = useDispatch()

  //fetch products on page load
//   useEffect(() => {
//     fetchProduct();
//   }, [
//     pagination.page,
//     pagination.limit,
//     filters.category,
//     filters.sortBy,
//     filters.sortOrder,
//     debouncedSearch,
//   ]);

useEffect(() => {
    dispatch(fetchBannerThunk())
}, [])

  const handleDeleteBanner = useCallback((banner) => {
    setIsDelete(true);
    setDeleteData(banner);
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

  useEffect(()=>{
    console.log('banners eff', banners);
    
  }, [])

  //open product form edit/add
  const handleBannerForm = useCallback((banner) => {
    if (banner) setEditData(banner);
    setOpen(true);
  }, []);

  const closeBannerForm = useCallback(() => {
    setEditData(null);
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (editData) setEditData(null);
    setOpen(false);
  }, []);

  const handleSubmit = async(values) => {
    if (editData?._id) {
      updateBanner(editData._id, values);
        setEditData(null);
        setOpen(false);
    } else {
        const data = dispatch(createBannerThunk(values)).unwrap()
        setOpen(false)
    }
  };

  return (
    <>
      {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeBannerForm}
          className= 'overflow-y-auto'
          title={editData ? "Edit Banner" : "Add Banner"}
        >
          <BannerForm onConfirm={handleSubmit} editData={editData} onCancel={handleCancel} />
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
          onClick={() => handleBannerForm()}
          className={'m-4'}
        >
          ADD BANNER
        </Button>
      </div>

      {filters.search && !banners?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["image", "title", "sub Title", "url Link", "position", 'is Active']}
          data={banners}
          actions={{
            onEdit: handleBannerForm,
            onDelete: handleDeleteBanner,
          }}
        />
      )}
    </>
  );
});

export default Products;
