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
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderThunk, setFilters, setPagination } from "../redux/slices/orderSlice";
import { ORDER_STATUS } from "../config/app";
import { useNavigate } from "react-router-dom";

///Admin product page

const OrdersAdmin = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);
  const { fetchCategories, categories } = useCategory();
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { filters, pagination, orders } = useSelector(state => state.order)
  
const query = {
    page: pagination.page,
    status: filters.status,
    search: filters.search,
    limit: 10,
}
//   //fetch Orders on page load
//   useEffect(() => {
//     dispatch(fetchOrderThunk({page: pagination.page}));
//   }, []);

  useEffect(() => {
    dispatch(fetchOrderThunk(query));
  }, [
    pagination.page,
    pagination.limit,
    filters.status,
    filters.search
  ]);

//HANDLE PAGINATION PAGE CHANGE
    const handlePageChange = ({ page }) => {
    dispatch(setPagination({ page }));
    navigate(`?page=${page}`, { replace: true });
  };

  useEffect(() => {
    console.log('orders in admin', orders);
    
  }, [orders])
  const totalItems = pagination?.totalOrders || 30;
  const totalPages = pagination?.totalPages;

  return (
    <>
      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">
        <FormInput
          placeholder="Search"
          icon={<IoSearch />}
          value={filters.search || ""}
          onChange={(e) => dispatch(setFilters({search: e.target.value}))}
          className={'flex-1 m-5'}
        />

        <div className="flex gap-2 flex-wrap">
      {ORDER_STATUS.map((status) => {
        const active = filters.status === status;
          (<button
            key={status}
            onClick={() => dispatch(setFilters({status: status}))}
            className={`rounded-full px-4 py-1.5 text-sm capitalize transition
              ${
                active
                  ? "bg-black text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
          >
            {status}
          </button>)
      })}
    </div>
      </div>

      {filters.search && !orders?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
        <Table
          columns={["order Id", "total Amount","payment Method", "order Status"]}
          data={orders}
        //   actions={{
        //     // onEdit: handleProductForm,
        //     // onDelete: handleDeleteProduct,
        //   }}
        />
      )}

      {totalPages > 1 && (
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
