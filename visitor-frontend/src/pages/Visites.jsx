"use client";
import { useState, useEffect } from "react";
import axiosInstance from "../config/axiosInstance";

export default function Visites() {
  const [search, setSearch] = useState("");
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/visitors");
      setVisits(response.data);
    } catch (err) {
      setError(err.message || "Erreur de chargement des visites");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const searchVisits = async () => {
      if (!search.trim()) {
        return fetchData();
      }

      try {
        const response = await axiosInstance.get(
          `/api/visitors/search?query=${encodeURIComponent(search)}`
        );
        setVisits(response.data);
      } catch (err) {
        console.error("Erreur de recherche:", err.message);
      }
    };

    const debounceTimer = setTimeout(searchVisits, 300);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  if (loading) return <div className="p-4">Chargement en cours...</div>;
  if (error) return <div className="p-4 text-red-500">Erreur : {error}</div>;

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 animate-fade-in bg-[#F1F0EA]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-[#ED564B] to-[#ED564B] bg-clip-text text-transparent">
            Visiteurs
          </h2>
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
              placeholder="Rechercher un visiteur..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-[#ED564B] rounded-lg bg-white text-[#ED564B]
                       focus:outline-none focus:ring-2 focus:ring-[#ED564B] focus:border-transparent"
            />
          </div>
        </div>

        {/* Visits Table */}
        <div className="bg-white rounded-lg shadow-sm border border-[#ED564B]/20 overflow-hidden">
          <table className="min-w-full divide-y divide-[#ED564B]/20">
            <thead className="bg-[#F1F0EA]">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B]">Nom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B]">Prénom</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B]">N° Identification</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-[#ED564B]">Visites</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#ED564B]/20">
              {visits.map((visit) => (
                <tr key={visit.id} className="hover:bg-[#F1F0EA]/50 transition-colors">
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {visit.nom}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {visit.prenom}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {visit.numeroId}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                    {visit.nbVisit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}