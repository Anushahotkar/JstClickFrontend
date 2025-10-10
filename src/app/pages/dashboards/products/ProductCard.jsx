/* ProductCard.jsx - Styled like ServiceCard.jsx */

import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { FaRupeeSign,FaBoxOpen } from "react-icons/fa";

const ProductCard = ({
  product,
  apiBaseUrl,
  onClick,
  onEdit,
  onDelete,
  onMoreOptionsClick,
}) => {
  // const defaultImage = "https://via.placeholder.com/150";

  const getImageSrc = (url) => {
     if (!url || url.trim() === "") return null; 
    if (url.startsWith("http")) return url;
    const cleanedUrl = url.replaceAll("\\", "/").replace(/^\/+/, "");
    return `${apiBaseUrl.replace(/\/$/, "")}/${cleanedUrl}`;
  };

  // Use first image or default
  const imgSrc = product.images && product.images.length > 0
    ? getImageSrc(product.images[0])
    : getImageSrc(product.image);

  // Default description if missing
  const description = product.description || `${product.name} details`;

  return (
    <div
      className="relative flex flex-col
                 bg-gradient-to-tr from-white to-blue-50
                 rounded-2xl border border-gray-200
                 p-4 sm:p-5 md:p-6
                 cursor-pointer
                 w-full max-w-xs mx-auto
                 transition-all duration-200
                 hover:shadow-lg"
      onClick={onClick}
    >
      {/* More options */}
      {onMoreOptionsClick && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMoreOptionsClick();
          }}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      )}

 {/* Image / Icon */}
   {/* Image / Icon */}
<div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden border-2 border-blue-400 mb-4 mx-auto flex items-center justify-center bg-gray-100">
  {imgSrc ? (
    <img
      src={imgSrc}
      alt={product.name}
      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
      onError={(e) => {
        // Hide broken image and show icon
        e.currentTarget.style.display = "none";
        e.currentTarget.parentNode.querySelector('.fallback-icon').style.display = "block";
      }}
    />
  ) : null}

  {/* Fallback Icon */}
  <FaBoxOpen className="fallback-icon text-4xl sm:text-5xl md:text-6xl text-blue-500" style={{ display: imgSrc ? "none" : "block" }} />
</div>



      {/* Content */}
      <div className="flex flex-col flex-1 w-full items-center text-center">
        {/* Name */}
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 break-words line-clamp-2 mb-1">
          {product.name}
        </h2>

        {/* Description */}
        <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words line-clamp-3 mb-3">
          {description}
        </p>

        {/* Cost & Actions pushed to bottom */}
        <div className="mt-auto w-full">
          {/* Cost */}
          <div className="flex items-center justify-center gap-1 text-gray-800 font-semibold px-3 py-1 rounded-full text-sm sm:text-base w-full max-w-[140px] mx-auto mb-3">
            <FaRupeeSign className="text-green-600" />
            <span>{product.cost ?? 0}</span>
          </div>

          {/* Buttons */}
        {/* Buttons */}
<div className="flex gap-3 w-full justify-center flex-wrap mt-auto mb-2">
  <button
    onClick={(e) => { e.stopPropagation(); onEdit?.(product); }}
    className="flex-1 min-w-[46px] flex items-center justify-center gap-2 
               px-2 sm:px-3 md:px-3 
               py-1.5 sm:py-2 md:py-2 
               text-xs sm:text-sm md:text-base 
               font-medium text-white bg-yellow-500 
               rounded-lg hover:bg-yellow-600 transition-colors"
  >
    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" /> Edit
  </button>

  <button
    onClick={(e) => { e.stopPropagation(); onDelete?.(product); }}
    className="flex-1 min-w-[46px] flex items-center justify-center gap-2 
               px-2 sm:px-3 md:px-3 
               py-1.5 sm:py-2 md:py-2 
               text-xs sm:text-sm md:text-base 
               font-medium text-white bg-red-500 
               rounded-lg hover:bg-red-600 transition-colors"
  >
    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" /> Delete
  </button>
</div>

        </div>
      </div>
    </div>
  );
};

export default ProductCard;
