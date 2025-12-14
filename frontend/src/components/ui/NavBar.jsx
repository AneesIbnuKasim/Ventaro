import { useEffect, useState } from "react";
import {
  Search,
  User,
  Heart,
  ShoppingBag,
  Menu,
  X
} from "lucide-react";
import { FormInput } from ".";
import Footer from "./Footer";
import { useProduct } from "../../context/ProductContext";
import { useNavigate } from "react-router-dom";
import SearchInput from "./SearchInput";
import { useNavigateWithReset } from "../../hooks/useNavigateWithReset";


export default function Navbar({
  logo = "Logo",
  categories = ["mobiles", "laptops", "air conditioners", "tablets", 'mobile accessories'],
  showProfile = true,
  showWishlist = true,
  showBag = true,
}) {
  const navigate = useNavigate();
  const navigateWithReset = useNavigateWithReset();
  
  
  const [menuOpen, setMenuOpen] = useState(false);
  const { filters, setFilters, setGlobalCategory } = useProduct()
  const [ suggestion, setSuggestion ] = useState()
  const navigateToCategory = (cat) => {
    setGlobalCategory(cat)
    navigateWithReset(`/products/${cat}`)
  }

  return (
    <>
      <nav className="w-full bg-white shadow-lg sticky top-0 z-50">
        <div className="max-w-[1440px] mx-auto px-4 h-18 flex items-center justify-between gap-4">

          {/* LEFT: Mobile menu + Logo */}
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setMenuOpen(true)}>
              <Menu size={26} />
            </button>

            <div className="flex items-center gap-2 cursor-pointer">
              <div className="bg-blue-500 p-2 rounded-lg">
                {/* Default logo icon */}
                <svg width="20" height="20" fill="white" viewBox="0 0 24 24">
                  <path d="M12 2L2 7l10 5 10-5-10-5zm0 7.5L2 5l10 5 10-5-10 4.5z" />
                </svg>
              </div>

              <span className="font-semibold text-lg hidden sm:block">
                {logo}
              </span>
            </div>
          </div>

          {/* CENTER: categories + search */}
          <div className="flex-1 flex items-center gap-10 justify-center">

            {/* Categories (dynamic) */}
            <ul className="hidden lg:flex items-center gap-8 text-sm font-semibold">
              {categories.map((cat) => (
                <li
                  key={cat}
                  className="cursor-pointer hover:text-gray-700"
                  onClick={() => navigateToCategory(cat)}
                >
                  {cat.toUpperCase()}
                </li>
              ))}
            </ul>

            {/* Search input */}
            {/* <div className="hidden sm:block relative w-64">
              <input
                type="text"
                value={query}
                setSuggestion = {setSuggestion}
                placeholder="Search products..."
                className="w-full bg-[#F3F3F5] rounded-full py-2.5 pl-5 pr-12 text-sm outline-none border border-transparent focus:border-gray-300 transition"
              />

              <button className="absolute right-3 top-1/2 -translate-y-1/2"
              onClick={handleSearchNavigate}
              >
                <Search color="orange"
                  size={22}
                  className="text-white bg-[#6D3CF8] p-1 rounded-full"
                />
              </button>
            </div> */}

            <SearchInput />
          </div>

          {/* RIGHT: Icons */}
          <div className="flex items-center gap-5">
            {/* Search icon mobile */}
            <button className="sm:hidden">
              <Search size={22} />
            </button>

            {showProfile && <User size={22} className="cursor-pointer" />}
            {showWishlist && <Heart size={22} className="cursor-pointer" />}
            {showBag && <ShoppingBag size={22} className="cursor-pointer" />}
          </div>
        </div>
      </nav>

      {/* MOBILE SIDE MENU */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transition-transform duration-300 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-5 border-b">
          <span className="font-semibold text-lg">Menu</span>
          <button onClick={() => setMenuOpen(false)}>
            <X size={26} />
          </button>
        </div>

        <ul className="flex flex-col gap-6 p-6 text-base font-medium">
          {categories.map((cat) => (
            <li key={cat} className="cursor-pointer">
              {cat}
            </li>
          ))}
        </ul>
      </div>

      {/* BACKDROP */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 bg-black/30 z-40"
        />
      )}
    </>
  );
}