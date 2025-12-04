import React, { memo, useCallback, useEffect, useState } from 'react'
import { Button, FormInput, Modal, Pagination, StatCard, UserCard, UserTableRow } from '../components/ui'
import Table from '../components/ui/Table'
import { IoSearch } from "react-icons/io5";
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CategoryForm from '../components/ui/CategoryForm';
import { useProduct } from '../context/ProductContext';
import SearchNotFound from '../components/ui/SearchNotFound';

const Products = memo(() => {

    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [isDelete, setIsDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(null)
    const { products, pagination, filters, setFilters, setPagination, addProduct, updateProduct, deleteProduct } = useProduct()
    
    const handleDeleteProduct = useCallback((product) => {
        setIsDelete(true)
        setDeleteData(product)
    })

    const handleDeleteSubmit = useCallback(()=>{
        setIsDelete(false)
        
        deleteProduct(deleteData._id)
        
        setDeleteData(null)
    }, [deleteData])

    //open product form edit/add
    const handleProductForm = useCallback((product) => {
        if (product) setEditData(product)
        setOpen(true)
    })

    const closeProductForm = useCallback(() => {
        updateProduct
        setEditData(null)
        setOpen((prev)=> !prev)
    })

      const handleSubmit = async (values) => {
        
        if (editData?._id) {
          const res = await updateProduct(editData._id, values);

          if (res.success) {
            setEditData(null)
            setOpen(false)
          }
        } else {
          const res = await addProduct(values)
          
          if (res.success) {
            setOpen(false)
          }
        }
      }

      console.log('filter search', filters.search);
      console.log('cats count', products?.length);
      


const totalItems = pagination?.totalProduct || 30
const totalPages = pagination?.totalPages

  return (
    <>

              { open && <Modal 
            isOpen={open}
            size='md'
            onClose = {closeProductForm}
            title={editData ? 'Edit Product' : 'Add Product'}
            >
                <CategoryForm 
                initialData={editData}
                // onClose={closeProductForm}
                handleSubmit= {handleSubmit}
                />
            </Modal> }

            {/* Delete confirmation modal */}
            {isDelete &&
            <ConfirmDialog
            isOpen= {isDelete}
            title= 'Are you sure to delete'
            onCancel={handleDeleteProduct}
            onConfirm= {handleDeleteSubmit}
            />
            }
            

            <div className='sm:flex justify-around items-center bg-white mb-5 rounded-lg' >
                <FormInput
                placeholder= 'Search'
                icon= {<IoSearch/>}
                value= {filters.search || ''}
                onChange={(e)=>setFilters({search: e.target.value})}
                />

                <Button
                size= 'md'
                style= {{height: 30}}
                onClick= {()=>handleProductForm()}
                >
                    ADD PRODUCT
                </Button>
            </div>

            {filters.search && !products?.length ? 
              (
                <SearchNotFound 
                searchQuery= {filters.search}
                />
              ) :
            (<Table
  columns={["image","name", "description", "price",'visible']}
  data={products}
  actions={{
    onEdit: handleProductForm,
    onDelete: handleDeleteProduct,
  }}
/>)}

{totalPages>1 &&
<Pagination
setPagination={setPagination}
currentPage={pagination.currentPage}
totalPages={pagination.totalPages}
totalItems={totalItems}
/>
}
            
        </>
  )
})

export default Products


