import React, { memo, useEffect } from 'react'
import { Button, StatCard } from '../components/ui'
import { ShieldAlert, ShoppingCart } from 'lucide-react'
import ReportStatsCard from '../components/ui/ReportStatsCard'
import DateFilter from '../components/ui/DateFilter'
import { CURRENCY } from '../constants/ui'
import SalesChart from '../components/ui/SalesChart'
import Table from '../components/ui/Table'
import { fetchSalesReport, setFilters } from '../redux/slices/salesSlice'
import { useDispatch, useSelector } from 'react-redux'
import { selectDaily, selectTotalOrders, selectTotalSales } from '../redux/selector/dashboardSelector'
import { API_CONFIG } from '../config/app'

const  SalesReport = memo(() => {

  const { filters, salesByDate, topProducts, totalSales, totalOrders, recentOrders, totalUsers } = useSelector(state => state.sales)
  const period = filters.period
  const dispatch = useDispatch()
  // const totalSales = useSelector(selectTotalSales)
  // const totalOrders = useSelector(selectTotalOrders)

  useEffect(() => {
    console.log('startDate', filters.startDate)
  },[filters.startDate])

  // const lastDaily = Daily
  // console.log('last'), lastDaily;
  
  const query = {
    period: filters.period,
    startDate: filters.startDate,
    endDate: filters.endDate,
    period: filters.period
  }

  useEffect(() => {
    dispatch(fetchSalesReport(query))
  }, [filters.startDate, filters.endDate, filters.period])

  const handlePeriodSelect = (data) => {
    dispatch(setFilters(data))
  }
  const handleStartDate = (data) => {
    dispatch(setFilters(data))
  }
  const handleEndDate = (data) => {
    dispatch(setFilters(data))
  }
  return (
    <>
      {/* {open && (
        <Modal
          isOpen={open}
          size="xl"
          onClose={closeProductForm}
          className= 'overflow-y-auto'
          title={editData ? "Edit Product" : "Add Product"}
        >
          <ProductForm onConfirm={handleSubmit} editData={editData} onCancel={handleCancel} />
        </Modal>
      )} */}

      <div className="sm:flex justify-around items-center bg-white mb-5 rounded-lg">

        <DateFilter filters={filters} periodPicker={handlePeriodSelect} handleEndDate={handleEndDate} handleStartDate={handleStartDate}/>

        <Button
          size="sm"
          variant={'custom'}
          style={{ height: 30 }}
          // onClick={() => handleProductForm()}
          className={'m-4'}
        >
          DOWNLOAD REPORT
        </Button>
      </div>

      <div className=' flex flex-col gap-4'>

      

      <div className='flex gap-5'>
        
        
        <ReportStatsCard 
        title={'Total Sales'}
        icon= {<ShoppingCart className='w-13 h-13 text-violet-500' />}
        value={`${CURRENCY} ${Math.round(totalSales) || 0} `}
        change={+2}
        className='flex-1 bg-red-50'
        />
        <ReportStatsCard 
        title={'Total Orders'}
        icon= {<ShoppingCart className='w-13 h-13 text-violet-500' />}
        value={`${totalOrders || 0} `}
        change={+2}
        className='flex-1 bg-red-50'
        />
        <ReportStatsCard 
        title={'Total Users'}
        icon= {<ShoppingCart className='w-13 h-13 text-violet-500' />}
        value={`${totalUsers || 0} `}
        change={+2}
        className='flex-1 bg-red-50'
        />
        <ReportStatsCard 
        title={'Total Sales'}
        icon= {<ShoppingCart className='w-13 h-13 text-violet-500' />}
        value={`${CURRENCY} 300 `}
        change={+2}
        className='flex-1 bg-red-50'
        />
      </div>

      {salesByDate.length > 0 ? (
        <>
        <div className='flex flex-col gap-4'>
        <SalesChart data={salesByDate}
        className='flex-1'
        />
        <div className={`bg-white flex flex-1 flex-col min-h-25 rounded-lg p-4 gap-3 shadow `}>
        <div>
        <p className="text-sm text-gray-500">Top Selling Products</p>
           
        </div>
        <div className="flex gap-3 justify-between items-center">


      <h2 className="text-xs mt-1 w-50">Img</h2>
      <h2 className="text-xs mt-1 w-50 ">Product Name</h2>
      <h2 className="text-xs mt-1 w-50">Quantity Sold</h2>
      <h2 className="text-xs mt-1">Total revenue</h2>
      </div>
      {topProducts.map(prod => (
        <div className="flex gap-3 justify-between items-center">
         
           <img width={50} height={50} src={`${API_CONFIG.imageURL2}${prod?.product?.images[0]}`} alt='product image' />


      <h2 className="text-xs mt-1 w-50 ">{prod?.product?.name}</h2>
      <h2 className="text-xs mt-1 ">{prod.quantitySold}</h2>
      <h2 className="text-xs mt-1">{prod.revenue}</h2>
      </div>
      ))}
      <div className="flex items-end justify-end">
        <p className="caption">Last 7 days</p>
      </div>
    </div>
      </div>

              <Table
          columns={["order Id", 'user', "total Amount", "payment Method", "payment Status"]}
          data={recentOrders ?? []}

        />
        </>
      ) : (
        <div className='w-full  h-50 flex justify-center '>
         <h1 className='h2 mt-30'> No Sales on this period...</h1>
        </div>
      )}
      </div>


      {/* {filters.search && !products?.length ? (
        <SearchNotFound searchQuery={filters.search} />
      ) : (

      )} */}

    </>
  )
}) 

export default SalesReport
