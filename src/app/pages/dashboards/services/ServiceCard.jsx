import { Pencil, Trash2, MoreHorizontal } from "lucide-react";
import { FaRupeeSign } from "react-icons/fa";

const ServiceCard = ({
  service,
  apiBaseUrl,
  onClick,
  onEdit,
  onDelete,
  onMoreOptionsClick,
}) => {
  const defaultImage = "https://via.placeholder.com/150";

  const getImageSrc = (url) => {
    if (!url) return defaultImage;
    if (url.startsWith("http")) return url;
    const cleanedUrl = url.replaceAll("\\", "/").replace(/^\/+/, "");
    return `${apiBaseUrl.replace(/\/$/, "")}/${cleanedUrl}`;
  };

  const imgSrc = getImageSrc(service.image);

  return (
    <div
      className="relative flex flex-col
                 bg-gradient-to-tr from-white to-indigo-50
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

      {/* Image */}
      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-indigo-400 mb-4 mx-auto">
        <img
          src={imgSrc}
          alt={service.name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 w-full items-center text-center">
        {/* Name */}
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 break-words line-clamp-2 mb-1">
          {service.name}
        </h2>

        {/* Description */}
        {service.description ? (
          <p className="text-xs sm:text-sm md:text-base text-gray-600 break-words line-clamp-3 mb-3">
            {service.description}
          </p>
        ) : (
          <div className="mb-3" />
        )}

        {/* Cost & Actions pushed to bottom */}
        <div className="mt-auto w-full">
          {/* Cost */}
          <div className="flex items-center justify-center gap-1 text-gray-800 font-semibold px-3 py-1 rounded-full text-sm sm:text-base w-full max-w-[140px] mx-auto mb-3">
            <FaRupeeSign className="text-green-600" />
            <span>{service.cost ?? 0}</span>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 w-full justify-center flex-wrap">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(service);
              }}
              className="flex-1 min-w-[30px] flex items-center justify-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
            >
              <Pencil className="h-4 w-4 sm:h-4 sm:w-4" /> Edit
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(service);
              }}
              className="flex-1 min-w-[30px] flex items-center justify-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
            >
              <Trash2 className="h-4 w-4 sm:h-4 sm:w-4" /> Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;
