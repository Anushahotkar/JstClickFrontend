/* ProductCardGrid.jsx */
import React, { useState } from "react";
import ProductCard from "./ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ProductCardGrid = ({ data, apiBaseUrl, cardsPerPageOptions = [4, 8, 12] }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(cardsPerPageOptions[0]);

  const totalPages = Math.ceil(data.length / cardsPerPage);
  const currentCards = data.slice(
    currentPage * cardsPerPage,
    (currentPage + 1) * cardsPerPage
  );

  const handlePrevPage = () => setCurrentPage((p) => Math.max(p - 1, 0));
  const handleNextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages - 1));

  return (
    <div className="flex flex-col gap-6">
      {/* Grid for products */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {currentCards.map((product) => (
          <div
            key={product.id || product._id}
            className="flex"
          >
            <ProductCard
              product={product}
              apiBaseUrl={apiBaseUrl}
              onClick={product.onClick}
              onEdit={product.onEdit}
              onDelete={product.onDelete}
              onMoreOptionsClick={product.onMoreOptionsClick}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 0}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-gray-700 font-medium">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages - 1}
            className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Cards per page selector */}
      <div className="flex justify-center mt-2 gap-2">
        {cardsPerPageOptions.map((option) => (
          <button
            key={option}
            onClick={() => { setCardsPerPage(option); setCurrentPage(0); }}
            className={`px-3 py-1 rounded-full font-medium transition-colors ${
              cardsPerPage === option
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {option} per page
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductCardGrid;
