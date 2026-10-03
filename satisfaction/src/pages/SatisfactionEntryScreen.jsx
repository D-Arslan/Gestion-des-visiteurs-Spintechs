// import { useState } from "react";
// import SatisfactionForm from "./Satisfaction";
// import logo from "../assets/spintechs_logo.png"; // Place ton logo ici

// // Simule une base de visiteurs pour la démo
// const VISITEURS = [
//   { id: "12345", nom: "John Doe", service: "Accueil" },
//   { id: "67890", nom: "Jane Smith", service: "Ressources Humaines" },
//   { id: "54321", nom: "Alice Johnson", service: "Informatique" },
// ];

// export default function SatisfactionEntryScreen() {
//   const [badgeId, setBadgeId] = useState("");
//   const [visiteur, setVisiteur] = useState(null);

//   const handleScan = (e) => {
//     e.preventDefault();
//     const found = VISITEURS.find((v) => v.id === badgeId.trim());
//     if (found) {
//       setVisiteur(found);
//     } else {
//       alert("Badge inconnu. Veuillez réessayer.");
//       setBadgeId("");
//     }
//   };

//   if (!visiteur) {
//     return (
//       <div
//         className="min-h-screen w-full flex flex-col items-center justify-center"
//         style={{
//           background: " #F1F0EA ",
//         }}
//       >
//         <div className="bg-[#F1F0EA] rounded-3xl shadow-2xl p-12 flex flex-col items-center border-4 border-[#5B5F6C] max-w-lg w-full">
//           <img src={logo} alt="Logo Spintechs" className="h-14 mb-8 mx-auto" />
//           <h1 className="text-4xl font-bold text-[#5B5F6C] mb-8 tracking-wide text-center drop-shadow-lg">
//             Merci de votre visite
//           </h1>
//           <h2 className="text-2xl font-bold text-[#ED564B] mb-6 text-center">
//             Veuillez scanner votre badge pour donner votre avis
//           </h2>
//           <form
//             onSubmit={handleScan}
//             className="flex flex-col items-center gap-6 w-full"
//           >
//             <input
//               type="text"
//               placeholder="Scannez votre badge"
//               value={badgeId}
//               onChange={(e) => setBadgeId(e.target.value)}
//               className="border-2 border-[#ED564B] rounded-2xl py-8 text-2xl bg-[#F1F0EA] text-[#5B5F6C] focus:outline-none focus:ring-4 focus:ring-[#ED564B] w-full text-center placeholder-[#5B5F6C]/60"
//               autoFocus
//             />
//             <button
//               type="submit"
//               className="bg-[#ED564B] text-[#F1F0EA] text-2xl font-bold px-10 py-4 rounded-2xl shadow-xl hover:bg-[#5B5F6C] hover:text-[#F1F0EA] transition-all duration-200 w-full"
//             >
//               Valider
//             </button>
//           </form>
//         </div>
//       </div>
//     );
//   }

//   // Affichage du formulaire de satisfaction après scan
//   return (
//     <div
//       className="min-h-screen w-full flex flex-col items-center justify-center"
//       style={{
//         background: "linear-gradient(135deg, #F1F0EA 60%, #5B5F6C 100%)",
//       }}
//     >
//       <div className="bg-[#F1F0EA] rounded-3xl shadow-2xl p-12 max-w-xl w-full border-4 border-[#5B5F6C] flex flex-col items-center">
//         <img src={logo} alt="Logo Spintechs" className="h-14 mb-8 mx-auto" />
//         <h2 className="text-3xl font-extrabold text-[#5B5F6C] mb-2 text-center">
//           Bonjour {visiteur.nom} !
//         </h2>
//         <p className="mb-6 text-xl text-[#5B5F6C] text-center">
//           Service :{" "}
//           <span className="font-bold text-[#ED564B]">{visiteur.service}</span>
//         </p>
//         <SatisfactionForm visiteur={visiteur} />
//       </div>
//     </div>
//   );
// }
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/spintechs_logo.png";

export default function SatisfactionEntryScreen() {
  const [badgeValue, setBadgeValue] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleBadgeInput = (e) => {
    const value = e.target.value;
    setBadgeValue(value);
  };

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setLoading(true);

      try {
        // Appel à l'API pour récupérer l'ID de visite par QR code
        const response = await fetch(
          `http://localhost:8060/api/visits/by-qrcode?qrCode=${badgeValue}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Badge inconnu. Veuillez réessayer.");
          } else {
            throw new Error("Erreur lors de la vérification du badge");
          }
        }

        const visitId = await response.json();

        // Récupération des détails complets de la visite
        const visitResponse = await fetch(
          `http://localhost:8060/api/visits/${visitId}`
        );

        if (!visitResponse.ok)
          throw new Error("Erreur lors de la récupération des détails");

        const visite = await visitResponse.json();

        // Redirection vers la page de satisfaction
        navigate("/satisfaction", { state: { visite } });
      } catch (err) {
        setError(err.message);
        setBadgeValue("");
        setTimeout(() => setError(""), 3000);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col items-center justify-center"
      style={{ background: "#F1F0EA" }}
    >
      <div className="bg-[#F1F0EA] rounded-3xl shadow-2xl p-12 flex flex-col items-center border-4 border-[#5B5F6C] max-w-lg w-full">
        <img src={logo} alt="Logo Spintechs" className="h-14 mb-8 mx-auto" />
        <h1 className="text-4xl font-bold text-[#5B5F6C] mb-8 tracking-wide text-center drop-shadow-lg">
          Merci de votre visite
        </h1>
        <h2 className="text-2xl font-bold text-[#ED564B] mb-6 text-center">
          Veuillez scanner votre badge pour donner votre Note
        </h2>

        <input
          type="text"
          value={badgeValue}
          onChange={handleBadgeInput}
          onKeyDown={handleKeyDown}
          className="border-2 border-[#ED564B] rounded-2xl py-8 text-2xl bg-[#F1F0EA] text-[#5B5F6C] focus:outline-none focus:ring-4 focus:ring-[#ED564B] w-full text-center placeholder-[#5B5F6C]/60"
          placeholder="Scannez votre badge"
          autoFocus
          disabled={loading}
        />

        {loading && (
          <div className="mt-4 flex justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#ED564B]"></div>
          </div>
        )}

        {error && (
          <p className="mt-4 text-red-600 font-semibold animate-pulse">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
