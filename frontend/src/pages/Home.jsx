import React, { memo, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import ProductCard from "../components/ui/ProductCard";
import Slider from "../components/ui/Slider";
import BannerSlider from "../components/ui/BannerSlider";
import OfferBanner from "../components/ui/OfferBanner";

import { useProduct } from "../context/ProductContext";
import { useCategory } from "../context/CategoryContext";
import { useNavigateWithReset } from "../hooks/useNavigateWithReset";

import { fetchBannerThunk } from "../redux/slices/bannerSlice";
import { getBannerLink } from "../utils/bannerLink";
import { API_CONFIG } from "../config/app";
import HomeSkelton from "../components/ui/HomeSkelton";

const Home = memo(() => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateWithReset = useNavigateWithReset();

  const { fetchProduct, fetchSingleProduct, products, setGlobalCategory, fetchHomePageProducts, featuredProducts, clearanceProducts } =
    useProduct();
  const { categories, fetchCategories } = useCategory();

  const { banners } = useSelector((state) => state.banner);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    dispatch(fetchBannerThunk());
    fetchProduct();
    if (!categories.length) fetchCategories();
  }, []);

  /* ================= FILTER BANNERS ================= */
  const topBanners = banners.filter(
    (b) => b.position === "HOME_TOP" && b.status === "active"
  );

  const middleBanners = banners.filter(
    (b) => b.position === "HOME_MIDDLE" && b.status === "active"
  );

  const bottomBanners = banners.filter(
    (b) => b.position === "HOME_BOTTOM" && b.status === "active"
  );

  console.log('top banners', topBanners);
  console.log('banners', banners);
  

  const banner1 = middleBanners[0];
  const banner2 = middleBanners[1];

  /* ================= HANDLERS ================= */
  const navigateToCategory = (cat) => {
    setGlobalCategory(cat);
    navigateWithReset(`/products/${cat}`);
  };

  const handleProductClick = async (id) => {
    await fetchSingleProduct(id);
    navigate(`/product/${id}`);
  };

  // FEATURED PRODUCTS
  useEffect(() => {
    fetchHomePageProducts()
  }, [])

  if (products.length === 0 ) {
    return <HomeSkelton />
  }

  /* ================= UI ================= */
  return (
    <main className="min-h-screen ">

      {/* ================= HERO / TOP BANNER ================= */}
      {topBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <BannerSlider banners={topBanners} />
        </section>
      )}

      {/* ================= POPULAR CATEGORIES ================= */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-lg font-semibold mb-6">Popular Categories</h2>

        <div className="flex gap-8 overflow-x-auto">
          {categories.map((cat) => (
            <div
              key={cat._id}
              className="flex flex-col items-center min-w-22.5 cursor-pointer hover:scale-110 transition-all"
              onClick={() => navigateToCategory(cat.name)}
            >
              <div
                className="w-20 h-20 rounded-full bg-cover bg-center"
                style={{
                  backgroundImage: `url(${API_CONFIG.imageURL2}${cat.image[0]})`,
                }}
              />
              <span className="mt-2 text-sm">{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ================= BEST SELLERS ================= */}
      <section className="max-w-7xl mx-auto px-4 ">
        {products.length > 0 && (
          <Slider
            title="Best Sellers"
            items={products}
            renderItem={(item) => <ProductCard product={item} />}
            handleClick={handleProductClick}
          />
        )}
      </section>

      {/* ================= FEATURED PRODUCTS ================= */}
      <section className="max-w-7xl mx-auto px-4 py-4">
        {products.length > 0 && (
          <Slider
            title="Featured Products"
            items={featuredProducts.slice(0,9)}
            renderItem={(item) => <ProductCard product={item} />}
            handleClick={handleProductClick}
          />
        )}
      </section>

      {/* ================= MIDDLE PROMO / OFFER ================= */}
      {middleBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          {banner1 && (
            <OfferBanner
              title={banner1.title}
              subtitle={banner1.subtitle}
              buttonText="Shop Now"
              image={banner1.image}
              onClick={() => navigate(getBannerLink(banner1))}
            />
          )}

          {banner2 && (
            <OfferBanner
              title={banner2.title}
              subtitle={banner2.subtitle}
              buttonText="Shop Now"
              image={banner2.image}
              onClick={() => navigate(getBannerLink(banner2))}
            />
          )}
        </section>
      )}

      {/* ================= CLEARANCE SALE ================= */}
      <section className="max-w-7xl mx-auto px-4 pb-8">
        {products.length > 0 && (
          <Slider
            title="Clearance Sale"
            items={clearanceProducts}
            renderItem={(item) => <ProductCard product={item} />}
            handleClick={handleProductClick}
          />
        )}
      </section>

      {/* ================= BOTTOM BANNER ================= */}
      {bottomBanners.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-8">
          <BannerSlider banners={bottomBanners} />
        </section>
      )}

    </main>
  );
});

export default Home;