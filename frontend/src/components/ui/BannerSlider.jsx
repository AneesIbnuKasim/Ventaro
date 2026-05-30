import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getBannerLink } from "../../utils/bannerLink";
import formatImageUrl from "../../utils/formatImageUrl";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const BannerSlider = ({ banners = [] }) => {
  const navigate = useNavigate();

  if (!banners.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop={banners.length > 1}
      className="group overflow-hidden rounded-lg border border-card-theme bg-slate-950 shadow-lg"
    >
      {banners.map((banner) => {
        const link = getBannerLink(banner);

        return (
          <SwiperSlide key={banner._id}>
            <button
              type="button"
              onClick={() => navigate(link)}
              className="relative block aspect-[16/7] min-h-[280px] w-full overflow-hidden text-left md:min-h-[420px]"
            >
              <img
                src={formatImageUrl(banner.image)}
                alt={banner.title || "Ventaro promotion"}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/35 to-transparent" />

              {(banner.title || banner.subtitle || banner.linkType === "product") && (
                <div className="relative z-10 flex h-full max-w-xl flex-col justify-center px-6 py-8 text-white md:px-12">
                  <span className="mb-3 w-fit rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.18em]">
                    Ventaro Picks
                  </span>
                  {banner.title && (
                    <h1 className="max-w-lg text-3xl font-black leading-tight md:text-5xl">
                      {banner.title}
                    </h1>
                  )}
                  {banner.subtitle && (
                    <p className="mt-3 max-w-md text-sm text-white/85 md:text-base">
                      {banner.subtitle}
                    </p>
                  )}
                  <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-slate-950 shadow-md transition hover:bg-slate-100">
                    Shop Now
                    <ArrowRight size={17} />
                  </span>
                </div>
              )}
            </button>
          </SwiperSlide>
        );
      })}
    </Swiper>
  );
};

export default BannerSlider;
