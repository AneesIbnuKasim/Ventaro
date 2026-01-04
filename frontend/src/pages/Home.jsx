import React, { memo, useEffect } from "react";
import ProductCard from "../components/ui/ProductCard";
import { useProduct } from "../context/ProductContext";
import headphone from "../assets/headphone.jpg";
import headphone2 from "../assets/headphone-2.jpg";
import { Button } from "../components/ui";
import { API_CONFIG } from "../config/app";
import { useCategory } from "../context/CategoryContext";
import { useNavigateWithReset } from "../hooks/useNavigateWithReset";
import { useNavigate } from "react-router-dom";

const Home = memo(() => {
  const { fetchProduct, products, setGlobalCategory } = useProduct();
  const { categories, fetchCategories } = useCategory();
  const navigateWithReset = useNavigateWithReset()
  const navigate = useNavigate()

    //NAVIGATE TO CORRESPONDING CATEGORY WHEN CLICKS
  const navigateToCategory = (cat) => {
    console.log('catt', cat);
    
    setGlobalCategory(cat)
    navigateWithReset(`/products/${cat}`)
    ;
  };

  useEffect(() => {
    const load = async () => await fetchProduct();
    load();
  }, []);
  console.log("products", categories);
  useEffect(() => {
    if (!categories.length > 0) {
      fetchCategories();
    }
  }, []);
  return (
    <div>
      <main className="bg-slate-50">
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div
            className="flex items-center justify-center bg-cover rounded-2xl bg-center h-100"
            style={{ backgroundImage: `url(${headphone2})` }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white rounded-2xl overflow-hidden">
              <div className="p-8 flex flex-col justify-center">
                <h1 className="text-3xl font-semibold text-white">
                  Noise Cancelling
                </h1>
                <p className="text-lg text-white">Headphone</p>

                <ul className="mt-4 text-sm text-white space-y-1">
                  <li>• 40mm Driver Headphone</li>
                  <li>• Voice Assistant</li>
                  <li>• Low Latency Gaming Mode</li>
                </ul>

                <Button
                  variant={"custom"}
                  className="mt-6 w-fit text-slate-900 px-6 py-2 rounded-lg shadow hover:scale-[1.04] transition"
                >
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* POPULAR CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Popular Categories
          </h2>

          <div className="flex gap-6 overflow-x-auto pb-2">
            {/* Example category item */}
            {categories?.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[90px]"
              >
                <div
                  className="w-13 h-13 rounded-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${API_CONFIG.imageURL2}${cat.image[0]})`,
                  }}
                  onClick={() => navigateToCategory(cat.name)}
                >
                </div>
                <span className="mt-2 text-sm text-slate-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BEST SELLER */}
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Best Seller</h2>
            <button className="text-sm text-indigo-600">View all</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.length > 0 &&
              products.map((product) => <ProductCard product={product} />)}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Featured Products</h2>
            <button className="text-sm text-indigo-600">View all</button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.length > 0 &&
              products.map((product) => <ProductCard product={product} />)}
          </div>
        </section>

        {/* PROMO / HIGHLIGHT SECTION */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <div className="bg-indigo-600 text-white rounded-2xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
            <div className="p-8">
              <h3 className="text-xl font-semibold">Smart Watch Series</h3>
              <p className="mt-2 text-indigo-100 text-sm">
                Track fitness, heart rate and notifications seamlessly.
              </p>

              <button className="mt-6 bg-white text-indigo-600 px-5 py-2 rounded-lg">
                Shop Now
              </button>
            </div>

            <div className="flex items-center justify-center p-6">
              <img
                src="/images/smartwatch.png"
                alt="Smart Watch"
                className="max-h-[220px]"
              />
            </div>
          </div>
        </section>

        {/* CLEARANCE SALE */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          <h2 className="text-lg font-semibold mb-6">
            Clearance Sale · Up to 70% OFF
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {products.length > 0 &&
              products.map((product) => <ProductCard product={product} />)}
          </div>
        </section>
      </main>
    </div>
  );
});

export default Home;
