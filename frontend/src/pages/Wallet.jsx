import React, { useEffect, useRef, useState } from 'react'
import { useUser } from '../context/UserContext';
import { FaSpinner } from 'react-icons/fa';
import { CURRENCY } from '../constants/ui';

function Wallet() {

    const { fetchWallet, wallet_loading } = useUser()

    const [wallet, setWallet] = useState({})
    const loadedOnce = useRef(false)
    
    
    useEffect(() => {
        const load = async() => {
            if (loadedOnce.current) return 
            loadedOnce.current = true
            const wallet = await fetchWallet()
            setWallet(wallet)
        }
        load()
    }, [])
  return (
    <div className="max-w-6xl mx-auto px-4 flex h-full gap-8">


        {/* RIGHT CONTENT */}
        {
            wallet_loading ? <div className='w-full flex flex-col justify-center items-center'>
                <FaSpinner />
                <h1 >Fetching wallet. Please wait...</h1>
            </div> : (<main className="flex-1">
          <h1 className="text-xl font-semibold mb-6">My Wallet</h1>
          <div className='flex h-full w-full justify-center'>
            <div className=' bg-gray-100 w-1/2 flex flex-col items-center h-1/2 p-8 gap-4 rounded-lg '>
            <p>CURRENT BALANCE: {wallet.balance}</p>
            <p className='text-small text-gray-500'>Conversion Rate: 1 Vento = {CURRENCY} 1</p>
          </div>
          </div>
        </main>)
        }
    </div>
  )
}

export default Wallet
