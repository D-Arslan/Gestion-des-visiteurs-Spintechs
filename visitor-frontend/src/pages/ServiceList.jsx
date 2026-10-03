import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

export default function ServiceList() {
  const [search, setSearch] = useState("");
  const [services, setServices] = useState([]);
  const [adding, setAdding] = useState(false); // show/hide add form
  const [newService, setNewService] = useState({
    nomService: "",
    responsable: "",
    telephone: "",
    statut: "libre",
  });

  const API_URL = "/services";

  // Fetch all services initially and on search changes (debounced)
  useEffect(() => {
    const fetchServices = async () => {
      try {
        if (!search.trim()) {
          const response = await axiosInstance.get(API_URL);
          setServices(response.data);
          return;
        }
        const response = await axiosInstance.get(`${API_URL}/search`, {
          params: { query: search },
        });
        setServices(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des services:", error);
      }
    };

    const debounceTimer = setTimeout(fetchServices, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  // Handle form input changes for new service
  const handleNewServiceChange = (field, value) => {
    setNewService((prev) => ({ ...prev, [field]: value }));
  };

  // Submit new service to backend
  const handleAddServiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axiosInstance.post(API_URL, newService);
      setServices((prev) => [...prev, response.data]);
      setNewService({
        nomService: "",
        responsable: "",
        telephone: "",
        statut: "libre",
      });
      setAdding(false);
    } catch (error) {
      console.error("Erreur lors de l'ajout:", error);
    }
  };

  // Delete service
  const handleDeleteService = async (id) => {
    try {
      await axiosInstance.delete(`${API_URL}/${id}`);
      setServices((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  // Edit service inline
  const handleEdit = async (id, field, value) => {
    const updatedServices = services.map((service) => {
      if (service.id === id) {
        const updatedService = { ...service, [field]: value };
        // Optimistic UI update
        axiosInstance.put(`${API_URL}/${id}`, updatedService).catch((error) => {
          console.error("Erreur de synchronisation:", error);
          // Ideally refetch or rollback on error
        });
        return updatedService;
      }
      return service;
    });
    setServices(updatedServices);
  };

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in bg-[#F1F0EA]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="md:flex md:items-center md:justify-between mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ED564B] to-[#ED564B] bg-clip-text text-transparent">
            Services
          </h2>
          <button
            onClick={() => setAdding((prev) => !prev)}
            className="group relative inline-flex items-center px-4 py-2 rounded-lg bg-[#ED564B] text-[#F1F0EA] shadow-lg hover:opacity-90 transform hover:scale-[1.02] transition-all duration-300"
          >
            {adding ? "Annuler" : "Ajouter un service"}
          </button>
        </div>

        {/* Add Service Form */}
        {adding && (
          <form
            onSubmit={handleAddServiceSubmit}
            className="mb-6 bg-white/80 p-4 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nom du service"
                value={newService.nomService}
                onChange={(e) =>
                  handleNewServiceChange("nomService", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <input
                type="text"
                placeholder="Responsable"
                value={newService.responsable}
                onChange={(e) =>
                  handleNewServiceChange("responsable", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <input
                type="tel"
                placeholder="Téléphone"
                value={newService.telephone}
                onChange={(e) =>
                  handleNewServiceChange("telephone", e.target.value)
                }
                pattern="[0-9]{10}"
                title="Entrez un numéro de téléphone valide (10 chiffres)"
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <select
                value={newService.statut}
                onChange={(e) =>
                  handleNewServiceChange("statut", e.target.value)
                }
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              >
                <option value="libre">Libre</option>
                <option value="occupé">Occupé</option>
              </select>
            </div>
            <button
              type="submit"
              className="mt-4 px-6 py-2 rounded-lg bg-[#ED564B] text-[#F1F0EA] shadow hover:opacity-90 transition"
            >
              Enregistrer
            </button>
          </form>
        )}

        {/* Search Bar */}
        <div
          className="card mb-6 animate-slide-up"
          style={{ animationDelay: "100ms" }}
        >
          <div className="relative rounded-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-[#ED564B]"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Rechercher un service, un responsable ou un statut..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-[#ED564B] text-[#ED564B] rounded-lg 
                       bg-white/70 backdrop-blur-sm placeholder-[#ED564B]
                       focus:outline-none focus:ring-2 focus:ring-[#ED564B] focus:border-transparent
                       transition-all duration-300"
            />
          </div>
        </div>

        {/* Services Table */}
        <div
          className="card animate-slide-up"
          style={{ animationDelay: "200ms" }}
        >
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[#ED564B]/30">
              <thead>
                <tr>
                  {[
                    "Service",
                    "Responsable",
                    "Téléphone",
                    "Statut",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-[#ED564B] uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ED564B]/30">
                {services.map((service, index) => (
                  <tr
                    key={service.id}
                    className="hover:bg-[#ED564B]/5 transition-colors duration-200"
                    style={{ animationDelay: `${300 + index * 100}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        value={service.nomService}
                        onChange={(e) =>
                          handleEdit(service.id, "nomService", e.target.value)
                        }
                        className="block w-full text-sm border-[#ED564B] rounded-lg bg-white/70 text-black
                                 focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        value={service.responsable}
                        onChange={(e) =>
                          handleEdit(service.id, "responsable", e.target.value)
                        }
                        className="block w-full text-sm border-[#ED564B] rounded-lg bg-white/70 text-black
                                 focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        value={service.telephone}
                        onChange={(e) =>
                          handleEdit(service.id, "telephone", e.target.value)
                        }
                        className="block w-full text-sm border-[#ED564B] rounded-lg bg-white/70 text-black
                                 focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <select
                        value={service.statut}
                        onChange={(e) =>
                          handleEdit(service.id, "statut", e.target.value)
                        }
                        className={`block w-full text-sm rounded-lg border-[#ED564B] bg-white/70
      focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300
      ${
        service.statut === "libre"
          ? "text-green-600"
          : service.statut === "occupé"
          ? "text-red-600"
          : "text-black"
      }`}
                      >
                        <option value="libre" className="text-green-600">Libre</option>
    <option value="occupé" className="text-red-600">Occupé</option>
  </select>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleDeleteService(service.id)}
                        className="text-[#ED564B] hover:text-red-600 transition-colors duration-300"
                      >
                        <svg
                          className="h-5 w-5 transform hover:scale-110 transition-transform duration-300"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}