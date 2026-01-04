import React, { memo, useCallback, useEffect, useState } from "react";
import {
  Button,
  FormInput,
  Modal,
  Pagination,
  StatCard,
  UserCard,
  UserTableRow,
} from "../components/ui/index.js";
import Table from "../components/ui/Table.jsx";
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from "../components/ui/ConfirmDialog.jsx";
import CategoryForm from "../components/ui/CategoryForm.jsx";
// import { useCoupon } from "../context/CouponContext";
import SearchNotFound from "../components/ui/SearchNotFound.jsx";
import CouponForm from "../components/ui/CouponForm.jsx";
import { useCategory } from "../context/CategoryContext.jsx";
import { useDispatch, useSelector } from "react-redux";
import { addCouponThunk, fetchCouponThunk, removeCouponThunk, setSearch, updateCouponThunk } from "../redux/slices/couponSlice.js";
import useDebounce from "../hooks/useDebounce.js";
import { toast } from "react-toastify";

///Admin Coupon page

const Coupons = memo(() => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { fetchCategories, categories, filters } = useCategory();
  const {coupons, search} = useSelector(state=> state.coupon)
  const dispatch = useDispatch()

  const debouncedSearch = useDebounce(search, 500)

  // fetch coupons on page load
  useEffect(() => {
    const load = async() => {
      dispatch(fetchCouponThunk({search: debouncedSearch}))
    }
    load()
  }, [
    // pagination.page,
    // pagination.limit,
    // filters.category,
    // filters.sortBy,
    // filters.sortOrder,
    debouncedSearch,
  ]);

  const handleDeleteCoupon = useCallback((Coupon) => {
    setIsDelete(true);
    setDeleteData(Coupon);
  }, []);

  const handleCouponEditForm = (coupon) => {
    setEditData(coupon)
    setOpen(true)
  }

  const handleDeleteCancel = () => {
    setIsDelete(false)
    setDeleteData(null)
  }

  const handleDeleteSubmit = useCallback(() => {
    setIsDelete(false);

    dispatch(removeCouponThunk(deleteData._id)).unwrap()

    toast.success('Coupon deleted successfully')

    setDeleteData(null);
  }, [deleteData]);

  //open Coupon form edit/add
  // const handleCouponForm = useCallback(() => {
  //   console.log('edit ', editData);
    
  //   setOpen(true);
  // }, []);

  const closeCouponForm = useCallback(() => {
    setEditData(null);
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    if (editData) setEditData(null);
    setOpen(false);
  }, []);

  const handleSubmit = async (values) => {
    
    if (editData?._id) {

      await dispatch(updateCouponThunk({ couponId: editData._id, data: values })).unwrap()

        setEditData(null);
        setOpen(false);
        toast.success('Coupon updated successfully')
    } else {
      await dispatch(addCouponThunk(values)).unwrap()
      toast.success("Coupon created");
        setOpen(false);
    }
  };

  // const totalItems = pagination?.totalCoupons || 30;
  // const totalPages = pagination?.totalPages;

  return (
    <>
      {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeCouponForm}
          className= 'overflow-y-auto'
          title={editData ? "Edit Coupon" : "Add Coupon"}
        >
          <CouponForm onConfirm={handleSubmit} editData={editData} onCancel={handleCancel} />
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
          value={search || ""}
          onChange={(e) => dispatch(setSearch(e.target.value))}
          className='flex-1 m-5'
        />

        <Button
          size="md"
          variant='custom'
          style={{ height: 30 }}
          onClick={() => setOpen(true)}
          className='m-4'
        >
          ADD COUPON
        </Button>
      </div>

      {filters.search && !coupons?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["code", "start Date", "end Date", "discount Value", "discount Type"]}
          data={coupons}
          actions={{
            onEdit: handleCouponEditForm,
            onDelete: handleDeleteCoupon,
          }}
        />
      )}

      {/* {totalPages > 1 && (
        <Pagination
          setPagination={setPagination}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.limit}
          totalItems={pagination.totalCoupons}
          onPageChange={setPagination}
        />
      )} */}
    </>
  );
});

export default Coupons;
