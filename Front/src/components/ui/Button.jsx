import { motion } from "framer-motion";

function Button({
  children,
  size = "md",
  className = "",
  isLoading = false,
  disabled = false,
  onClick,
  type = "button",
  ...props
}) {
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-5 py-3 text-lg",
  };

  const buttonClass = `rounded transition focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed \
    ${sizeClasses[size] || sizeClasses.md} \
    ${className}`;

  const MotionButton = motion.button;

  return (
    <MotionButton
      whileTap={{ scale: 0.95 }}
      type={type}
      className={buttonClass}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...props}
    >
      {isLoading && (
        <span className="inline-block w-4 h-4 mr-2 align-middle border-2 border-t-transparent border-white rounded-full animate-spin"></span>
      )}
      {children}
    </MotionButton>
  );
}

export default Button;
