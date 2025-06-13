import React, { useState, useMemo } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Button from "../../ui/MotionButton";
import Input from "../../ui/Input";
import { Link } from "react-router-dom";
import { useUser } from "../../../contexts/UserContext";

// Regex for special char
const specialCharRegex = /[ !"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]/;

const registerSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  email: Yup.string()
    .email("Enter a valid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "At least 8 characters")
    .matches(/[A-Z]/, "At least one uppercase letter")
    .matches(/\d/, "At least one number")
    .matches(specialCharRegex, "At least one special character")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Please confirm your password"),
  isRgdAccepted: Yup.boolean().oneOf(
    [true],
    "You must accept the terms and conditions"
  ),
});

const passwordCriteria = [
  { label: "At least 8 characters", test: (v) => v.length >= 8 },
  { label: "Uppercase letter", test: (v) => /[A-Z]/.test(v) },
  { label: "Number", test: (v) => /\d/.test(v) },
  { label: "Special character", test: (v) => specialCharRegex.test(v) },
];

const RegisterForm = ({ handleContinue }) => {
  const { signup } = useUser();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isValid },
  } = useForm({
    resolver: yupResolver(registerSchema),
    mode: "onChange",
  });

  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const password = watch("password") || "";

  // Memoized password checks for performance
  const passwordChecks = useMemo(
    () => passwordCriteria.map((c) => ({ ...c, valid: c.test(password) })),
    [password]
  );
  const passwordStrength = passwordChecks.filter((c) => c.valid).length;
  const passwordStrengthText =
    passwordStrength === 4
      ? "Very Strong"
      : passwordStrength >= 2
      ? "Medium"
      : "Weak";

  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await signup(data);
      if (response.success) {
        toast.success(response.message);
        await handleContinue(data);
      } else {
        toast.error(response.message || "Registration error");
      }
    } catch {
      toast.error("Server error. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="h-full bg-white flex flex-col px-6"
      noValidate
      aria-live="polite"
    >
      <h1 className="text-[28px] font-semibold mt-4 mb-4 text-black">
        Create your account
      </h1>
      <div className="space-y-4">
        <Input
          label="Username"
          placeholder="Username"
          autoComplete="username"
          {...register("username")}
          error={errors.username?.message}
          aria-invalid={!!errors.username}
          aria-describedby="register-username-error"
        />
        <Input
          label="Email"
          type="email"
          placeholder="Email"
          autoComplete="email"
          {...register("email")}
          error={errors.email?.message}
          aria-invalid={!!errors.email}
          aria-describedby="register-email-error"
        />
        <Input
          label="Password"
          type="password"
          placeholder="Password"
          autoComplete="new-password"
          {...register("password")}
          error={errors.password?.message}
          aria-invalid={!!errors.password}
          aria-describedby="register-password-error"
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
            Password strength: {passwordStrengthText}
          </div>
          {tooltipVisible && (
            <div className="absolute bg-gray-700 text-white text-xs p-4 rounded-md w-48 mt-2 z-10 shadow-lg">
              <ul>
                {passwordChecks.map((criteria, idx) => (
                  <li
                    key={idx}
                    className={
                      criteria.valid ? "text-green-500" : "text-red-500"
                    }
                  >
                    {criteria.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <Input
          label="Confirm Password"
          type="password"
          placeholder="Confirm Password"
          autoComplete="new-password"
          {...register("confirmPassword")}
          error={errors.confirmPassword?.message}
          aria-invalid={!!errors.confirmPassword}
          aria-describedby="register-confirmpassword-error"
        />
        <div className="flex items-center space-x-2">
          <input
            id="isRgdAccepted"
            type="checkbox"
            className="w-5 h-5 rounded border-2 border-gray-400 text-blue-500 focus:ring-2 focus:ring-blue-500"
            {...register("isRgdAccepted")}
            required
          />
          <label
            htmlFor="isRgdAccepted"
            className="text-sm text-gray-600 cursor-pointer select-none"
          >
            I accept the{" "}
            <Link
              to="/terms-and-conditions"
              className="text-blue-500 underline"
            >
              terms and conditions
            </Link>
          </label>
        </div>
        {errors.isRgdAccepted && (
          <p className="text-xs text-red-500" id="register-rgd-error">
            {errors.isRgdAccepted.message}
          </p>
        )}
      </div>
      <div className="mt-4">
        <Button
          type="submit"
          disabled={!isValid || isLoading}
          className={`w-full bg-black text-white py-4 rounded-xl font-medium mt-4 ${
            !isValid || isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Loading..." : "Continue"}
        </Button>
      </div>
    </form>
  );
};
export default RegisterForm;
