import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function useUrlToState(
  setPagination,
  setFilters
) {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const params = Object.fromEntries(searchParams.entries());

    setFilters((prev) => ({
      ...prev,
      search: params.search || "",
      category: params.category?.split(",") || [],
      rating: params.rating?.split(",").map(Number) || [],
      minPrice: params.minPrice || "",
      maxPrice: params.maxPrice || "",
      sortBy: params.sortBy || "createdAt",
      sortOrder: params.sortOrder || "asc",
    }));

    setPagination((prev) => ({
    ...prev,
    page: parseInt(params.page) || 1,
  }));
  }, [searchParams, setFilters, setPagination]);
}
