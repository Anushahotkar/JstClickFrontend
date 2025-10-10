/* home/index.jsx */
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { WrenchScrewdriverIcon, CubeIcon, PlusIcon } from "@heroicons/react/24/outline";
import { MdMiscellaneousServices, MdProductionQuantityLimits } from "react-icons/md";
import { toast } from "react-hot-toast";

import Modal from "../components/Modal";
import AddServiceForm from "../category/AddServiceForm";
import AddProductForm from "../category/AddProductForm";
import ServiceCategoryCard from "../components/ServiceCategoryCard";
import ProductCategoryCard from "../components/ProductCategoryCard";
import ServiceCard from "../services/ServiceCard";
import ProductCard from "../products/ProductCard";
import EditServiceCategoryForm from "../category/EditServiceCategoryForm";
import EditProductCategoryForm from "../category/EditProductCategoryForm";
import ServiceCategoryDeleteForm from "../category/ServiceCategoryDeleteForm";
import ProductCategoryDeleteForm from "../category/ProductCategoryDeleteForm";
import Spinner from "../components/Spinner";

import { fetchCategoriesApi } from "../../api/categoryApi";
import { fetchCategoryServices } from "../../api/servicesApi";
import { fetchProductsByCategory } from "../../api/productApi";

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
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch categories with sub-items
  const fetchCategoriesWithSubItems = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await fetchCategoriesApi(activeTab);
      const catsWithSubItems = await Promise.all(
        cats.map(async (cat) => {
          const subItems =
            activeTab === "services"
              ? await fetchCategoryServices(cat._id)
              : await fetchProductsByCategory(cat._id);
          return { ...cat, subItems };
        })
      );
      setCategories(catsWithSubItems);
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to load categories");
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setSearchParams({ tab: activeTab });
    fetchCategoriesWithSubItems();
  }, [activeTab, setSearchParams, fetchCategoriesWithSubItems]);

  const refreshCategories = async () => await fetchCategoriesWithSubItems();
  const handleEdit = (cat) => {
    setEditCategory(cat);
    setIsModalOpen(true);
  };
  const handleDelete = (cat) => setDeleteCategory(cat);
  const handleCategoryClick = (cat) =>
    navigate(
      activeTab === "services"
        ? `/dashboards/services/${cat._id}`
        : `/dashboards/products/${cat._id}`
    );

  const q = searchQuery.toLowerCase();

  // Prepare display items based on search
  const displayItems = categories.reduce((acc, cat) => {
    const categoryMatch = cat.name.toLowerCase().includes(q);
    const filteredSubItems =
      cat.subItems?.filter((item) => item.name.toLowerCase().includes(q)) || [];

    if (searchQuery) {
      // Show both category (if matches) and matching sub-items
      if (categoryMatch) acc.push({ type: "category", data: [cat] });
      if (filteredSubItems.length > 0) acc.push({ type: "subItems", data: filteredSubItems, parent: cat });
    } else {
      acc.push({ type: "category", data: [cat] });
    }

    return acc;
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100/60">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 flex items-center gap-2">
            {activeTab === "services" ? (
              <WrenchScrewdriverIcon className="h-7 w-7 text-blue-600" />
            ) : (
              <CubeIcon className="h-7 w-7 text-green-600" />
            )}
            All {activeTab === "services" ? "Services" : "Products"}
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={`Search ${activeTab === "services" ? "services" : "products"}...`}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition w-full sm:w-64"
            />
            <button
              onClick={() => {
                setEditCategory(null);
                setIsModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-sm sm:text-base font-semibold text-white bg-gradient-to-r from-blue-500 to-blue-700 rounded-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition-all"
            >
              <PlusIcon className="h-5 w-5" />
              Add {activeTab === "services" ? "Service" : "Product"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 scrollbar-thin scrollbar-thumb-gray-300">
          {[
            { key: "services", icon: <WrenchScrewdriverIcon className="h-5 w-5" /> },
            { key: "products", icon: <CubeIcon className="h-5 w-5" /> },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2 text-sm sm:text-base font-medium transition whitespace-nowrap ${
                activeTab === tab.key
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.icon}
              {tab.key.charAt(0).toUpperCase() + tab.key.slice(1)}
            </button>
          ))}
        </div>

        {/* Main Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="large" color="primary" />
          </div>
        ) : displayItems.length === 0 ? (
          <div className="text-center text-gray-500 py-12 flex flex-col items-center gap-3">
            <CubeIcon className="h-10 w-10 text-gray-400" />
            No {activeTab} found{searchQuery && ` for "${searchQuery}"`}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayItems.map((itemBlock) => {
              if (itemBlock.type === "category") {
                const cat = itemBlock.data[0];
                const imageUrl = cat.image?.startsWith("http")
                  ? cat.image
                  : `${API_BASE_URL}/${cat.image.replace(/^\/+/, "").replaceAll("\\", "/")}`;
                return activeTab === "services" ? (
                  <ServiceCategoryCard
                    key={cat._id}
                    service={cat}
                    user={cat.name}
                    role={cat.description}
                    imageUrl={imageUrl}
                    defaultIcon={<MdMiscellaneousServices className="text-4xl text-blue-500" />}
                    description={cat.description || "Service Category"}
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
                    defaultIcon={<MdProductionQuantityLimits className="text-4xl text-green-500" />}
                    description={cat.description || "Product Category"}
                    onClick={() => handleCategoryClick(cat)}
                    onEdit={() => handleEdit(cat)}
                    onDelete={() => handleDelete(cat)}
                  />
                );
              }

              if (itemBlock.type === "subItems") {
                const parentCat = itemBlock.parent;
                return itemBlock.data.map((sub) =>
                  activeTab === "services" ? (
                    <ServiceCard
                      key={sub._id}
                      service={sub}
                      apiBaseUrl={API_BASE_URL}
                      onClick={() => navigate(`/dashboards/services/${parentCat._id}`)}
                    />
                  ) : (
                    <ProductCard
                      key={sub._id}
                      product={sub}
                      apiBaseUrl={API_BASE_URL}
                      onClick={() => navigate(`/dashboards/products/${parentCat._id}`)}
                    />
                  )
                );
              }

              return null;
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
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
          <AddServiceForm onClose={() => setIsModalOpen(false)} onServiceAdded={refreshCategories} />
        ) : (
          <AddProductForm onClose={() => setIsModalOpen(false)} onProductAdded={refreshCategories} />
        )}
      </Modal>

      {/* Delete Modal */}
      {deleteCategory &&
        (activeTab === "services" ? (
          <ServiceCategoryDeleteForm
            serviceCategory={deleteCategory}
            onCancel={() => setDeleteCategory(null)}
            onDeleted={async (deletedCat) => {
              setDeleteCategory(null);
              toast.success(`Service category "${deletedCat.name}" deleted ✅`);
              await refreshCategories();
            }}
          />
        ) : (
          <ProductCategoryDeleteForm
            productCategory={deleteCategory}
            onCancel={() => setDeleteCategory(null)}
            onDeleted={async (deletedCat) => {
              setDeleteCategory(null);
              toast.success(`Product category "${deletedCat.name}" deleted ✅`);
              await refreshCategories();
            }}
          />
        ))}
    </div>
  );
};

export default Home;
