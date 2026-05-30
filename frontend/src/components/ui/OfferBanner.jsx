import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

import formatImageUrl from "../../utils/formatImageUrl";

const OfferBanner = ({
  title = "Mega Sale",
  subtitle = "Up to 50% OFF",
  description = "",
  buttonText = "Shop Now",
  onClick,
  image,
  className = "",
}) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.35 }}
      className={`group relative overflow-hidden rounded-lg border border-card-theme bg-slate-950 text-white shadow-md ${className}`}
    >
      {image && (
        <img
          src={formatImageUrl(image)}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/25 to-slate-950/10" />

      <div className="relative z-10 flex min-h-[280px] max-w-md flex-col justify-end p-6 md:p-8">
        <span className="mb-3 w-fit rounded-full bg-white/15 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em]">
          Limited Deal
        </span>
        <h2 className="text-2xl font-black leading-tight md:text-3xl">{title}</h2>
        {subtitle && <p className="mt-2 text-sm font-semibold text-white/90">{subtitle}</p>}
        {description && <p className="mt-2 text-sm text-white/75">{description}</p>}
        <button
          type="button"
          onClick={onClick}
          className="mt-5 inline-flex w-fit items-center gap-2 rounded-md bg-white px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-slate-100"
        >
          {buttonText}
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.article>
  );
};

export default OfferBanner;
