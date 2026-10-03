import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import { BeatLoader } from "react-spinners";

export default function Login() {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!credentials.username || !credentials.password) {
      setError("Veuillez remplir tous les champs");
      return;
    }

    setIsLoading(true);

    try {
      const success = await login({
        username: credentials.username,
        password: credentials.password,
      });

      if (success) {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(
        err.message ||
          "Échec de la connexion. Veuillez vérifier vos identifiants."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F1F0EA] to-[#F1F0EA] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg overflow-hidden p-8 space-y-8 transition-all duration-300 hover:shadow-xl">
        <div className="text-center">
          <img
            src="/logo.png"
            alt="Spintechs Logo"
            className="mx-auto h-12 mb-2"
            style={{ maxHeight: 48 }}
          />
          {/* <h1 className="text-4xl font-bold bg-gradient-to-r from-[#ED564B] to-[#ED564B] bg-clip-text text-transparent">
            Spintechs
          </h1> */}
          <h2 className="mt-6 text-2xl font-semibold text-[#ED564B]">
            Connexion à votre compte
          </h2>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-[#ED564B] mb-1"
              >
                Identifiant
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#ED564B] rounded-lg focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300 text-black placeholder-[#ED564B]"
                placeholder="Entrez votre identifiant"
                disabled={isLoading}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-[#ED564B] mb-1"
              >
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-[#ED564B] rounded-lg focus:ring-2 focus:ring-[#ED564B] focus:border-transparent transition-all duration-300 text-black placeholder-[#ED564B]"
                placeholder="Entrez votre mot de passe"
                disabled={isLoading}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className={`group relative w-full flex justify-center py-3 px-4 text-sm font-medium rounded-lg
                       bg-gradient-to-r from-[#ED564B] to-[#ED564B] text-white
                       hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#ED564B]
                       transition-all duration-300 ${
                         isLoading ? "opacity-80" : ""
                       }`}
              disabled={isLoading}
            >
              {isLoading ? (
                <BeatLoader color="#ffffff" size={8} />
              ) : (
                <>
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg
                      className="h-5 w-5 text-white/80 group-hover:text-white/90 transition-transform duration-300 group-hover:scale-110"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                  Se connecter
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}