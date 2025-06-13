import { useEffect, useState, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmEmailChange } from "../apis/auth.api.js";
import { useUser } from "../contexts/UserContext.jsx";
import Button from "../components/ui/Button.jsx";

export default function ConfirmEmailChange() {
  const [status, setStatus] = useState("pending");
  const [message, setMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const hasRun = useRef(false); // Empêche les appels multiples

  useEffect(() => {
    // Empêcher les appels multiples en mode strict ou lors de rechargements
    if (hasRun.current) return;
    hasRun.current = true;

    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Lien invalide - aucun token trouvé.");
      return;
    }

    const confirm = async () => {
      try {
        const data = await confirmEmailChange(token);

        setMessage(data.message || "Email confirmé avec succès !");
        setStatus("success");

        if (data.user) {
          setUser(data.user);
        }

        // Nettoyer l'URL pour éviter un nouvel appel si reload
        searchParams.delete("token");
        setSearchParams(searchParams, { replace: true });

        // Redirection automatique après 7 secondes
        // setTimeout(() => {
        //   navigate("/profile");
        // }, 7000);
      } catch (err) {
        setMessage(err.message || "Erreur lors de la confirmation.");
        setStatus("error");
      }
    };

    confirm();
  }, []); // Dépendances vides pour ne s'exécuter qu'une fois

  if (status === "pending") {
    return (
      <div className="h-full bg-white flex flex-col justify-center items-center text-center px-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p className="text-gray-600">Confirmation en cours...</p>
      </div>
    );
  }

  return (
    <div className="h-full bg-white flex flex-col justify-center">
      <div className="px-6 flex flex-col items-center text-center">
        <h1 className="text-[28px] font-semibold mt-8 mb-4 px-4">
          {status === "success" ? "Ready to go !" : "Erreur"}
        </h1>

        <img
          src={
            status === "success"
              ? "https://em-content.zobj.net/source/microsoft-teams/363/ok-hand_1f44c.png"
              : "https://em-content.zobj.net/source/microsoft-teams/363/cross-mark_274c.png"
          }
          alt="status"
          className="w-40 h-40 my-8"
        />

        <p className="text-gray-600 px-4 mb-10">{message}</p>
      </div>

      <div className="px-6 pb-8 space-y-3">
        <Button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/profile")}
          disabled={status !== "success"}
          className={`w-full py-4 rounded-xl font-medium transition-colors ${
            status === "success"
              ? "bg-black text-white hover:bg-gray-800"
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
        >
          Return to my profile !
        </Button>

        {status === "error" && (
          <Button
            onClick={() => navigate("/")}
            className="w-full py-4 rounded-xl font-medium bg-gray-100 text-gray-700 hover:bg-gray-200"
          >
            Retour à l'accueil
          </Button>
        )}
      </div>
    </div>
  );
}
