import React, { memo, useCallback, useEffect, useState } from 'react'
import AdminLayout from '../components/AdminLayout'
import { Button, FormInput, Modal, Pagination, StatCard, UserCard, UserTableRow } from '../components/ui'
import Table from '../components/ui/Table'
import { IoSearch } from "react-icons/io5";
import FormTextarea from '../components/ui/FormTextArea';
import ConfirmDialog from '../components/ui/ConfirmDialog';
import CategoryForm from '../components/ui/CategoryForm';
import { useOutletContext } from "react-router-dom";


//ADMIN PRODUCT PAGE

const Products = memo(() => {

    const itemsPerPage = 10

    const [open, setOpen] = useState(false)
    const [editData, setEditData] = useState(null)
    const [isDelete, setIsDelete] = useState(false)
    const [deleteData, setDeleteData] = useState(null)




    const handleDeleteCategory = useCallback((category) => {
        setIsDelete(true)
        setDeleteData(category)
    })

    const handleDeleteSubmit = useCallback(()=>{
        console.log('dele',deleteData);
        
        setIsDelete(false)
        //delete function from categoryContext
        
        setDeleteData(null)
    }, [])
    //open category form edit/add
    const handleCategoryForm = useCallback((category) => {
        if (category) setEditData(category)
        setOpen(true)
        //edit category from category context


        
    })

    const closeCategoryForm = useCallback(() => {
        setEditData(null)
        setOpen(false)
    })



    const categories = [
  {
    _id: "cat001",
    name: "Electronics",
    description: "Devices, gadgets, and accessories",
    status: "active",
    createdAt: "2025-01-15T10:23:00.000Z"
  },
  {
    _id: "cat002",
    name: "Clothing",
    description: "Men, women, and kids apparel",
    status: "active",
    createdAt: "2025-01-18T12:45:00.000Z"
  },
  {
    _id: "cat003",
    name: "Home & Kitchen",
    description: "Home appliances, furniture, and décor",
    status: "inactive",
    createdAt: "2025-01-20T08:15:00.000Z"
  }
];
    

const totalItems = 34
  return (
    <>

            { open && <Modal 
            isOpen={open}
            // title= {'Edit category'}
            size='md'
            onClose = {closeCategoryForm}
            title={editData ? 'Edit Category' : 'Add Category'}
            >
                <CategoryForm 
                initialData={editData}
                onClose={closeCategoryForm}
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
{totalItems>itemsPerPage &&
<Pagination
totalItems={totalItems}
/>
}
        </>
  )
})

export default Products
