import { motion } from "framer-motion";

const MotionButton = motion.button;

export default function Button({
  children,
  className = "",
  loading = false,
  disabled,
  ...props
}) {
  return (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      className={`py-4 rounded-sm font-semibold transition-all duration-200 
        ${
          loading || disabled
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : ""
        }
        ${className}`}
      disabled={loading || disabled}
      {...props}
    >
      {loading ? "Chargement..." : children}
    </MotionButton>
  );
}
