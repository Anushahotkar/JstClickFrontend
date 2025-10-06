import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WrenchScrewdriverIcon, CubeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

import Modal from "../components/Modal";
import AddServiceForm from "../category/AddServiceForm";
import AddProductForm from "../category/AddProductForm";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ProductCategoryCard from "../components/ProductCategoryCard";
import EditServiceCategoryForm from "../category/EditServiceCategoryForm";
import EditProductCategoryForm from "../category/EditProductCategoryForm";
import ServiceCategoryDeleteForm from "../category/ServiceCategoryDeleteForm";
import ProductCategoryDeleteForm from "../category/ProductCategoryDeleteForm";
import Spinner from "../components/Spinner";

import { fetchCategoriesApi } from "../../api/categoryApi";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "services";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);

  const navigate = useNavigate();

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    try {
      const data = await fetchCategoriesApi(activeTab);
      setCategories(data);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  // Refresh categories after any add/edit/delete
  const refreshCategories = async () => {
    await fetchCategories();
  };

  useEffect(() => {
    setSearchParams({ tab: activeTab });
    fetchCategories();
  }, [activeTab, setSearchParams, fetchCategories]);

  const handleEdit = (category) => {
    setEditCategory(category);
    setIsModalOpen(true);
  };

  const handleDelete = (category) => setDeleteCategory(category);
 
  const handleCategoryClick = (category) => {
    navigate(
      activeTab === "services"
        ? `/dashboards/services/${category._id}`
        : `/dashboards/products/${category._id}`
    );
  };

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-gray-50/70 to-blue-50/70">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            {activeTab === "services" ? (
              <WrenchScrewdriverIcon className="h-7 w-7 text-blue-600" />
            ) : (
              <CubeIcon className="h-7 w-7 text-green-600" />
            )}
            All {activeTab === "services" ? "Services" : "Products"}
          </h1>

          <button
            onClick={() => {
              setEditCategory(null);
              setIsModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-base sm:text-lg font-semibold text-white bg-gradient-to-r from-blue-500/90 to-blue-700/90 rounded-lg opacity-90 hover:opacity-100 hover:from-blue-600/90 hover:to-blue-800/90 transition-all"
          >
            <PlusIcon className="h-5 w-5" />
            Add {activeTab === "services" ? "Service" : "Product"}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex mb-8 border-b border-gray-200 overflow-x-auto">
          {[
            { key: "services", icon: <WrenchScrewdriverIcon className="h-5 w-5" /> },
            { key: "products", icon: <CubeIcon className="h-5 w-5" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-base sm:text-lg font-medium transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              All {tab.key.charAt(0).toUpperCase() + tab.key.slice(1)}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <Spinner size="large" color="primary" />
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center text-gray-500 py-10 flex flex-col items-center gap-3">
            <CubeIcon className="h-10 w-10 text-gray-400" />
            No {activeTab} found. Click &quot;Add&quot; to create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((cat) => {
              const imageUrl = cat.image
                ? cat.image.startsWith("http")
                  ? cat.image
                  : `${API_BASE_URL}/${cat.image.replace(/^\/+/, "").replaceAll("\\", "/")}`
                : "https://via.placeholder.com/150";

              const description =
                activeTab === "services"
                  ? cat.description || "Service Category"
                  : cat.description || "Product Category";

              return activeTab === "services" ? (
                <ServiceCategoryCard
                  key={cat._id}
                  service={cat}
                  user={cat.name}
                  role={cat.description}
                  imageUrl={imageUrl}
                  description={description}
                  onClick={() => handleCategoryClick(cat)}
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => handleDelete(cat)}
                />
              ) : (
                <ProductCategoryCard
                  key={cat._id}
                  product={cat}
                  user={cat.name}
                  role={cat.description}
                  imageUrl={imageUrl}
                  description={description}
                  onClick={() => handleCategoryClick(cat)}
                  onEdit={() => handleEdit(cat)}
                  onDelete={() => handleDelete(cat)}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Add/Edit */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {editCategory ? (
          activeTab === "services" ? (
            <EditServiceCategoryForm
              category={editCategory}
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          ) : (
            <EditProductCategoryForm
              category={editCategory}
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          )
        ) : activeTab === "services" ? (
          <AddServiceForm
            onClose={() => setIsModalOpen(false)}
            onServiceAdded={refreshCategories}
          />
        ) : (
          <AddProductForm
            onClose={() => setIsModalOpen(false)}
            onProductAdded={refreshCategories}
          />
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
 {/* Delete Confirmation Modal */}
{deleteCategory &&
  (activeTab === "services" ? (
    <ServiceCategoryDeleteForm
      serviceCategory={deleteCategory}
      onCancel={() => setDeleteCategory(null)}
      onDeleted={async (deletedCat) => {
                setDeleteCategory(null);
            
         toast.success(`Service category "${deletedCat.name}" deleted ✅`);
        
        await refreshCategories();
         
        

        // toast.success(`Service category "${deletedCat.name}" deleted ✅`);
        
      }}
    />
  ) : (
    <ProductCategoryDeleteForm
      productCategory={deleteCategory}
      onCancel={() => setDeleteCategory(null)}
      onDeleted={async (deletedCat) => {
        await refreshCategories();
        setDeleteCategory(null);
        toast.success(`Product category "${deletedCat.name}" deleted ✅`);
      }}
    />
  ))}


    </div>
  );
};

export default Home;
