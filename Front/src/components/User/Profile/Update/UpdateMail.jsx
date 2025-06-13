import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { requestEmailChange } from "../../../../apis/auth.api.js";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { motion } from "framer-motion";
import BackArrow from "../../../ui/BackArrow.jsx";

// Validation du champ email
const schema = yup.object().shape({
  newEmail: yup
    .string()
    .required("L'email est requis")
    .email("Format d'email invalide"),
});

export default function UpdateMail() {
  const { user } = useUser();
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: { newEmail: user?.email || "" },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (user?.email) {
      setValue("newEmail", user.email);
    }
  }, [user?.email, setValue]);

  const onSubmit = async ({ newEmail }) => {
    setLoading(true);
    setMessage(null);

    try {
      await requestEmailChange(newEmail);
      setMessage(
        "Un lien de confirmation a été envoyé à votre nouvelle adresse."
      );
    } catch (err) {
      setMessage(err.message || "Erreur lors de la demande.");
    }

    setLoading(false);
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
      {/* Gradient Blob */}
      <div className="absolute -z-10 top-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />

      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        {/* Header with BackArrow */}
        <div className="flex items-center justify-between pt-2 mb-6 w-full">
          <BackArrow />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[28px] font-bold tracking-tight text-gray-900"
          >
            Changer d’e-mail
          </motion.h1>
          <div className="w-6" />
        </div>

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-col mb-2">
            <input
              type="email"
              placeholder="Nouvelle adresse e-mail"
              {...register("newEmail")}
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.newEmail && (
              <p className="text-red-500 text-sm mt-1">
                {errors.newEmail.message}
              </p>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading || !isValid}
            className={`w-full py-3 rounded-xl font-medium text-base mt-1 shadow-md transition
              ${
                loading || !isValid
                  ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                  : "bg-black text-white hover:bg-gray-900"
              }`}
          >
            {loading ? "Envoi..." : "Demander le changement"}
          </motion.button>

          {message && (
            <p className="text-sm text-gray-600 mt-2 text-center">{message}</p>
          )}
        </motion.form>
      </div>

      {/* Blob Animation */}
      <style>{`
        @keyframes blob {
          0%,100% { transform: scale(1) translate(-50%,-33%); }
          33% { transform: scale(1.05,0.95) translate(-50%,-33%); }
          66% { transform: scale(0.95,1.05) translate(-50%,-33%); }
        }
        .animate-blob {
          animation: blob 8s infinite linear;
        }
      `}</style>
    </div>
  );
}
