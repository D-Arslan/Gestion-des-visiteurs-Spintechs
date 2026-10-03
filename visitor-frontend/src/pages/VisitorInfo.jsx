"use client";
import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

export default function VisitorInfo() {
  const [search, setSearch] = useState("");
  const [visitors, setVisitors] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // New state for adding a visitor
  const [adding, setAdding] = useState(false);
  const [newVisitor, setNewVisitor] = useState({
    nom: "",
    prenom: "",
    numeroId: "",
    heureArrivee: "",
    heureSortie: "",
    serviceId: "",
    statut: "EN_ATTENTE",
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toISOString().slice(0, 16);
  };

  const fetchData = async () => {
    try {
      const [servicesRes, visitsRes] = await Promise.all([
        axiosInstance.get("/services"),
        axiosInstance.get("/visits"),
      ]);

      const servicesData = servicesRes.data;
      const visitsData = visitsRes.data;

      const mappedVisits = visitsData.map((visit) => ({
        ...visit,
        service:
          servicesData.find((s) => s.id === visit.serviceId)?.nomService ||
          "Inconnu",
        heureArrivee: formatDate(visit.heureArrivee),
        heureSortie: formatDate(visit.heureSortie),
      })).reverse(); // Ajout de .reverse() ici

      setServices(servicesData);
      setVisitors(mappedVisits);
    } catch (err) {
      setError(err.message || "Erreur de chargement");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchVisitors = async () => {
      if (!search.trim()) {
        return fetchData();
      }

      try {
        const response = await axiosInstance.get(
          `/visits/search?query=${encodeURIComponent(search)}`
        );
        const data = response.data;

        let currentServices = services;
        if (!currentServices.length) {
          const res = await axiosInstance.get("/services");
          currentServices = res.data;
          setServices(currentServices);
        }

        const mappedVisits = data.map((visit) => ({
          ...visit,
          service:
            currentServices.find((s) => s.id === visit.serviceId)?.nomService ||
            "Inconnu",
          heureArrivee: formatDate(visit.heureArrivee),
          heureSortie: formatDate(visit.heureSortie),
        }));

        setVisitors(mappedVisits);
      } catch (err) {
        console.error("Erreur de recherche:", err.message);
      }
    };

    const debounceTimer = setTimeout(searchVisitors, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  // New handler for form input changes
  const handleNewVisitorChange = (field, value) => {
    setNewVisitor((prev) => ({ ...prev, [field]: value }));
  };

  // New submit handler for adding a visitor
  const handleAddVisitorSubmit = async (e) => {
    e.preventDefault();
    try {
      // Prepare payload; if serviceId is not selected, use the first service by default
      const payload = {
        nom: newVisitor.nom || "Nouveau",
        prenom: newVisitor.prenom || "Visiteur",
        numeroId: newVisitor.numeroId || "000000",
        heureArrivee: newVisitor.heureArrivee || new Date().toISOString().slice(0, 19),
        heureSortie: newVisitor.heureSortie || null,
        serviceId:
          newVisitor.serviceId || (services.length > 0 ? services[0].id : null),
        statut: newVisitor.statut,
      };

      await axiosInstance.post("/visits", payload);
      setNewVisitor({
        nom: "",
        prenom: "",
        numeroId: "",
        heureArrivee: "",
        heureSortie: "",
        serviceId: "",
        statut: "EN_ATTENTE",
      });
      setAdding(false);
      fetchData();
    } catch (err) {
      alert(`Erreur lors de l'ajout: ${err.message}`);
    }
  };

  // Existing handlers: handleEdit, handleDelete, etc.
  const handleEdit = async (id, field, value) => {
    try {
      const currentVisit = visitors.find((v) => v.id === id);
      if (!currentVisit) return;

      const updatedVisit = { ...currentVisit };

      if (field === "service") {
        const serviceObj = services.find((s) => s.nomService === value);
        if (!serviceObj) return;
        updatedVisit.service = value;
        updatedVisit.serviceId = serviceObj.id;
      } else if (field.startsWith("heure")) {
        updatedVisit[field] = value
          ? new Date(value).toISOString().slice(0, 19)
          : null;
      } else if (field === "statut") {
        await axiosInstance.put(`/visits/${id}/statut`, null, {
          params: { statut: value },
        });
        return fetchData();
      } else {
        updatedVisit[field] = value;
      }

      setVisitors((prev) => prev.map((v) => (v.id === id ? updatedVisit : v)));

      const payload = {
        id: updatedVisit.id,
        nom: updatedVisit.nom,
        prenom: updatedVisit.prenom,
        numeroId: updatedVisit.numeroId,
        visitDate: updatedVisit.heureArrivee?.slice(0, 19),
        exitDate: updatedVisit.heureSortie?.slice(0, 19),
        service: {
          id: updatedVisit.serviceId,
        },
        status: updatedVisit.statut,
      };

      await axiosInstance.put(`/visits/${id}`, payload);
    } catch (err) {
      console.error("Erreur de mise à jour:", err.message);
      fetchData();
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Supprimer cette visite ?")) return;

    setVisitors((prev) => prev.filter((v) => v.id !== id));

    try {
      await axiosInstance.delete(`/visits/${id}`);
    } catch (err) {
      console.error("Erreur de suppression:", err.message);
      fetchData();
    }
  };

  if (loading) return <div className="p-4">Chargement en cours...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur : {error}</div>;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in bg-[#F1F0EA]">
      <div className="max-w-7xl mx-auto">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ED564B] to-[#ED564B] bg-clip-text text-transparent">
             Visites
          </h2>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-grow max-w-md">
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
                placeholder="Rechercher..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#ED564B] rounded-lg bg-white text-[#ED564B]
                         focus:outline-none focus:ring-2 focus:ring-[#ED564B] focus:border-transparent"
              />
            </div>
            {/* Toggle form button */}
            <button
              onClick={() => setAdding((prev) => !prev)}
              className="flex items-center justify-center px-4 py-2 bg-[#ED564B] text-[#F1F0EA] rounded-lg hover:opacity-90 transition-opacity"
            >
              {adding ? "Annuler" : "Ajouter"}
            </button>
          </div>
        </div>

        {/* New Visitor Form */}
        {adding && (
          <form
            onSubmit={handleAddVisitorSubmit}
            className="mb-6 bg-white/80 p-4 rounded-lg shadow-md"
          >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <input
                type="text"
                placeholder="Nom"
                value={newVisitor.nom}
                onChange={(e) =>
                  handleNewVisitorChange("nom", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <input
                type="text"
                placeholder="Prénom"
                value={newVisitor.prenom}
                onChange={(e) =>
                  handleNewVisitorChange("prenom", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <input
                type="text"
                placeholder="N° Id"
                value={newVisitor.numeroId}
                onChange={(e) =>
                  handleNewVisitorChange("numeroId", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              <input
                type="datetime-local"
                placeholder="Arrivée"
                value={newVisitor.heureArrivee}
                onChange={(e) =>
                  handleNewVisitorChange("heureArrivee", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              />
              {/* Optionally, add an input for heureSortie if needed */}
              <select
                value={newVisitor.serviceId}
                onChange={(e) =>
                  handleNewVisitorChange("serviceId", e.target.value)
                }
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              >
                {services.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.nomService}
                  </option>
                ))}
              </select>
              <select
                value={newVisitor.statut}
                onChange={(e) => handleNewVisitorChange("statut", e.target.value)}
                required
                className="px-3 py-2 border border-[#ED564B] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#ED564B]"
              >
                <option value="EN_ATTENTE" className="text-amber-500">En attente</option>
                <option value="PRESENT" className="text-green-500">En cours</option>
                <option value="CLOTURE" className="text-red-500">Clôturé</option>
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

        {/* Tableau */}
        <div className="bg-white rounded-lg shadow-sm border border-[#ED564B]/20 overflow-hidden">
          <table className="min-w-full divide-y divide-[#ED564B]/20">
            <thead className="bg-[#F1F0EA]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[12%]">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[12%]">Prénom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[10%]">N° Id</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[15%]">Arrivée</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[15%]">Sortie</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[12%]">Service</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[13%]">Statut</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B] w-[5%]">Satisfaction</th>
                {/* Removed Actions column */}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ED564B]/20">
              {visitors.map((visit) => (
                <tr key={visit.id} className="hover:bg-[#F1F0EA] transition-colors">
                  <td className="px-4 py-3">
                    <input
                      value={visit.nom || ""}
                      onChange={(e) => handleEdit(visit.id, "nom", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={visit.prenom || ""}
                      onChange={(e) => handleEdit(visit.id, "prenom", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      value={visit.numeroId || ""}
                      onChange={(e) => handleEdit(visit.id, "numeroId", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="datetime-local"
                      value={visit.heureArrivee || ""}
                      onChange={(e) => handleEdit(visit.id, "heureArrivee", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="datetime-local"
                      value={visit.heureSortie || ""}
                      onChange={(e) => handleEdit(visit.id, "heureSortie", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={visit.service}
                      onChange={(e) => handleEdit(visit.id, "service", e.target.value)}
                      className="w-full px-2 py-1 text-sm border border-[#ED564B]/50 rounded focus:ring-1 focus:ring-[#ED564B]"
                    >
                      {services.map((service) => (
                        <option key={service.id} value={service.nomService}>
                          {service.nomService}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={visit.statut}
                      onChange={(e) => handleEdit(visit.id, "statut", e.target.value)}
                      className={`w-full px-2 py-1 text-sm border rounded focus:ring-1 focus:ring-[#ED564B] ${
                        visit.statut === "EN_ATTENTE" 
                          ? "text-amber-500 border-amber-500/30 bg-amber-50" 
                          : visit.statut === "PRESENT" 
                          ? "text-green-500 border-green-500/30 bg-green-50" 
                          : visit.statut === "CLOTURE"
                          ? "text-red-500 border-red-500/30 bg-red-50"
                          : "text-gray-600 border-gray-200"
                      }`}
                    >
                      <option value="EN_ATTENTE" className="text-amber-500">En attente</option>
                      <option value="PRESENT" className="text-green-500">En cours</option>
                      <option value="CLOTURE" className="text-red-500">Clôturé</option>
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {visit.satisfaction ? (
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 text-[#ED564B]"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          <span className="ml-1 text-sm text-[#ED564B]">
                            {visit.satisfaction}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">ND</span>
                      )}
                    </div>
                  </td>
                  {/* Removed Actions column */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
