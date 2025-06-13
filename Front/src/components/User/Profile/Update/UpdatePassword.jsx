import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { changePassword } from "../../../../apis/auth.api";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../ui/MotionButton";
import Input from "../../../ui/Input";
import BackArrow from "../../../ui/BackArrow";

const specialCharRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

const passwordSchema = Yup.object({
  currentPassword: Yup.string().required("Mot de passe actuel requis"),
  newPassword: Yup.string()
    .min(8, "Au moins 8 caractères")
    .matches(/[A-Z]/, "Au moins une majuscule")
    .matches(/\d/, "Au moins un chiffre")
    .matches(specialCharRegex, "Au moins un caractère spécial")
    .required("Nouveau mot de passe requis"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("newPassword")], "Les mots de passe doivent correspondre")
    .required("Confirmation du mot de passe requise"),
});

const UpdatePassword = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm({
    resolver: yupResolver(passwordSchema),
    mode: "onChange",
  });

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const newPassword = watch("newPassword") || "";

  const passwordStrengthChecks = [
    newPassword.length >= 8,
    /[A-Z]/.test(newPassword),
    /\d/.test(newPassword),
    specialCharRegex.test(newPassword),
  ];

  const passwordStrength = passwordStrengthChecks.filter(Boolean).length;

  const passwordCriteria = [
    { label: "Au moins 8 caractères", valid: newPassword.length >= 8 },
    { label: "Majuscule", valid: /[A-Z]/.test(newPassword) },
    { label: "Chiffre", valid: /\d/.test(newPassword) },
    { label: "Caractère spécial", valid: specialCharRegex.test(newPassword) },
  ];

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await changePassword(
        {
          userId: user._id,
          ...data,
        },
        user.token
      );
      if (response.messageOk) {
        toast.success(response.messageOk);
        reset();
        navigate("/");
      } else {
        toast.error(response.message || "Erreur lors de la modification");
      }
    } catch (err) {
      toast.error("Erreur lors de la modification du mot de passe.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-white px-4 overflow-hidden">
      {/* Gradient Blob */}
      <div className="absolute -z-10 top-0 left-1/2 w-[28rem] h-[28rem] -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-tr from-blue-200 via-purple-200 to-pink-200 opacity-60 blur-3xl animate-blob" />

      <div className="w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between pt-2 mb-6">
          <BackArrow />
          <h1 className="text-[28px] font-bold text-gray-900">
            Modifier le mot de passe
          </h1>
          <div className="w-6" />
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="bg-white flex flex-col space-y-4"
          noValidate
        >
          <Input
            label="Mot de passe actuel"
            type="password"
            placeholder="Mot de passe actuel"
            autoComplete="current-password"
            {...register("currentPassword")}
            error={errors.currentPassword?.message}
          />

          <Input
            label="Nouveau mot de passe"
            type="password"
            placeholder="Nouveau mot de passe"
            autoComplete="new-password"
            {...register("newPassword")}
            error={errors.newPassword?.message}
            onFocus={() => setTooltipVisible(true)}
            onBlur={() => setTooltipVisible(false)}
          />

          <div className="w-full relative">
            <div className="h-2 mb-2 bg-gray-200 rounded-full">
              <div
                className={`h-2 rounded-full ${
                  passwordStrength === 4
                    ? "bg-green-500"
                    : passwordStrength >= 2
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{ width: `${(passwordStrength / 4) * 100}%` }}
              />
            </div>

            <div
              className="text-xs text-blue-500 cursor-pointer underline select-none"
              onMouseEnter={() => setTooltipVisible(true)}
              onMouseLeave={() => setTooltipVisible(false)}
            >
              Force du mot de passe :{" "}
              {passwordStrength === 4
                ? "Très fort"
                : passwordStrength >= 2
                ? "Moyen"
                : "Faible"}
            </div>

            {tooltipVisible && (
              <div className="absolute bg-gray-700 text-white text-xs p-4 rounded-md w-56 mt-2 z-10 shadow-lg">
                <ul>
                  {passwordCriteria.map((criteria, index) => (
                    <li
                      key={index}
                      className={`${
                        criteria.valid ? "text-green-500" : "text-red-500"
                      }`}
                    >
                      {criteria.label}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <Input
            label="Confirmer le nouveau mot de passe"
            type="password"
            placeholder="Confirmer le nouveau mot de passe"
            autoComplete="new-password"
            {...register("confirmPassword")}
            error={errors.confirmPassword?.message}
          />
          <Button
            type="submit"
            disabled={!isValid || isLoading}
            className={`w-full py-3 rounded-xl font-medium text-base mt-1 shadow-md transition ${
              !isValid || isLoading
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-900"
            }`}
          >
            {isLoading ? "Chargement..." : "Modifier le mot de passe"}
          </Button>
        </form>
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
};

export default UpdatePassword;
