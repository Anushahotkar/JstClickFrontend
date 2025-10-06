import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline';

const Card = ({ user, role, imageUrl, onClick }) => {
  const defaultImage = "https://via.placeholder.com/150";

  return (
    <div
      className="
        relative
        bg-white/60
        hover:bg-white/80
        border border-gray-200 
        rounded-2xl 
        p-6 
        backdrop-blur-sm
        transition-all 
        duration-300 
        ease-in-out
        flex flex-col items-center text-center
        w-full
      "
      onClick={onClick}
    >
      {/* Image */}
      <div className="w-24 h-24 mb-4 rounded-full overflow-hidden border-4 border-white shadow">
        <img
          src={imageUrl || defaultImage}
          alt={user}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title + Description */}
      <h2 className="text-lg font-bold text-gray-800 mb-1">{user}</h2>
      {role && <p className="text-sm text-gray-500">{role}</p>}

      {/* More options */}
      <button className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200">
        <EllipsisHorizontalIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default Card;
