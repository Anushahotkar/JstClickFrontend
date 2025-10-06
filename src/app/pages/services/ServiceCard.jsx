/*ServiceCard.jsx*/



import { EllipsisHorizontalIcon, PencilIcon, TrashIcon } from "@heroicons/react/24/outline";  
import { FaRupeeSign } from "react-icons/fa";

const ServiceCard = ({ service, onClick, apiBaseUrl, onEdit, onDelete }) => {
  const defaultImage = "https://via.placeholder.com/150";
  const imgSrc = service.image
    ? service.image.startsWith("http")
      ? service.image
      : `${apiBaseUrl.replace(/\/$/, "")}${service.image.replaceAll("\\", "/")}`
    : defaultImage;

  return (
    <div
      className="relative bg-white border border-indigo-200 rounded-2xl p-3 sm:p-5 flex flex-col h-full hover:shadow-lg cursor-pointer"
      onClick={onClick}
    >
      <button
        className="absolute top-2 right-2 p-1.5 rounded-full bg-indigo-100 text-indigo-600 hover:bg-indigo-200 transition-colors"
        onClick={(e) => e.stopPropagation()}
      >
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>

      <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 rounded-full overflow-hidden border-2 border-indigo-300">
        <img src={imgSrc} alt={service.name} className="w-full h-full object-cover" />
      </div>

      <h2 className="text-sm sm:text-base md:text-lg font-semibold text-gray-800 mb-1 text-center truncate">
        {service.name}
      </h2>

      {service.description && (
        <p className="text-xs sm:text-sm text-gray-600 mb-2 sm:mb-3 text-center line-clamp-2">
          {service.description}
        </p>
      )}

      <div className="mt-auto w-full flex flex-col items-center gap-2 sm:gap-3">
        <div className="flex items-center justify-center gap-1 text-gray-800 font-semibold bg-green-100/70 px-3 py-1 rounded-full text-sm sm:text-base w-full max-w-[140px]">
          <FaRupeeSign className="text-green-600" />
          <span>{service.cost ?? 0}</span>
        </div>

        <div className="flex flex-col sm:flex-row w-full gap-2 mt-1">
<button
  onClick={(e) => { e.stopPropagation(); onEdit?.(service); }}
  className="flex-1 flex items-center justify-center gap-1 px-1 py-2 text-xs sm:text-sm font-medium text-white bg-yellow-500 rounded-lg hover:bg-yellow-600 transition-colors"
>
  <PencilIcon className="h-4 w-4" />
  Edit
</button>

<button
  onClick={(e) => { e.stopPropagation(); onDelete?.(service); }}
  className="flex-1 flex items-center justify-center gap-1 px-1 py-2 text-xs sm:text-sm font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
>
  <TrashIcon className="h-4 w-4" />
  Delete
</button>


        </div>
      </div>
    </div>
  );
};


export default ServiceCard;
