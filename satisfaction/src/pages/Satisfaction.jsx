import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/spintechs_logo.png";

function Satisfaction() {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [loading, setLoading] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false); // Nouvel état

  const { state } = useLocation();
  const navigate = useNavigate();
  const visite = state?.visite;

  const messages = ["Médiocre", "Passable", "Moyen", "Bien", "Excellent"];
  const colors = [
    "text-red-500",
    "text-orange-500",
    "text-yellow-500",
    "text-lime-500",
    "text-green-500",
  ];

  // Nouvelle fonction pour gérer le clic sur une note
  const handleRating = async (star) => {
    if (!visite?.id_visit) return;
    setRating(star);
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8060/api/visits/${visite.id_visit}/satisfaction-only?satisfaction=${star}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Erreur lors de la mise à jour");
      }
      setShowThankYou(true); // Afficher l'écran de remerciement
      setTimeout(() => {
        navigate("/"); // Redirection après 2 secondes
      }, 2000);
    } catch (err) {
      alert(err.message || "Échec de l'enregistrement. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen py-15 px-4 sm:px-6 lg:px-8 flex items-center justify-center animate-fade-in"
      style={{ background: "#F1F0EA" }}
    >
      {showThankYou ? (
        <div className="fixed inset-0 bg-[#F1F0EA] flex items-center justify-center z-50 animate-fade-in">
          <div className="text-center">
            <img src={logo} alt="Logo Spintechs" className="h-14 mb-8 mx-auto" />
            <h1 className="text-4xl font-bold text-[#EC554A] mb-4">
              Merci pour votre visite !
            </h1>
            <div className="animate-pulse text-[#35415A] text-xl">
              À bientôt
            </div>
          </div>
        </div>
      ) : (
        <div className="max-w-md w-full space-y-8 bg-[#F1F0EA]/90 backdrop-blur-sm p-8 rounded-xl shadow-lg border-2 border-[#35415A]">
          <img src={logo} alt="Logo Spintechs" className="h-14 mb-8 mx-auto" />

          <div className="text-center">
            <h1 className="text-3xl font-bold bg-[#EC554A] bg-clip-text text-transparent mb-2">
              Votre Avis Nous Intéresse !
            </h1>
            <p className="text-[#35415A]">
              Comment avez-vous trouvé notre service ?
            </p>
          </div>

          <div className="mt-8 space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#35415A]">
                Votre Note :
              </label>
              <div className="h-24 flex justify-center space-x-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`text-4xl transform hover:scale-110 transition ${
                      star <= (hover || rating)
                        ? colors[star - 1]
                        : "text-gray-300"
                    }`}
                    onClick={() => handleRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    disabled={loading}
                  >
                    ★
                  </button>
                ))}
              </div>
              {(hover > 0 || rating > 0) && (
                <p
                  className={`text-center font-medium mt-2 ${
                    colors[(hover || rating) - 1]
                  }`}
                >
                  {hover > 0 ? messages[hover - 1] : messages[rating - 1]}
                </p>
              )}
              {loading && (
                <div className="flex justify-center mt-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#EC554A]"></div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Satisfaction;
