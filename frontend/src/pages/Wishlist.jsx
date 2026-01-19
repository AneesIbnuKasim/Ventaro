import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ui/ProductCard";
import { fetchWishlistThunk } from "../redux/slices/wishlistSlice";
import { HeartOff } from "lucide-react";
import { Button } from "../components/ui";
import ProductsGridSkeleton from "../components/ui/ProductGridSkeleton";

const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items: wishlist, loading } = useSelector(
    (state) => state.wishlist
  )

  useEffect(() => {
    dispatch(fetchWishlistThunk())
  }, [dispatch])

const handleClick = (id) => {
     navigate(`/product/${id}`)
}

  if (loading) {
    return (
      <div className="py-10 px-4">
        <ProductsGridSkeleton length={6} />
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <HeartOff className="w-12 h-12 text-slate-400 mb-4" />
        <h2 className="text-lg font-semibold text-slate-700">
          Your wishlist is empty
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Save items you like and review them later
        </p>
        <Button
          onClick={() => navigate("/")}
          variant={'custom'}
          className='mt-5'
        >
          Browse Home
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold mb-6">
        My Wishlist ({wishlist.length})
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} handleClick={handleClick} buttons={true} buttonText={['MOVE TO CART', 'REMOVE']} wishlistPage={true} />
        ))}
      </div>
    </div>
  );
};

export default Wishlist;