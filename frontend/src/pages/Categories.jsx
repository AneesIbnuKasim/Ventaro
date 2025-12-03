import React, { memo, useCallback, useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Button, FormInput, Modal, Pagination, StatCard, UserCard, UserTableRow } from '../components/ui'
import Table from '../components/ui/Table'
import { IoSearch } from "react-icons/io5";
import FormTextarea from '../components/ui/FormTextArea';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CategoryForm from '../components/ui/CategoryForm';
import { useOutletContext } from "react-router-dom";
import { useCategory } from '../context/CategoryContext';


const Categories = memo(() => {

  

    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [isDelete, setIsDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(null)
    const { categories, pagination, setFilters, setPagination, fetchCategories, addCategory, updateCategory } = useCategory()

    useEffect(()=>{
      console.log('cats', categories)
      
    },[categories])
    
    const handleDeleteCategory = useCallback((category) => {
        setIsDelete(true)
        setDeleteData(category)
    })

    const handleDeleteSubmit = useCallback(()=>{
        
        setIsDelete(false)
        
        deleteCategory(deleteData)
        
        setDeleteData(null)
    }, [])
    //open category form edit/add
    const handleCategoryForm = useCallback((category) => {
        if (category) setEditData(category)
        setOpen(true)
    })

    const closeCategoryForm = useCallback(() => {
        updateCategory
        setEditData(null)
        setOpen(false)
    })

      const handleSubmit = async (values) => {
        
        if (editData?._id) {
          const res = await updateCategory(editData._id, values);

          if (res.success) {
            editData(null)
            setOpen(false)
          }
        } else {
          const res = await addCategory(values)
          
          if (res.success) {
            setOpen(false)
          }
        }
      }


const totalItems = pagination?.totalCategories || 30
const totalPages = pagination?.totalPages
console.log('totL Pge', totalPages);

  return (
    <>

            { open && <Modal 
            isOpen={open}
            size='md'
            onClose = {closeCategoryForm}
            title={editData ? 'Edit Category' : 'Add Category'}
            >
                <CategoryForm 
                initialData={editData}
                // onClose={closeCategoryForm}
                handleSubmit= {handleSubmit}
                />
            </Modal> }

            {/* Delete confirmation modal */}
            {isDelete &&
            <ConfirmDialog
            isOpen= {isDelete}
            title= 'Are you sure to delete'
            onCancel={handleDeleteCategory}
            onConfirm= {handleDeleteSubmit}
            />
            }
            

            <div className='sm:flex justify-around items-center bg-white mb-5 rounded-lg' >
                <FormInput
                placeholder= 'Search'
                icon= {<IoSearch/>}
                />

                <Button
                size= 'lg'
                style= {{height: 30}}
                onClick= {()=>handleCategoryForm()}
                >
                    ADD CATEGORY
                </Button>
            </div>
            <Table
  columns={["name", "description", "createdAt"]}
  data={categories}
  actions={{
    onEdit: handleCategoryForm,
    onDelete: handleDeleteCategory,
  }}
/>
{totalPages>1 &&
<Pagination
currentPage={pagination.currentPage}
totalPages={pagination.totalPages}
totalItems={totalItems}
/>
}
        </>
  )
})

export default Categories
