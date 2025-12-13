import React from "react";
import FormSelect from "./FormSelect";

function SortFilter({ setFilters, filters }) {
  const sortValue = [
    {
      label: "Name",
      value: "name",
    },
    {
      label: "Price",
      value: "price",
    },
    {
      label: "Relevant",
      value: "",
    },
  ];

  const handleSortChange = (e) => {
    console.log("sort:", e.target.value);

    setFilters({ sortBy: e.target.value });
  };
  return (
    <div className="flex ">
      <FormSelect
        options={sortValue.map((s) => ({
          value: s.value,
          label: s.label,
        }))}
        placeholder= 'Select'
        onChange={handleSortChange}
        value={filters.sortBy}
        className="ml-1"
        id=""
      ></FormSelect>
    </div>
  );
}

export default SortFilter;
