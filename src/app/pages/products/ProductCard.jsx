/* ProductCard.jsx */

import { useState, useEffect, useMemo } from "react";
import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

const ProductCard = ({
  product,
  onClick,
  onEdit,
  onDelete,
  onMoreOptionsClick,
  apiBaseUrl,
}) => {
  const defaultImage = "https://via.placeholder.com/150";

  const allImages = useMemo(
    () =>
      product.images && product.images.length > 0
        ? product.images
        : product.image
        ? [product.image]
        : [defaultImage],
    [product.images, product.image]
  );

  const [mainImage, setMainImage] = useState(allImages[0]);

  useEffect(() => {
    setMainImage(allImages[0]);
  }, [allImages]);

  return (
    <div
      className="relative flex flex-col items-center text-center
                 bg-gradient-to-tr from-white/95 to-blue-50/80
                 rounded-2xl border border-gray-200
                 p-4 sm:p-5
                 shadow-sm hover:shadow-md
                 transition-all duration-300 w-full h-full max-w-xs mx-auto
                 cursor-pointer"
      onClick={onClick}
    >
      {/* More Options */}
      {onMoreOptionsClick && (
        <button
          onClick={(e) => { e.stopPropagation(); onMoreOptionsClick(); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Main Image */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-25 md:h-25 lg:w-28 lg:h-28 rounded-full overflow-hidden border-2 border-blue-300 mb-3">
        <img
          src={mainImage.startsWith("http") ? mainImage : `${apiBaseUrl.replace(/\/$/, "")}${mainImage.replaceAll("\\", "/")}`}
          alt={product.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-1 justify-center overflow-x-auto mb-3 w-full px-1">
          {allImages.slice(0, 5).map((img, idx) => (
            <div
              key={idx}
              className={`flex-shrink-0 
                          w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 
                          rounded-full overflow-hidden border cursor-pointer 
                          transition-transform duration-200 hover:scale-110 hover:shadow-sm 
                          ${mainImage === img ? "border-2 border-blue-500" : "border border-gray-300"}`}
              onClick={(e) => { e.stopPropagation(); setMainImage(img); }}
            >
              <img
                src={img.startsWith("http") ? img : `${apiBaseUrl.replace(/\/$/, "")}${img.replaceAll("\\", "/")}`}
                alt={`${product.name}-${idx}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
          {allImages.length > 5 && (
            <div className="flex-shrink-0 w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 rounded-full border border-dashed border-gray-300 flex items-center justify-center bg-gray-50 text-gray-500 text-xs font-semibold">
              +{allImages.length - 5}
            </div>
          )}
        </div>
      )}

      {/* Product Name */}
      <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 truncate w-full">{product.name}</h2>

      {/* Description */}
      {product.description && (
        <p className="text-xs sm:text-sm md:text-base text-gray-600 truncate w-full mb-2">
          {product.description}
        </p>
      )}

      {/* Categories / Tags */}
      {product.categories && product.categories.length > 0 && (
        <div className="flex flex-wrap justify-center gap-1 mt-1 mb-3">
          {product.categories.map((cat, idx) => (
            <span
              key={idx}
              className="text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-2 py-1 rounded-full"
            >
              {cat}
            </span>
          ))}
        </div>
      )}

      {/* Spacer to push cost and buttons to bottom */}
      <div className="flex flex-col justify-end mt-auto w-full">
        {/* Cost */}
        <div className="flex items-center gap-1 text-gray-800 font-bold bg-green-100/50 px-3 py-1 rounded-full mb-3 w-max mx-auto">
          <FaRupeeSign className="text-green-600" />
          <span>{product.cost ?? 0}</span>
        </div>

        {/* Edit & Delete Buttons */}
       <div className="flex flex-wrap gap-2 w-full justify-center mt-auto">
  <button
    onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
    className="flex-1 min-w-[30px] flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
  >
    <Pencil className="h-4 w-4 sm:h-5 sm:w-5" /> Edit
  </button>
  <button
    onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
    className="flex-1 min-w-[30px] flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
  >
    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" /> Delete
  </button>
</div>
      </div>
    </div>
  );
};

export default ProductCard;
