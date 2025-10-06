import { Pencil, Trash2, MoreHorizontal } from "lucide-react";

const ServiceCategoryCard = ({
  user,
  description,
  skills,
  imageUrl,
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
    return `${import.meta.env.VITE_API_BASE_URL || ""}/${cleanedUrl}`;
  };

  const mainImage = getImageSrc(imageUrl);

  return (
    <div
      className="relative flex flex-col h-full bg-gradient-to-tr from-white to-blue-50
                 rounded-2xl border border-gray-200 p-4 sm:p-5 md:p-6
                 shadow-md hover:shadow-lg transition-all duration-300
                 w-full max-w-xs mx-auto cursor-pointer"
      onClick={onClick}
    >
      {/* More options */}
      {onMoreOptionsClick && (
        <button
          onClick={(e) => { e.stopPropagation(); onMoreOptionsClick(); }}
          className="absolute top-2 right-2 p-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <MoreHorizontal className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Main content wrapper grows to fill height */}
      <div className="flex flex-col flex-1 items-center w-full">
        {/* Main Image */}
        <div className="w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-blue-400 mb-4">
          <img
            src={mainImage}
            alt={user}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>

        {/* User */}
        <h2 className="text-sm sm:text-base md:text-lg font-bold text-gray-800 w-full mb-1 break-words text-center">
          {user}
        </h2>

        {/* description */}
        {description && (
          <p className="text-xs sm:text-sm md:text-base text-gray-600 w-full mb-3 break-words text-center">
            {description}
          </p>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <div className="flex flex-wrap justify-center gap-2 mt-2 mb-4">
            {skills.map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] sm:text-xs md:text-sm bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-700 px-2 py-1 rounded-full shadow-sm"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Buttons at bottom */}
      <div className="flex gap-3 w-full justify-center flex-wrap mt-auto mb-2">
        <button
          onClick={(e) => { e.stopPropagation(); onEdit?.(); }}
          className="flex-1 min-w-[65px] flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
        >
          <Pencil className="h-4 w-4 sm:h-5 sm:w-5" /> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete?.(); }}
          className="flex-1 min-w-[65px] flex items-center justify-center gap-2 px-3 py-2 text-xs sm:text-sm md:text-base font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
        >
          <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" /> Delete
        </button>
      </div>
    </div>
  );
};

export default ServiceCategoryCard;
