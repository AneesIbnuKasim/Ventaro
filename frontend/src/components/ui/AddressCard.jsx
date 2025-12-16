import React, { useState } from "react";
import { useUser } from "../../context/UserContext";
import SearchNotFound from "./SearchNotFound";
import ProductNotFound from "./ProductNotFound";
import Button from "./Button";
import Modal from "./Modal";
import AddressForm from "./AddressForm";

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
  const { user, addAddress, editAddress } = useUser();
  const [isAdd, setIsAdd] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editData, setEditData] = useState('');

  const handleAddButton = () => {
    setIsAdd(true);
  };

  // HANDLE EDIT BUTTON ONCLICK
  const handleEditButton = (address) => {
    setIsEdit(true)
    setEditData(address)
  }

  const handleSubmit = async (values) => {

    if (editData) {
      const res = await editAddress(editData._id, values)
      if (res.success) {
        setEditData(null)
        setIsEdit(false)
      }
    else {
        const res = await addAddress(values);
    console.log("add values", values);
   if (res.success)  setIsAdd(false);
    }
    
  }
}

  const handleModalClose = () => {
    if (isAdd) {
      setIsAdd(false) 
    }
    if(isEdit) {
      setEditData(null)
      setIsEdit(false)
    }
  }
  return (
    <>
      <div className="w-full flex justify-end mb-4">
        <Button size="md" onClick={handleAddButton}>
          ADD ADDRESS
        </Button>
      </div>
      <div className="flex flex-col">
        {user.addresses?.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {user.addresses.map((address) => (
              <div className="max-w-[500px] lg:max-w-[420px] bg-white border rounded-xl p-6 shadow-sm">
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
                    <span className="font-medium text-gray-700">{address?.label}</span>{" "}
                    
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="flex gap-4 mt-6">
                  <Button
                    onClick={() => handleEditButton(address)}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
                  >
                    EDIT
                  </Button>
                  <Button
                    onClick={onRemove}
                    className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
                  >
                    REMOVE
                  </Button>
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
          isOpen={(isAdd || isEdit)}
          size="xl"
          onClose={handleModalClose}
          title={isAdd ? "Add Address" : "Edit address"}
        >
          <AddressForm userId={user._id} editData= {editData} onSubmit={handleSubmit} />
        </Modal>
      )}
    </>
  );
}
