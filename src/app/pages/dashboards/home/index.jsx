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
import EditServiceForm from "../services/EditServiceForm";
import EditProductForm from "../products/EditProductForm";
import ServiceCategoryDeleteForm from "../category/ServiceCategoryDeleteForm";
import ProductCategoryDeleteForm from "../category/ProductCategoryDeleteForm";
import ServiceDeleteForm from "../services/ServiceDeleteForm";
import ProductDeleteForm from "../products/ProductDeleteForm";
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
  const [editItem, setEditItem] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoriesMap, setCategoriesMap] = useState({}); // id -> category


  const navigate = useNavigate();

  const fetchCategoriesWithSubItems = useCallback(async () => {
    setLoading(true);
    try {
      const cats = await fetchCategoriesApi(activeTab);
      // Build map: categoryId -> category
    const catMap = {};
    cats.forEach(cat => {
      catMap[cat._id] = cat;
    });
    setCategoriesMap(catMap);
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

  const handleCategoryEdit = (cat) => {
    setEditCategory(cat);
    setIsModalOpen(true);
  };
  const handleCategoryDelete = (cat) => setDeleteCategory(cat);

  const handleItemEdit = (item,parentCat) => {
    setEditItem({ ...item, parentCategory: parentCat });
    setIsModalOpen(true);
  };
  const handleItemDelete = (item) => setDeleteItem(item);

  const handleCategoryClick = (cat) =>
    navigate(
      activeTab === "services"
        ? `/dashboards/services/${cat._id}`
        : `/dashboards/products/${cat._id}`
    );

  const q = searchQuery.toLowerCase();

  const displayItems = categories.reduce((acc, cat) => {
    const categoryMatch = cat.name.toLowerCase().includes(q);
    const filteredSubItems =
      cat.subItems?.filter((item) => item.name.toLowerCase().includes(q)) || [];

    if (searchQuery) {
      if (categoryMatch) acc.push({ type: "category", data: [cat] });
      if (filteredSubItems.length > 0)
        acc.push({ type: "subItems", data: filteredSubItems, parent: cat });
    } else {
      acc.push({ type: "category", data: [cat] });
    }
    return acc;
  }, []);

  return (
    <div className="p-4 sm:p-6 md:p-10 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100/60">
      <div className="max-w-7xl mx-auto">
        {/* Header with Back button */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
          {/* <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-1 text-gray-600 hover:text-gray-800 mb-2 sm:mb-0"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            Back
          </button> */}
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
                setEditItem(null);
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
                    onEdit={() => handleCategoryEdit(cat)}
                    onDelete={() => handleCategoryDelete(cat)}
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
                    onEdit={() => handleCategoryEdit(cat)}
                    onDelete={() => handleCategoryDelete(cat)}
                  />
                );
              }

             if (itemBlock.type === "subItems") {
  return itemBlock.data.map((sub) => {
    const categoryName = categoriesMap[sub.categoryId]?.name || "Unknown Category"; // ✅ get category name by id

    return activeTab === "services" ? (
      <ServiceCard
        key={sub._id}
        service={sub}
        apiBaseUrl={API_BASE_URL}
        categoryName={categoryName}
        onClick={() => navigate(`/dashboards/services/${sub.categoryId}`)}
        onEdit={() => handleItemEdit(sub)}
        onDelete={() => handleItemDelete(sub)}
      />
    ) : (
      <ProductCard
        key={sub._id}
        product={sub}
        apiBaseUrl={API_BASE_URL}
        categoryName={categoryName}
        onClick={() => navigate(`/dashboards/products/${sub.categoryId}`)}
        onEdit={() => handleItemEdit(sub)}
        onDelete={() => handleItemDelete(sub)}
      />
    );
  });
}


              return null;
            })}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        {/* Category Edit */}
        {editCategory ? (
          activeTab === "services" ? (
            <EditServiceCategoryForm
              category={editCategory}
              parentCategory={editItem?.parentCategory} //
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          ) : (
            <EditProductCategoryForm
              category={editCategory}
              parentCategory={editItem?.parentCategory} // ✅ pass parent category
              onSave={refreshCategories}
              onCancel={() => setIsModalOpen(false)}
            />
          )
        ) : editItem ? (
          activeTab === "services" ? (
            <EditServiceForm
              serviceData={editItem}
              onClose={() => setIsModalOpen(false)}
              onServiceUpdated={refreshCategories}
            />
          ) : (
            <EditProductForm
              productData={editItem}
              onClose={() => setIsModalOpen(false)}
              onProductUpdated={refreshCategories}
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

      {deleteItem &&
        (activeTab === "services" ? (
          <ServiceDeleteForm
            service={deleteItem}
            onCancel={() => setDeleteItem(null)}
            onDelete={async () => {
              // call API to delete
              await refreshCategories();
              toast.success(`Service "${deleteItem.name}" deleted ✅`);
            }}
          />
        ) : (
          <ProductDeleteForm
            product={deleteItem}
            onCancel={() => setDeleteItem(null)}
            onDelete={async () => {
              // call API to delete
              await refreshCategories();
              toast.success(`Product "${deleteItem.name}" deleted ✅`);
            }}
          />
        ))}
    </div>
  );
};

export default Home;
