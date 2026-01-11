import { motion } from "framer-motion";
import Button from "./Button";
import { API_CONFIG } from "../../config/app";

const OfferBanner = ({
  title = "Mega Sale",
  subtitle = "Up to 50% OFF",
  description = "",
  buttonText = "Shop Now",
  onClick,
  image,
  className='',
  bgGradient = "from-indigo-600 to-purple-600",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`rounded-2xl overflow-hidden bg-gradient-to-r ${bgGradient} text-white ${className}`}
    >
      <div className={`grid grid-cols-1 md:grid-cols-2 items-center`}>
        <div className="p-8 space-y-4 ">
          <h2 className="text-3xl font-bold">{title}</h2>
          <h3 className="text-xl font-semibold text-white/90">{subtitle}</h3>
          <p className="text-sm text-white/80 max-w-md">{description}</p>

          <Button
            onClick={onClick}
            className="bg-purple-500 text-slate-900 hover:bg-purple-700 mt-4"
          >
            {buttonText}
          </Button>
        </div>

        {image && (
          <div className="flex justify-end p-6">
            <img
              src={`${API_CONFIG.imageURL2}${image}`}
              alt={title}
              className="max-h-[260px] object-contain drop-shadow-xl"
            />
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default OfferBanner;