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
import { addCouponThunk } from "../redux/slices/couponSlice.js";

///Admin Coupon page

const Coupons = memo(() => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { fetchCategories, categories, filters } = useCategory();
  const {coupons} = useSelector(state=> state.coupon)
  const dispatch = useDispatch()


  //fetch coupons on page load
  // useEffect(() => {
  //   fetchCoupon();
  // }, [
  //   pagination.page,
  //   pagination.limit,
  //   filters.category,
  //   filters.sortBy,
  //   filters.sortOrder,
  //   debouncedSearch,
  // ]);

  const handleDeleteCoupon = useCallback((Coupon) => {
    setIsDelete(true);
    setDeleteData(Coupon);
  }, []);

  const handleDeleteCancel = () => {
    setIsDelete(false)
    setDeleteData(null)
  }

  const handleDeleteSubmit = useCallback(() => {
    // setIsDelete(false);

    // deleteCoupon(deleteData._id);

    // setDeleteData(null);
  }, [deleteData]);

  //open Coupon form edit/add
  const handleCouponForm = useCallback((Coupon) => {
    if (Coupon) setEditData(Coupon);
    setOpen(true);
  }, []);

  const closeCouponForm = useCallback(() => {
    setEditData(null);
    setOpen(false);
  }, []);

  const handleCancel = useCallback(() => {
    // if (editData) setEditData(null);
    // setOpen(false);
  }, []);

  const handleSubmit = async (values) => {
    if (editData?._id) {
      const res = await updateCoupon(editData._id, values);

      if (res.success) {
        setEditData(null);
        setOpen(false);
      }
    } else {
      dispatch(addCouponThunk(values))

      if (res?.success) {
        setOpen(false);
      }
    }
    console.log('values', values);
    
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
          value={filters.search || ""}
          onChange={(e) => setFilters({ search: e.target.value })}
        />

        <Button
          size="md"
          style={{ height: 30 }}
          onClick={() => handleCouponForm()}
        >
          ADD Coupon
        </Button>
      </div>

      {filters.search && !coupons?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["code", "description", "price", "status"]}
          data={coupons}
          actions={{
            onEdit: handleCouponForm,
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
