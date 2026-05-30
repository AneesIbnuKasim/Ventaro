import React from "react";
import FormSelect from "./FormSelect";
import { IoMdArrowRoundDown, IoMdArrowRoundUp } from "react-icons/io";

function SortFilter({ setFilters, filters }) {
  const sortValue = [
    {
      label: "Relevant",
      value: "createdAt",
    },
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Price",
      value: "sellingPrice",
    },
  ];

  const handleSortChange = (e) => {
    setFilters({ sortBy: e.target.value });
  };
  const handleSortOrder = () => {
    filters.sortOrder === 'asc' ? setFilters({sortOrder: 'desc'}) : setFilters({sortOrder: 'asc'})
  }
  return (
    <div className="mb-5 mt-4">
        <h4 className="mb-2 text-sm font-bold">Sort</h4>
      <div className="flex flex-row items-center gap-3">
      <FormSelect
        options={sortValue.map((s) => ({
          value: s.value,
          label: s.label,
        }))}
        placeholder= ''
        onChange={handleSortChange}
        value={filters.sortBy}
        className="ml-1 flex-1"
        id=""
      ></FormSelect>
      <button type="button" onClick={handleSortOrder} className="icon-button border border-card-theme">
        {filters.sortOrder === 'asc' ? (
            <IoMdArrowRoundUp className="size-6 text-gray-500"/>
        ):
        (
            <IoMdArrowRoundDown className="size-6 text-gray-500"/>
        )}
      </button>
    </div>
    </div>
  );
}

export default SortFilter;
