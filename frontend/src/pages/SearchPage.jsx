// import { memo } from "react";
// import { useNavigate, useSearchParams } from "react-router-dom";
// import { LoaderPinwheelIcon } from "lucide-react";

// import ProductFilter from "../components/ui/ProductFilter";
// import ProductCard from "../components/ui/ProductCard";
// import SearchNotFound from "../components/ui/SearchNotFound";
// import Loading from "../components/ui/Loading";

// import { useProduct } from "../context/ProductContext";
// import useInfiniteScroll from "../hooks/useInfiniteScroll";
// import useUrlToState from "../hooks/useUrlToState";
// import useStateToUrl from "../hooks/useStateToUrl";

// const SearchPage = memo(() => {
//   const [searchParams] = useSearchParams();
//   const search = searchParams.get("search");

//   const {
//     filters,
//     setFilters,
//     pagination,
//     setPagination,
//     products,
//     fetchSearch,
//     allCategories,
//     loading,
//     loadingMore,
//     setIsInfinite,
//   } = useProduct();

//   //Sync URL - State
//   useUrlToState(setFilters, setPagination);

//   //Sync State - URL
//   useStateToUrl(filters, pagination);

//   const navigate = useNavigate();

//   const handleClick = (id) => {
//     navigate(`/product/${id}`);
//   };

//   //Infinite loader
//   const loadMore = () => {
//     if (
//       loading ||
//       loadingMore ||
//       pagination.page >= pagination.totalPages
//     )
//       return;

//     setIsInfinite(true);
//     setPagination({ page: pagination.page + 1 });
//   };

//   const lastCardRef = useInfiniteScroll(loadMore, loadingMore);

//   const resetAll = () => {
//     setFilters({
//       search: "",
//       rating: [],
//       category: [],
//       minPrice: "",
//       maxPrice: "",
//       sortBy: "createdAt",
//       sortOrder: "asc",
//     });
//   };

//   return (
//     <div className="flex ml-0 m-2">
//       {/* FILTERS */}
//       <div className="w-[50%] md:w-[40%] lg:w-[25%]">
//         <ProductFilter
//           filters={filters}
//           setFilters={setFilters}
//           resetAll={resetAll}
//           allCategories={allCategories}
//         />
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="flex flex-col items-center w-full m-5">
//         {/* FULL PAGE LOADER */}
//         {loading && pagination.page === 1 && (
//           <Loading
//             fullScreen
//             size="xl"
//             text="Loading search results..."
//           />
//         )}

//         {!loading && (
//           <div className="w-full flex flex-col justify-between p-5">
//             {/* HEADERS */}
//             {products.length > 0 && (
//               <>
//                 <h1 className="h3">
//                   Showing search results for{" "}
//                   <span className="font-semibold">
//                     "{filters.search || search}"
//                   </span>
//                 </h1>
//                 <h2>Total {pagination.totalProducts} products found</h2>
//               </>
//             )}

//             {/* GRID / EMPTY STATE */}
//             {products.length > 0 ? (
//               <div className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-6 p-2">
//                 {products.map((item, index) => {
//                   const isLast = index === products.length - 1;

//                   return (
//                     <div
//                       key={item._id}
//                       ref={isLast ? lastCardRef : null}
//                       className="w-full max-w-75 justify-self-center"
//                     >
//                       <ProductCard
//                         product={item}
//                         handleClick={handleClick}
//                       />
//                     </div>
//                   );
//                 })}
//               </div>
//             ) : (
//               <div className="w-full flex justify-center items-center min-h-[50vh]">
//                 <SearchNotFound searchQuery={filters.search || search} />
//               </div>
//             )}

//             {/* BOTTOM LOADER */}
//             {loadingMore && (
//               <div className="col-span-full flex justify-center py-6">
//                 <LoaderPinwheelIcon className="animate-spin text-muted" />
//               </div>
//             )}

//             {/* END OF LIST */}
//             {!loadingMore &&
//               pagination.page >= pagination.totalPages &&
//               products.length > 0 && (
//                 <div className="text-center py-6 text-muted-foreground">
//                   No more products.
//                 </div>
//               )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// });

// export default SearchPage;




