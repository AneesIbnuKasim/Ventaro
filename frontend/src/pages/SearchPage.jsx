import { memo, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import ProductFilter from "../components/ui/ProductFilter";
import { Pagination } from "../components/ui";
import ProductCard from "../components/ui/ProductCard";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import SearchNotFound from "../components/ui/SearchNotFound";
import SortFilter from "../components/ui/SortFilter";
import Loading from "../components/ui/Loading";
import { useSearchParams } from "react-router-dom";
import { LoaderPinwheel } from "lucide-react";

//USER SEARCH PRODUCTS UI PAGE
const SearchPage = memo(() => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const {
    filters,
    setFilters,
    pagination,
    setPagination,
    products,
    fetchProduct,
    fetchSearch,
    allCategories,
    debouncedSearch,
    resetAllFilters,
    loading,
  } = useProduct();
  useEffect(() => {
    const load = async () => {
      await fetchSearch(search);
    };
    load();
  }, [fetchSearch, search]);

  const navigate = useNavigate();

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  const resetAll = () => {
    setFilters({
      page: 1,
      rating: [],
      category: [],
      minPrice: "",
      maxPrice: "",
      sortBy: "createdAt",
      sortOrder: "asc",
    });
  };

  return (
    <>
      <AppLayout>
        <div className="flex ml-0 m-2">
          {/* filters */}
          <div className="w-[20%]">
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              resetAll={resetAll}
              allCategories={allCategories}
            />
          </div>

          {/* MAIN CONTENT AREA */}

          {
            loading && (
              <div className="flex flex-col items-center justify-center m-auto">
              <div className="flex justify-center w-screen">
                <Loading size="xl" fullScreen={true} text="Loading search result..." className="flex gap-5 items-center justify-center text-2xl"/>
              </div>
              </div>
            )
          }

          <div className="flex flex-col items-center w-full m-5">
            {/* CONTENT */}
            {!loading && (
              <div className="w-full flex flex-col justify-between p-5">
                {/* HEADERS */}
                {products.length > 0 && (
                  <>
                    <h1 className="h3">
                      Showing search results for{" "}
                      <span className="font-semibold">"{filters.search}"</span>
                    </h1>

                    <h2>Total {pagination.totalProducts} products found</h2>
                  </>
                )}

                {/* GRID / EMPTY STATE */}
                { !loading && products.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
                    {products.map((item) => (
                      <ProductCard
                        key={item._id}
                        product={item}
                        handleClick={handleClick}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="w-full flex justify-center items-center min-h-[50vh]">
                    <SearchNotFound searchQuery={filters.search} />
                  </div>
                )}
              </div>
            )}

            {/* PAGINATION */}
            {!loading && pagination.totalPages > 1 && (
              <div className="mt-5 w-[70vw]">
                <Pagination
                  className="mr-20"
                  totalPages={pagination.totalPages}
                  itemsPerPage={pagination.limit}
                  totalItems={pagination.totalProducts}
                  currentPage={pagination.page}
                  onPageChange={setPagination}
                />
              </div>
            )}
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default SearchPage;
