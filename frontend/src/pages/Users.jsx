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
import UserProfileCard from "../components/ui/UserProfileCard";
import { useAdmin } from "../context/AdminContext";

///Admin users page

const Users = memo((setTitle) => {
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [isDelete, setIsDelete] = useState(false);
  const [deleteData, setDeleteData] = useState(null);

  const {
    users,
    pagination,
    filters,
    setFilters,
    setPagination,
    getUsers,
    banUser,
    unBanUser,
    debouncedSearch
  } = useAdmin();

  //fetch products on page load
  useEffect(() => {
    getUsers();
  }, [debouncedSearch]);


  const totalItems = pagination?.totalUsers || 30;
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

        {/* <Button
          size="sm"
          variant={'custom'}
          style={{ height: 30 }}
          onClick={() => handleProductForm()}
          className={'m-4'}
        >
          ADD PRODUCT
        </Button> */}
      </div>

      {filters.search && !users?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (
       <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
         {users.map(user => (
          <UserProfileCard 
          key={user._id}
          user={user}
          onBlock={(userId) => banUser(userId)}
          unBlock={(userId)=> unBanUser(userId)}
        />
        ))}
       </div>
      )}

      {totalPages > 1 && (
        <Pagination
          setPagination={setPagination}
          currentPage={pagination.page}
          totalPages={pagination.totalPages}
          itemsPerPage={pagination.limit}
          totalItems={pagination.totalUsers}
          onPageChange={setPagination}
        />
      )}
    </>
  );
});

export default Users;
