/*ProductsPage.jsx*/

/* ProductsPage.jsx */

import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus } from "react-icons/fi";
import { MdOutlineElectricalServices } from "react-icons/md";

import ProductCard from "./ProductCard";
import Modal from "../components/Modal";
import AddProductForm from "./AddProductForm";
import EditProductForm from "./EditProductForm";
import ProductDeleteForm from "./ProductDeleteForm";

import { fetchProductsByCategory, fetchProductCategories } from "../../api/productApi.js";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [deleteProductData, setDeleteProductData] = useState(null);

  const navigate = useNavigate();
  const { categoryId } = useParams();

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("authToken");
      if (!token) return navigate("/login");

      const categories = await fetchProductCategories();
      const foundCategory = categories.find((c) => c._id === categoryId);
      setCategory(foundCategory || { name: "Products" });

      const productsData = await fetchProductsByCategory(categoryId);
      setProducts(productsData);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to fetch products");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [categoryId]);

  // Handlers
  const handleProductAdded = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setIsAddModalOpen(false);
  };

  const handleProductUpdated = (updatedProduct) => {
    setProducts((prev) =>
      prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
    );
    setEditProduct(null);
  };

  const handleProductDeleted = (deletedId) => {
    setProducts((prev) => prev.filter((p) => p._id !== deletedId));
    setDeleteProductData(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-gray-600">
        Loading...
      </div>
    );

  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-xl text-red-500">
        {error}
      </div>
    );

  return (
    <>
      <div className="container mx-auto px-4 sm:px-6 lg:px-10 bg-gray-50 min-h-screen font-sans">
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 flex items-center gap-2">
            <MdOutlineElectricalServices className="text-blue-600 h-8 w-8 sm:h-10 sm:w-10" />
            {category?.name || "Products"}
          </h1>

      

          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 sm:px-5 rounded-lg transition duration-300 w-full sm:w-auto justify-center"
          >
            <FiPlus size={18} />
            <span className="text-sm sm:text-base">Add Product</span>
          </button>
        </header>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {products.length > 0 ? (
            products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
                onEdit={() => setEditProduct(product)}
                onDelete={() => setDeleteProductData(product)}
              />
            ))
          ) : (
            <div className="col-span-full text-center text-gray-500 text-lg py-10">
              No products available for this category.
            </div>
          )}
        </div>
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)}>
        <AddProductForm
          categoryId={categoryId}
          categoryName={category?.name}
          onProductAdded={handleProductAdded}
          onClose={() => setIsAddModalOpen(false)}
        />
      </Modal>

      {/* Edit Product Modal */}
      {editProduct && (
        <Modal isOpen={!!editProduct} onClose={() => setEditProduct(null)}>
          <EditProductForm
            productData={editProduct}
            onProductUpdated={handleProductUpdated}
            onClose={() => setEditProduct(null)}
          />
        </Modal>
      )}

      {/* Delete Product Modal */}
      {deleteProductData && (
        <Modal isOpen={!!deleteProductData} onClose={() => setDeleteProductData(null)}>
          <ProductDeleteForm
            product={deleteProductData}
            onDeleted={handleProductDeleted}
            onCancel={() => setDeleteProductData(null)}
          />
        </Modal>
      )}
    </>
  );
};

export default ProductsPage;
