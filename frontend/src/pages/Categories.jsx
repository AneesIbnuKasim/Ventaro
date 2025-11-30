import React, { memo, useState } from 'react'
import AppLayout from '../components/AppLayout'
import { Button, FormInput, Modal, Pagination, StatCard, UserCard, UserTableRow } from '../components/ui'
import Table from '../components/ui/Table'
import { IoSearch } from "react-icons/io5";
import FormTextarea from '../components/ui/FormTextArea';
import { IoIosAddCircle } from "react-icons/io";



const Categories = memo(() => {

    const itemsPerPage = 10

    const [ isEdit, setIsEdit ] = useState(false)
    const [ isDelete, setIsDelete ] = useState(false)

    const handleEditCategory = () => {
        setIsEdit((prev)=>{
            return !prev
        })
    }

    const handleDeleteCategory = () => {
        const isConfirm = confirm('Confirm deletion')
        if (isConfirm) {
            //
        }
    }


    const categories = [
  {
    _id: "cat001",
    title: "Electronics",
    description: "Devices, gadgets, and accessories",
    status: "active",
    createdAt: "2025-01-15T10:23:00.000Z"
  },
  {
    _id: "cat002",
    title: "Clothing",
    description: "Men, women, and kids apparel",
    status: "active",
    createdAt: "2025-01-18T12:45:00.000Z"
  },
  {
    _id: "cat003",
    title: "Home & Kitchen",
    description: "Home appliances, furniture, and décor",
    status: "inactive",
    createdAt: "2025-01-20T08:15:00.000Z"
  }
];
    

const totalItems = 34
  return (
    <AppLayout 
    title= 'categories'
    >
        <div className='text-black m-5'>

            { isEdit && <Modal 
            isOpen={isEdit}
            title= 'Edit category'
            size='md'
            onClose = {()=>setIsOpen((prev)=>!prev)}
            >
                <div className='flex flex-col'>
                    <FormInput 
                    label= 'Category Name'
                    placeholder= 'Enter Category name'
                />
                <FormTextarea 
                    label= 'Description'
                    placeholder= 'Enter Description'
                />
                <Button 
                icon= {<IoIosAddCircle />}
                className= 'mt-4'
                >
                    ADD CATEGORY
                </Button>
                </div>
            </Modal> }

            

            <div className='flex justify-around items-center bg-white mb-5 rounded-lg' >
                <FormInput
                placeholder= 'Search'
                icon= {<IoSearch/>}
                />

                <Button
                size= 'lg'
                style= {{height: 30}}
                >
                    ADD CATEGORY
                </Button>
            </div>
            <Table
  columns={["title", "description", "createdAt"]}
  data={categories}
  actions={{
    onEdit: handleEditCategory,
    onDelete: handleDeleteCategory,
  }}
/>
{totalItems>itemsPerPage &&
<Pagination
totalItems={totalItems}
/>
}
        </div>
    </AppLayout>
  )
})

export default Categories
