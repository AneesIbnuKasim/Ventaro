import React from "react";

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
  return (
    <div className="w-[420px] bg-white border rounded-xl p-6 shadow-sm">
      {/* NAME */}
      <h3 className="font-semibold text-gray-900 mb-2">{name}</h3>

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
  );
}
