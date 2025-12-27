import React, { memo, useCallback, useEffect, useRef, useState } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrderThunk,
  setFilters,
  setPagination,
  updateStatusThunk,
} from "../redux/slices/orderSlice";
import { ORDER_STATUS } from "../config/app";
import { useNavigate } from "react-router-dom";
import useDebounce from "../hooks/useDebounce";
import { Filter } from "lucide-react";
import FormSelect from "../components/ui/FormSelect";
import { toast } from "react-toastify";

///Admin product page

const OrdersAdmin = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const selectRef = useRef("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { filters, pagination, orders } = useSelector((state) => state.order);
  const debouncedSearch = useDebounce(filters.search, 500);

  const query = {
    role: 'admin',
    page: pagination.page,
    status: filters.status,
    search: debouncedSearch,
    limit: 10,
  };
  //fetch Orders on page load
  //   useEffect(() => {
  //     dispatch(fetchOrderThunk());
  //   }, []);

  useEffect(() => {
    dispatch(fetchOrderThunk(query));
  }, [pagination.page, filters.status, debouncedSearch]);

  const statuses = ORDER_STATUS.map((status) => ({
    label: status,
    value: status,
  }));

  console.log("statuses", statuses);

  //HANDLE PAGINATION PAGE CHANGE
  const handlePageChange = ({ page }) => {
    dispatch(setPagination({ page }));
    navigate(`?page=${page}`, { replace: true });
  };

  useEffect(() => {
    console.log("status in admin", filters.status);
  }, [filters.status]);

  //CHANGE FILTER FROM SELECT ONCHANGE VALUE
  const handleStatusChange = (e) => {
    dispatch(setFilters({status: e.target.value}))
  }

  //HANDLE ADMIN STATUS UPDATE
  const updateStatusHandler = async(orderId, updateStatus) => {
        await dispatch(updateStatusThunk({orderId, updateStatus})).unwrap()
        toast.success('Status updated successfully')
  }

  return (
    <>
      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">

{/* SEARCH FILTER */}
        <FormInput
          placeholder="Search"
          icon={<IoSearch />}
          value={filters.search || ""}
          onChange={(e) => dispatch(setFilters({ search: e.target.value }))}
          className={"flex-1 m-5"}
        />

{/* STATUS SELECTION FILTER */}
        <div className="flex gap-2 flex-wrap">
          <div className="w-50 m-2">
            <FormSelect
              name='status'
              value={filters.status}
              onChange={handleStatusChange}
              options={statuses}
              placeholder= 'Filter by status'
            />
          </div>
        </div>
      </div>

{/* MAIN CONTENT */}
      {filters.search && !orders?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={[
            "order Id",
            "total Amount",
            "payment Method",
            "order Status",
          ]}
          data={orders}
          //   actions={{
          //     // onEdit: handleProductForm,
          //     // onDelete: handleDeleteProduct,
          //   }}
          type={'orders'}
          onStatusChange={updateStatusHandler}
        />
      )}

      {pagination.totalPages > 1 && (
        <Pagination
          currentPage={pagination.page}
          itemsPerPage={pagination.limit}
          totalPages={pagination.totalPages}
          totalItems={pagination.totalOrders}
          onPageChange={handlePageChange}
        />
      )}
    </>
  );
});

export default OrdersAdmin;
