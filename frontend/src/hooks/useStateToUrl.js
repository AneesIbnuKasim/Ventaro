import { useSearchParams } from "react-router-dom";
import { useEffect } from "react";

export default function useStateToUrl(filters, pagination) {
  const [, setSearchParams] = useSearchParams();

  useEffect(() => {
    const params = {};

    if (filters.search) params.search = filters.search;
    if (filters.category.length) params.category = filters.category.join(",");
    if (filters.rating.length) params.rating = filters.rating.join(",");
    if (filters.minPrice) params.minPrice = filters.minPrice;
    if (filters.maxPrice) params.maxPrice = filters.maxPrice;
    if (filters.sortBy !== "createdAt") params.sortBy = filters.sortBy;
    if (filters.sortOrder !== "asc") params.sortOrder = filters.sortOrder;
    if (pagination.page !== 1) params.page = pagination.page;

    setSearchParams(params, { replace: true });
  }, [filters, setSearchParams]);
};