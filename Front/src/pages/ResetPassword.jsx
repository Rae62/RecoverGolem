import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate, useParams } from "react-router-dom";
import { resetPassword } from "../apis/auth.api.js";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import BackArrow from "../components/ui/BackArrow.jsx";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const specialCharRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

  const schema = yup.object({
    password: yup
      .string()
      .min(8, "At least 8 characters")
      .matches(/[A-Z]/, "At least one uppercase letter")
      .matches(/\d/, "At least one number")
      .matches(specialCharRegex, "At least one special character")
      .required("Password is required"),

    confirmPassword: yup
      .string()
      .oneOf([yup.ref("password")], "Passwords must match")
      .required("Please confirm your password"),
  });

  const defaultValues = {
    password: "",
    confirmPassword: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  async function submit(values) {
    const response = await resetPassword({
      password: values.password,
      token: token,
    });

    if (response.messageOk) {
      toast.success(response.messageOk);
      navigate("/sign-in");
    } else {
      toast.error(response.message || "Une erreur est survenue");
      console.log("Token reçu :", token);
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
      <div className="absolute -z-10 top-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />
      <div className="w-full max-w-sm flex flex-col items-center justify-center">
        <div className="flex items-center justify-between pt-2 mb-6 w-full">
          <BackArrow />
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[28px] font-bold tracking-tight text-gray-900"
          >
            Reset Password
          </motion.h1>
          <div className="w-6" />
        </div>

        <motion.form
          onSubmit={handleSubmit(submit)}
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div className="flex flex-col mb-2">
            <input
              {...register("password")}
              type="password"
              placeholder="Nouveau mot de passe"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex flex-col mb-2">
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirmer le mot de passe"
              className="border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={!isValid}
            className={`w-full py-3 rounded-xl font-medium text-base mt-1 shadow-md transition
    ${
      isValid
        ? "bg-black text-white hover:bg-gray-900"
        : "bg-gray-300 text-gray-600 cursor-not-allowed"
    }`}
          >
            Confirmer
          </motion.button>
        </motion.form>
      </div>
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
