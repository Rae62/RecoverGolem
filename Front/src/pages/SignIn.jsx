import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import Input from "../components/ui/Input";
import { motion } from "framer-motion";
import { useState } from "react";
import BackArrow from "../components/ui/BackArrow";

const schema = yup.object().shape({
  email: yup.string().email("Email invalide").required("Email requis"),
  password: yup
    .string()
    .min(8, "Min 8caractères")
    .required("Mot de passe requis"),
});

function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const { login } = useUser();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await login(data);
      if (!result.success) {
        toast.error(result.message || "Erreur lors de la connexion");
        return;
      }
      toast.success("Connexion réussie !");
      navigate("/home");
    } catch (error) {
      toast.error("Erreur réseau ou serveur.");
    } finally {
      setLoading(false);
    }
  };

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
            className="text-[32px] font-bold tracking-tight text-gray-900"
          >
            Sign In
          </motion.h1>
          <div className="w-6" />
        </div>

        <motion.form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <Input
            type="email"
            placeholder="Email"
            autoFocus
            autoComplete="email"
            {...register("email")}
          />
          {errors.email && (
            <p className="text-red-500 text-sm -mt-3">{errors.email.message}</p>
          )}

          <Input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            {...register("password")}
          />
          {errors.password && (
            <p className="text-red-500 text-sm -mt-3">
              {errors.password.message}
            </p>
          )}

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            type="submit"
            disabled={loading}
            className={`w-full text-white py-3 rounded-xl font-medium text-base mt-1 shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-900"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          <Link
            to="/forgot-password"
            className="block text-center text-sm text-gray-400 mt-1 hover:underline"
          >
            Forgot Password?
          </Link>
        </motion.form>
      </div>
    </div>
  );
}

export default SignIn;
