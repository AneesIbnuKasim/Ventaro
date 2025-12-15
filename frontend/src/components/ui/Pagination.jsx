import React from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  className= ''
}) => {
  const getVisiblePages = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pages.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return pages;
  };

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return (
    <div className={`flex items-center justify-center gap-20 w-full mt-5 border border-gray-200 shadow-sm p-4 rounded-2xl `}>
      <div className={`${className} flex flex-col items-center gap-3`}>
      <nav>
        <ul className="flex items-center gap-1">
          {/* Prev Button */}
          <li>
            <button
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === 1
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() => currentPage !== 1 && onPageChange({page: currentPage - 1})}
              disabled={currentPage === 1}
            >
              ← Previous
            </button>
          </li>

          {/* Page Numbers */}
          {getVisiblePages().map((page, index) => (
            <li key={index}>
              {page === "..." ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  className={`px-3 py-1 border rounded-md text-sm ${
                    page === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 hover:bg-gray-100"
                  }`}
                  onClick={() => setPagination('page',page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}

          {/* Next Button */}
          <li>
            <button
              className={`px-3 py-1 border rounded-md text-sm ${
                currentPage === totalPages
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-white hover:bg-gray-100 text-gray-700"
              }`}
              onClick={() =>
                {currentPage !== totalPages && onPageChange({page: currentPage + 1})
                console.log(currentPage+1);
                }
              }
              disabled={currentPage === totalPages}
            >
              Next →
            </button>
          </li>
        </ul>
      </nav>

      <div className="text-sm text-gray-600">
        Showing {startItem}-{endItem} of {totalItems} items
      </div>
      </div>
    </div>
  );
};

export default Pagination;