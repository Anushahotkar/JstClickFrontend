/*ServicesPage.jsx*/

import { useState, useEffect ,useCallback} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { FiPlus,FiArrowLeft } from "react-icons/fi";

import Modal from "../components/Modal";
import AddServiceForm from "./AddServiceForm";
import EditServiceForm from "./EditServiceForm";
import ServiceDeleteForm from "./ServiceDeleteForm";
import ServiceCard from "./ServiceCard";
import Spinner from "../components/Spinner";

import { fetchCategories, fetchCategoryServices, deleteService } from "../../api/servicesApi";

const ServicesPage = () => {
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const navigate = useNavigate();
  const { categoryId } = useParams();

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

 
const loadServices = useCallback(async () => {
  setLoading(true);
  try {
    const token = localStorage.getItem("authToken");
    if (!token) return navigate("/login");

    const servicesData = await fetchCategoryServices(categoryId);
    const catData = await fetchCategories();
    const foundCategory = catData?.data?.find(c => c._id === categoryId);

    setCategory(foundCategory || { name: "Category" });

    const updatedServices = servicesData.map(s => ({
      ...s,
      description: s.description || (foundCategory?.name ? `${foundCategory.name} Services` : "Category"),
    }));

    setServices(updatedServices);
  } catch (err) {
    console.error(err);
    showToast(err.message || "Failed to load services", "error");
  } finally {
    setLoading(false);
  }
}, [categoryId, navigate]);

  useEffect(() => {
    loadServices();
  }, [loadServices]);

  const handleServiceAdded = () => {
    setAddModalOpen(false);
    showToast("Service added successfully!", "success");
    loadServices();
  };

  const handleServiceUpdated = () => {
    setEditModalOpen(false);
    showToast("Service updated successfully!", "success");
    loadServices();
  };

  const handleServiceDeleted = async () => {
    try {
      await deleteService(selectedService._id);
      setDeleteModalOpen(false);
      showToast("Service deleted successfully!", "success");
      loadServices();
    } catch (err) {
      console.error(err);
      showToast(err.message || "Failed to delete service", "error");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner size="large" color="primary" />
      </div>
    );

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-10 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      {/* Header */}
<header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
  {/* Title */}
  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-800 capitalize text-center sm:text-left flex-1">
    {category?.name || "Category"}
  </h1>

  {/* Buttons */}
  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto mt-2 sm:mt-0">
    {/* Back Button */}
    <button
      onClick={() => navigate(-1)}
      className="flex items-center gap-2 px-4 py-2.5 text-sm sm:text-base font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition w-full sm:w-auto justify-center"
    >
      <FiArrowLeft className="h-5 w-5" />
      Back
    </button>

    {/* Add Service Button */}
    <button
      onClick={() => setAddModalOpen(true)}
      className="flex items-center gap-2 px-4 py-2.5 text-sm sm:text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition w-full sm:w-auto justify-center"
    >
      <FiPlus className="h-5 w-5" />
      Add Service
    </button>
  </div>
</header>


      {/* Services Grid */}
   <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">

        {services.length > 0 ? (
          services.map((service) => (
            <ServiceCard
              key={service._id}
              service={service}
              apiBaseUrl={import.meta.env.VITE_API_BASE_URL}
              onEdit={() => {
                setSelectedService(service);
                setEditModalOpen(true);
              }}
              onDelete={() => {
                setSelectedService(service);
                setDeleteModalOpen(true);
              }}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 text-lg py-10">
            No services found for this category.
          </div>
        )}
      </div>

    {/* Add Service Modal */}
<Modal isOpen={addModalOpen} onClose={() => setAddModalOpen(false)}>
  <AddServiceForm
    onClose={() => setAddModalOpen(false)}
    onServiceAdded={handleServiceAdded}
    showToast={showToast} // <-- pass toast function
  />
</Modal>

      {/* Edit Service Modal */}
      {selectedService && (
        <Modal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)}>
          <EditServiceForm
            serviceData={selectedService}
            onClose={() => setEditModalOpen(false)}
            onServiceUpdated={handleServiceUpdated}
          />
        </Modal>
      )}

      {/* Delete Service Modal */}
      {selectedService && (
        <Modal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
          <ServiceDeleteForm
            service={selectedService}
            onCancel={() => setDeleteModalOpen(false)}
            onDelete={handleServiceDeleted}
          />
        </Modal>
      )}

      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 max-w-xs sm:max-w-sm w-full sm:w-auto px-4 py-3 rounded shadow flex items-center gap-2 text-white transition-opacity z-50 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          <span className="font-semibold text-sm sm:text-base">{toast.message}</span>
        </div>
      )}
    </div>
  );
};

export default ServicesPage;
