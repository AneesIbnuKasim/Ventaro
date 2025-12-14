// HOOK TO RESET FILTERS ON NAVIGATE
import { useNavigate } from "react-router-dom";
import { useProduct } from "../context/ProductContext";

export const useNavigateWithReset = () => {
  const navigate = useNavigate();
  const { resetAllFilters } = useProduct();

  return (path) => {
      if (!path.startsWith("/search")) {
    resetAllFilters();
  }
    navigate(path, { replace: true });
  };
};


























//more route
// const noResetRoutes = ["/search"];

// const navigateSmart = (path) => {
//   const shouldReset = !noResetRoutes.some((r) => path.startsWith(r));

//   if (shouldReset) resetAllFilters();

//   navigate(path);
// };