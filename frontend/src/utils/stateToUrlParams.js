//SET URL PARAMS FROM REDUCER STATE

function stateToUrlParams(state) {
  const params = new URLSearchParams();

  const { filters, pagination } = state;

  if (filters.search) params.set("search", filters.search);
  if (filters.sortBy) params.set("sortBy", filters.sortBy);
  if (filters.sortOrder) params.set("sortOrder", filters.sortOrder);
  if (filters.rating?.length) params.set("rating", filters.rating.join(","));
  if (filters.category?.length)
    params.set("category", filters.category.join(","));

  params.set("page", pagination.page);
  params.set("limit", pagination.limit);

  return params.toString();
}