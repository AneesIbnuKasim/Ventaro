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
import Slider from "../components/ui/Slider";
import { useDispatch, useSelector } from "react-redux";
import BannerSlider from "../components/ui/BannerSlider";
import { fetchBannerThunk } from "../redux/slices/bannerSlice";

const Home = memo(() => {
  const { fetchProduct, fetchSingleProduct, products, setGlobalCategory } =
    useProduct();
  const { categories, fetchCategories } = useCategory();
  const navigateWithReset = useNavigateWithReset();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { banners } = useSelector((state) => state.banner);

  useEffect(() => {
    dispatch(fetchBannerThunk());
  }, []);

  const topBanners = banners.filter(
    (b) => b.position === "HOME_TOP" && b.status === 'active'
  );
  console.log('top banners', topBanners);
  

  const middleBanners = banners.filter(
    (b) => b.position === "HOME_MIDDLE" && b.status === 'active'
  );

  const bottomBanners = banners.filter(
    (b) => b.position === "HOME_BOTTOM" && b.status === 'active'
  );

  //NAVIGATE TO CORRESPONDING CATEGORY WHEN CLICKS
  const navigateToCategory = (cat) => {
    console.log("cat", cat);

    setGlobalCategory(cat);
    navigateWithReset(`/products/${cat}`);
  };

  const handleClick = async (productId) => {
    fetchSingleProduct(productId);
    navigate(`/product/${productId}`);
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

  console.log('banners in home', banners)

  return (
    <div>
      <main className="bg-slate-50">
        {/* HERO SECTION */}
        {/* <section className="max-w-7xl mx-auto px-4 py-8">
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
        </section> */}

        {topBanners.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <BannerSlider banners={topBanners} />
          </section>
        )}

        {/* POPULAR CATEGORIES */}
        <section className="max-w-7xl mx-auto px-4 py-7">
          <h2 className="text-lg font-semibold text-slate-900 mb-6">
            Popular Categories
          </h2>
          <div className="flex gap-8 overflow-x-auto ">
            {categories?.map((cat, index) => (
              <div
                key={index}
                className="flex flex-col items-center min-w-[90px]"
              >
                <div
                  className="w-20 h-20 rounded-full bg-center bg-cover"
                  style={{
                    backgroundImage: `url(${API_CONFIG.imageURL2}${cat.image[0]})`,
                  }}
                  onClick={() => navigateToCategory(cat.name)}
                ></div>
                <span className="mt-2 text-sm text-slate-700">{cat.name}</span>
              </div>
            ))}
          </div>
        </section>

        {/* BEST SELLER */}
        <section className="max-w-7xl mx-auto px-4 ">
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold">Best Seller</h2>
            <button className="text-sm text-indigo-600">View all</button>
          </div> */}

          <div className="flex gap-4">
            {products.length > 0 && (
              <Slider
                title="Best Sellers"
                items={products}
                renderItem={(item) => <ProductCard product={item} />}
                handleClick={handleClick}
              />
            )}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="max-w-7xl mx-auto px-4 py-10">
          {/* <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold"></h2>
            <button className="text-sm text-indigo-600">View all</button>
          </div> */}
          <div className="flex gap-4">
            {products.length > 0 && (
              <Slider
                title="Featured Products"
                items={products}
                renderItem={(item) => <ProductCard product={item} />}
                handleClick={handleClick}
              />
            )}
          </div>
        </section>

        {/* PROMO / HIGHLIGHT SECTION */}
        {middleBanners.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 py-8">
            <BannerSlider banners={middleBanners} />
          </section>
        )}

        {/* CLEARANCE SALE */}
        <section className="max-w-7xl mx-auto px-4 pb-10">
          {/* <h2 className="text-lg font-semibold mb-6">
            Clearance Sale · Up to 70% OFF
          </h2> */}

          <div className="flex gap-4">
            {products.length > 0 && (
              <Slider
                title="Clearance Sale"
                items={products}
                renderItem={(item) => <ProductCard product={item} />}
                handleClick={handleClick}
              />
            )}
          </div>
        </section>
      </main>
    </div>
  );
});

export default Home;
