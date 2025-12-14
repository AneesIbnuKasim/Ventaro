import { memo, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import ProductFilter from "../components/ui/ProductFilter";
import { Pagination } from "../components/ui";
import ProductCard from "../components/ui/ProductCard";
import { useProduct } from "../context/ProductContext";
import { useNavigate } from "react-router-dom";
import SearchNotFound from '../components/ui/SearchNotFound'
import SortFilter from '../components/ui/SortFilter'
import Loading from '../components/ui/Loading'
import { useSearchParams } from "react-router-dom";

//USER SEARCH PRODUCTS UI PAGE
const SearchPage = memo(() => {

  const [ searchParams ] = useSearchParams()
  const search = searchParams.get('search')

  const { filters, setFilters, pagination, setPagination, products, fetchProduct, fetchSearch, allCategories, debouncedSearch, resetAllFilters, loading } = useProduct();
  useEffect(() => {
    const load = async() => {
      await fetchSearch(search)
    }
    load()
  },[fetchSearch])
  
  const navigate = useNavigate()

  const handleClick = (id) => {
    navigate(`/product/${id}`)
  }

  const resetAll = () => {
    resetAllFilters()
  }

  return (
    <>
      <AppLayout>
        <div className="flex ml-0 m-2">
          {/* filters */}
          <div className="w-[20%]">
            <ProductFilter filters={filters} setFilters={setFilters} resetAll= {resetAll} allCategories={allCategories} />
          </div>

          {/* MAIN CONTENT AREA */}
          
            <div className="flex flex-col items-center w-full m-5">
            <div className=" w-full flex flex-col justify-between p-5">
              {/* card layout */}
             { products.length > 0 &&  <><h1 className='h3'>Showing Search result for '{filters.search || null}'</h1>
             <h1 className=''> Total '{pagination.totalProducts || null}' Products found..</h1>
             </>
             }
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-2">
              {products.length > 0 ? 
                (products.map((item) => <ProductCard handleClick={handleClick} product={item} />)):
                (
                  <div className='w-[80vw] flex justify-center items-center'>
                    <SearchNotFound searchQuery={filters.search} />
                  </div>
                )
                }
            </div>

            </div>
            

            {/* PAGINATION */}
            {
              pagination.totalPages > 1 && 
             ( <div className="mt-5 w-[70vw]">
              <Pagination className="mr-20" 
              totalPages = {pagination.totalPages}
              limit = {pagination.limit}
              page= {pagination.page}
              onPageChange= {setPagination}
              />
            </div>)
            }
          </div>
        </div>
      </AppLayout>
    </>
  );
});

export default SearchPage;
