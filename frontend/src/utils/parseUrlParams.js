//PARSE URL PARAMS AND SET TO REDUCER STATE

function parseUrlParams(searchParams) {
  return {
    filters: {
      search: searchParams.get("search") || "",
      sortBy: searchParams.get("sortBy") || "createdAt",
      sortOrder: searchParams.get("sortOrder") || "asc",
      rating: searchParams.get("rating")
        ? searchParams.get("rating").split(",").map(Number)
        : [1],
      category: searchParams.get("category")
        ? searchParams.get("category").split(",")
        : [],
    },
    pagination: {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
    }
  };
}