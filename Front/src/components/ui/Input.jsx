// Input.js
import React from "react";

const Input = ({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  className = "",
  autoComplete,
  required = false,
  error,
  onBlur,
  ...rest
}) => {
  const uniqueSuffix = Math.random().toString(36).substring(2, 9);
  const inputId =
    id || `input-${label?.toLowerCase().replace(/\s+/g, "-")}-${uniqueSuffix}`;

  return (
    <div className="flex flex-col space-y-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500"> *</span>}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        autoComplete={autoComplete}
        aria-label={label || placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-500" : "border-gray-300"
        } focus:outline-none focus:ring-2 ${
          error ? "focus:ring-red-400" : "focus:ring-blue-500"
        } ${className}`}
        {...rest}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
};

export default Input;
