import React, { memo, useCallback, useEffect, useState } from "react";
import { Button, FormInput, Modal } from "../components/ui";
import Table from "../components/ui/Table";
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import SearchNotFound from "../components/ui/SearchNotFound";
import { useDispatch, useSelector } from "react-redux";
import BannerForm from "../components/ui/BannerForm";
import {
  createBannerThunk,
  deleteBannerThunk,
  fetchBannerThunk,
  setFilters,
  toggleStatusThunk,
  updateBannerThunk,
} from "../redux/slices/bannerSlice";
import { toast } from "react-toastify";
import { TableSkeleton } from "../components/ui/TableSkeleton";

///Admin product page

const Products = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { banners, filters, loading } = useSelector((state) => state.banner);
  const dispatch = useDispatch();

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
    dispatch(fetchBannerThunk({search:filters.search}));
  }, [filters]);

  const handleDeleteBanner = useCallback((banner) => {
    setIsDelete(true);
    setDeleteData(banner);
  }, []);

  const handleDeleteCancel = () => {
    setIsDelete(false);
    setDeleteData(null);
  };

  const handleDeleteSubmit = useCallback(() => {
    setIsDelete(false);

    dispatch(deleteBannerThunk(deleteData._id))
    toast.success('Banner deleted successfully')
    setDeleteData(null);
  }, [deleteData]);

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

  const handleSubmit = async (values) => {
    if (editData?._id) {
      const data = await dispatch(
        updateBannerThunk({ bannerId: editData._id, values })
      ).unwrap();
      toast.success('Banner updated successfully')
      setOpen(false);
      setEditData(null);
    } else {
      const data = await dispatch(createBannerThunk(values)).unwrap();
      setOpen(false);
    }
  };

  const handleStatus = async(id, data) => {
    // dispatch(toggleStatus(id))
   const res = await dispatch(toggleStatusThunk(id)).unwrap()
   toast.success('Status changed')
  }
  return (
      <>
      {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeBannerForm}
          className="overflow-y-auto"
          title={editData ? "Edit Banner" : "Add Banner"}
        >
          <BannerForm
            onConfirm={handleSubmit}
            editData={editData}
            onCancel={handleCancel}
          />
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
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          className={"flex-1 m-5"}
        />

        <Button
          size="sm"
          variant={"custom"}
          style={{ height: 30 }}
          onClick={() => handleBannerForm()}
          className={"m-4"}
        >
          ADD BANNER
        </Button>
      </div>

      {
        loading ? (
          <TableSkeleton/>
        ) :
        (
          <>
          {filters.search && !banners?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={[
            "image",
            "title",
            "sub Title",
            "link Value",
            "link Type",
            "position",
            "status",
          ]}
          type="status"
          data={banners}
          actions={{
            onEdit: handleBannerForm,
            onDelete: handleDeleteBanner,
          }}
          onStatusChange={handleStatus}
        />
      )}
          </>
        )
      }
    </>
    )
});

export default Products;
