import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Button from "../../ui/MotionButton";
import { checkEmailValidation } from "../../../apis/auth.api";
import { getCurrentUser } from "../../../apis/auth.api.js"; // or adjust for your paths
import { useUser } from "../../../contexts/UserContext";

const ConfirmMail = ({ handleBack, handleContinue }) => {
  const { tempUser, setTempUser, setUser } = useUser();
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (!tempUser?.email) return;
    // Start polling backend for confirmation every 5 seconds
    const interval = setInterval(async () => {
      try {
        const res = await checkEmailValidation(tempUser.email);
        console.log("Réponse checkEmailValidation:", res);
        if (res?.validated) {
          setValidated(true);
          clearInterval(interval);
          // Fetch actual user object from backend and update context
          getCurrentUser().then((user) => {
            setUser(user);
            setTempUser(null);
          });
        }
      } catch (error) {
        console.error("Erreur lors de la vérification d'email :", error);
      }
    }, 5000);

    // Listen for BroadcastChannel in case user confirms in another tab
    const bc = new BroadcastChannel("mail_verification_channel");
    bc.onmessage = (event) => {
      console.log("Message BroadcastChannel reçu :", event.data);
      if (event.data.verified && event.data.userId) {
        setValidated(true);
        // Always fetch current user from backend (with proper id/fields)
        getCurrentUser().then((user) => {
          setUser(user);
          setTempUser(null);
        });
        clearInterval(interval);
      }
    };
    return () => {
      clearInterval(interval);
      bc.close();
    };
  }, [tempUser, setTempUser, setUser]);

  return (
    <div className="h-full bg-white flex flex-col justify-center">
      <div className="px-6 flex flex-col items-center text-center">
        <h1 className="text-[28px] font-semibold mt-8 mb-4 px-4">
          Veuillez confirmer votre mail
        </h1>
        <motion.img
          src="https://em-content.zobj.net/source/microsoft-teams/363/incoming-envelope_1f4e8.png"
          alt="Email emoji"
          className="w-40 h-40 my-8"
          animate={{ x: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />
        <p className="text-gray-600 px-4 mb-10">
          Un email de confirmation vient de vous être envoyé. Merci de vérifier
          votre boîte mail et de cliquer sur le lien pour activer votre compte.
        </p>
      </div>
      <div className="px-6 pb-8 space-y-3">
        <Button
          whileTap={{ scale: 0.95 }}
          className={`w-full py-4 rounded-xl font-medium ${
            validated ? "bg-black text-white" : "bg-gray-300 text-gray-500"
          }`}
          onClick={handleContinue}
          disabled={!validated}
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};
export default ConfirmMail;