import { memo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { LoaderPinwheelIcon } from "lucide-react";

import ProductFilter from "../components/ui/ProductFilter";
import ProductCard from "../components/ui/ProductCard";
import SearchNotFound from "../components/ui/SearchNotFound";
import Loading from "../components/ui/Loading";

import { useProduct } from "../context/ProductContext";
import useInfiniteScroll from "../hooks/useInfiniteScroll";
import useUrlToState from "../hooks/useUrlToState";
import useStateToUrl from "../hooks/useStateToUrl";

const SearchPage = memo(() => {
  const [searchParams] = useSearchParams();
  const search = searchParams.get("search");

  const {
    filters,
    setFilters,
    pagination,
    setPagination,
    products,
    allCategories,
    loading,
    loadingMore,
    setIsInfinite,
  } = useProduct();

  const navigate = useNavigate();
  const [showFilters, setShowFilters] = useState(false);

  // Sync URL <-> State
  useUrlToState(setFilters, setPagination);
  useStateToUrl(filters, pagination);

  const handleClick = (id) => {
    navigate(`/product/${id}`);
  };

  // Infinite scroll
  const loadMore = () => {
    if (
      loading ||
      loadingMore ||
      pagination.page >= pagination.totalPages
    )
      return;

    setIsInfinite(true);
    setPagination({ page: pagination.page + 1 });
  };

  const lastCardRef = useInfiniteScroll(loadMore, loadingMore);

  const resetAll = () => {
    setFilters({
      search: "",
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
      {/* MOBILE HEADER */}
      <div className="md:hidden flex justify-between items-center p-3">
        <h1 className="text-lg font-semibold">
          Search Results
        </h1>
        <button
          onClick={() => setShowFilters(true)}
          className="px-4 py-2 text-sm bg-purple-600 text-white rounded"
        >
          Filters
        </button>
      </div>

      <div className="flex gap-4 m-2">
        {/* DESKTOP FILTERS */}
        <div className="hidden md:block md:w-[25%]">
          <aside className="w-full p-5 bg-card shadow-md">
            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              resetAll={resetAll}
              allCategories={allCategories}
            />
          </aside>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full flex flex-col p-3 md:p-5">
          {/* FULL PAGE LOADER */}
          {loading && pagination.page === 1 ? (
            <Loading
              fullScreen
              size="xl"
              text="Loading search results..."
            />
          ) : (
            <>
              {/* HEADER */}
              {products.length > 0 && (
                <div className="hidden md:block mb-4">
                  <h1 className="text-xl font-semibold">
                    Showing results for{" "}
                    <span className="font-bold">
                      "{filters.search || search}"
                    </span>
                  </h1>
                  <p className="text-muted-foreground">
                    Total {pagination.totalProducts} products found
                  </p>
                </div>
              )}

              {/* GRID / EMPTY STATE */}
              {products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products.map((item, index) => {
                    const isLast = index === products.length - 1;

                    return (
                      <div
                        key={item._id}
                        ref={isLast ? lastCardRef : null}
                      >
                        <ProductCard
                          product={item}
                          handleClick={handleClick}
                        />
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="flex justify-center items-center min-h-[50vh]">
                  <SearchNotFound
                    searchQuery={filters.search || search}
                  />
                </div>
              )}

              {/* BOTTOM LOADER */}
              {loadingMore && (
                <div className="flex justify-center py-6">
                  <LoaderPinwheelIcon className="animate-spin text-muted" />
                </div>
              )}

              {/* END MESSAGE */}
              {!loadingMore &&
                pagination.page >= pagination.totalPages &&
                products.length > 0 && (
                  <div className="text-center py-6 text-muted-foreground">
                    No more products.
                  </div>
                )}
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      {showFilters && (
        <div className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="absolute right-0 top-0 h-full w-[65%] bg-card p-5 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-lg">FILTERS</h3>
              <button
                onClick={() => setShowFilters(false)}
                className="text-sm text-red-500"
              >
                Close
              </button>
            </div>

            <ProductFilter
              filters={filters}
              setFilters={setFilters}
              resetAll={resetAll}
              allCategories={allCategories}
            />
          </div>
        </div>
      )}
    </>
  );
});

export default SearchPage;