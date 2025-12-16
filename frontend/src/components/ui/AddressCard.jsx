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
  const { user, addAddress } = useUser()
  const [isAdd, setIsAdd] = useState(false)


  const handleAddButton = () => {
    setIsAdd(true)
  }

  const handleAddSubmit = async(values) => {
    const res = await addAddress(values)
    console.log('add values', values);
    setIsAdd(false)
  }
  return (
    <>
    <div className="w-full flex justify-end mb-4">
    <Button size='md'
    onClick = {handleAddButton}
    >
        ADD ADDRESS
      </Button>
    </div>
    <div className="flex ">
      
      {
       user.addresses?.length > 0 ? (<div>
        {user.addresses.map(address => (
          <div className="w-[420px] bg-white border rounded-xl p-6 shadow-sm">
      {/* NAME */}
      <h3 className="font-semibold text-gray-900 mb-2">{address.name}</h3>

      {/* ADDRESS */}
      <div className="text-sm text-gray-600 space-y-1">
        <p>{addressLine1}</p>
        <p>{addressLine2}</p>
        <p>{city}</p>
        <p>{state}</p>
        <p>
          <span className="font-medium text-gray-700">Mobile:</span> {mobile}
        </p>
      </div>

      {/* ACTIONS */}
      <div className="flex gap-4 mt-6">
        <button
          onClick={onEdit}
          className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700"
        >
          EDIT
        </button>
        <button
          onClick={onRemove}
          className="flex-1 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700"
        >
          REMOVE
        </button>
      </div>
    </div>
        ))
      }
       </div> ) : (<div className="w-full">
        <ProductNotFound keyWord={'No address'} content={'Please add addresses'} />
       </div>)  }
    </div>

    {
      isAdd && <Modal isOpen={isAdd} size="xl" onClose={()=>setIsAdd(false)} title={isAdd ? 'Add Address' : 'Edit address'} >
        <AddressForm 
        userId={user._id}
        onSubmit={handleAddSubmit}
        />
      </Modal>
    }
    </>
  );
}
