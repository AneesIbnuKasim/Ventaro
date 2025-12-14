import React, { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search } from 'lucide-react'
import { useProduct } from '../../context/ProductContext'
import useDebounce from '../../hooks/useDebounce'
import { useNavigateWithReset } from '../../hooks/useNavigateWithReset'

function SearchInput() {
  const { searchSuggestion, setFilters } = useProduct()
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestion, setShowSuggestion] = useState(false)
  const [query, setQuery] = useState('')
  const wrapperRef = useRef(null)
  const navigate = useNavigate()
  const navigateWithReset = useNavigateWithReset();

  

  const debouncedQuery = useDebounce(query, 500)

  // Fetch suggestions
  useEffect(() => {
    const getSuggestions = async () => {
      if (!debouncedQuery) {
        setShowSuggestion(false)
        return
      }

      const res = await searchSuggestion(debouncedQuery)
      
      if (res.length > 0) {
        setSuggestions(res)
        setShowSuggestion(true)
      } else {
        setShowSuggestion(false)
      }
    }

    getSuggestions()
  }, [debouncedQuery, searchSuggestion])

  // Outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestion(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  //Search submit
  const handleSearch = () => {
    if (!query) return

    setFilters({ search: query })
    setShowSuggestion(false)
    navigateWithReset(`/search?search=${query}`)
    setQuery('')
  }

  return (
    <div ref={wrapperRef} className="relative">
      <div className="hidden sm:block relative w-64">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Search products..."
          className="w-full bg-[#F3F3F5] rounded-full py-2.5 pl-5 pr-12 text-sm outline-none border border-transparent focus:border-gray-300"
        />

        <button
          className="absolute right-3 top-1/2 -translate-y-1/2"
          onClick={handleSearch}
        >
          <Search
            size={22}
            className="text-white bg-[#6D3CF8] p-1 rounded-full"
          />
        </button>
      </div>

      {showSuggestion && (
        <ul className="absolute bg-gray-200 w-full mt-1 max-h-60 rounded-b-xl overflow-auto z-50">
          {suggestions.map((item) => (
            <li
              key={item._id}
              className="p-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => {
                setFilters({ search: item.name })
                navigateWithReset(`/search?search=${encodeURIComponent(item.name)}`)
                setQuery('')
                setShowSuggestion(false)
              }}
            >
              {item.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchInput