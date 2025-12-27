import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import SearchNotFound from "./SearchNotFound";
import ProductNotFound from "./ProductNotFound";
import Button from "./Button";
import Modal from "./Modal";
import AddressForm from "./AddressForm";
import ConfirmDialog from "./ConfirmDialog";
import { Delete, DeleteIcon, Edit } from "lucide-react";

export default function AddressCard({
  name = "Jhon doe",
  addressLine1 = "Thalassery, 2nd street",
  addressLine2 = "Thalassery north",
  city = "Kannur",
  state = "Kerala",
  mobile = "9243000000",
  onEdit,
  onRemove,
}) {
  const { user, addAddress, editAddress, deleteAddress } = useUser();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState("");
  const [deleteId, setDeleteId] = useState("");

  const handleAddButton = () => {
    setIsAdd(true);
  };

  // HANDLE EDIT BUTTON ONCLICK
  const handleEditButton = (address) => {
    setIsEdit(true);
    setEditData(address);
  };

  const handleSubmit = async (values) => {
    if (editData) {
      const res = await editAddress(editData._id, values);
      if (res.success) {
        setEditData(null);
        setIsEdit(false);
      }
    } else {
      const res = await addAddress(values);
      res.success ? setIsAdd(false) : null;
    }
  };

  const handleDeleteButton = (addressId) => {
    setDeleteId(addressId);
  };

  const handleDeleteSubmit = async (deleteId) => {
    const res = await deleteAddress(deleteId);
    res.success ? setDeleteId(null) : null;
  };

  //HANDLE FORM MODAL CLOSE BUTTON
  const handleModalClose = () => {
    if (isAdd) {
      setIsAdd(false);
    }
    if (isEdit) {
      setEditData(null);
      setIsEdit(false);
    }
  };

  //HANDLE DELETE MODAL CLOSE
  const handleDeleteModalClose = () => {
    if (deleteId) {
      setDeleteId(null);
    }
  };
  return (
    <>
      <div className="w-full flex justify-end mb-4">
        <Button
          size="md"
          variant={'custom'}
          className=" text-white py-2 rounded-lg text-sm font-medium"
          onClick={handleAddButton}
        >
          ADD ADDRESS
        </Button>
      </div>
      <div className="flex flex-col">
        {user.addresses?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {user.addresses.map((address) => (
              <div className="max-w-[500px] lg:max-w-[420px] bg-gray-100 hover:outline-1 outline-violet-300 rounded-xl p-6 shadow-sm">
                {/* NAME */}
                <h3 className="font-semibold text-gray-900 mb-2">
                  {address.fullName}
                </h3>

                {/* ADDRESS */}
                <div className="text-sm text-gray-600 space-y-1">
                  <p>{address.addressLine}</p>
                  <p>{address.city}</p>
                  <p>{address.state}</p>
                  <p>
                    <span className="font-medium text-gray-700">Mobile:</span>{" "}
                    {address?.phone}
                  </p>
                  <p>
                    <span className="font-medium text-gray-700">
                      {address?.label}
                    </span>{" "}
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-10 mt-6">
                  <Edit
                    onClick={() => handleEditButton(address)}
                    className=" text-green-700 h-10 w-10 hover:text-green-500 cursor-pointer py-2 rounded-lg "
                  />
                  <DeleteIcon
                    onClick={() => handleDeleteButton(address._id)}
                    className=" py-2 text-red-700 hover:text-red-500 cursor-pointer rounded-lg h-10 w-10"
                  >
                    REMOVE
                  </DeleteIcon>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="w-full">
            <ProductNotFound
              keyWord={"No address"}
              content={"Please add addresses"}
            />
          </div>
        )}
      </div>

      {(isAdd || isEdit) && (
        <Modal
          isOpen={isAdd || isEdit}
          size="xl"
          onClose={handleModalClose}
          title={isAdd ? "Add Address" : "Edit address"}
        >
          <AddressForm
            userId={user._id}
            editData={editData}
            onSubmit={handleSubmit}
          />
        </Modal>
      )}
      {deleteId && (
        <ConfirmDialog
          isOpen={deleteId ? true : false}
          onCancel={() => setDeleteId(null)}
          onConfirm={() => handleDeleteSubmit(deleteId)}
          title="Are you sure to delete?"
          message="This cannot be undone!"
          confirm="Confirm"
          cancel="Cancel"
        />
      )}
    </>
  );
}
