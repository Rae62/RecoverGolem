import { useState } from "react";
import Button from "../../ui/MotionButton";
import { toast } from "react-toastify";
import * as Yup from "yup";

// Secure username schema with Yup
const usernameSchema = Yup.string()
  .required("Please enter a username.")
  .min(3, "Username must be at least 3 characters.")
  .max(30, "Username must be at most 30 characters.")
  .matches(
    /^[a-zA-Z0-9_.]+$/,
    "Username can only contain letters, numbers, underscores, and dots."
  )
  .matches(
    /^(?!.*[_.]{2}).*$/,
    "Username cannot have consecutive underscores or dots."
  )
  .matches(
    /^(?![_.])(?!.*[_.]$).*$/,
    "Username cannot start or end with an underscore or dot."
  )
  .notOneOf(
    [
      "admin",
      "administrator",
      "root",
      "superuser",
      "support",
      "null",
      "undefined",
      "yourusername",
    ],
    "This username is not allowed."
  );

const UsernameSelection = ({
  initialUsername = "",
  handleContinue,
  handleBack,
  title = "Choose a username",
}) => {
  const [username, setUsername] = useState(initialUsername);
  const [loading, setLoading] = useState(false);

  const handleUsernameChange = (value) => {
    setUsername(value);
  };

  // You could add an async function here to check availability via backend, if you wish

  const onContinue = async () => {
    setLoading(true);
    try {
      await usernameSchema.validate(username.trim());
      // All validations pass
      handleContinue({ username: username.trim() });
    } catch (error) {
      toast.error(error.message || "Invalid username.");
    }
    setLoading(false);
  };

  return (
    <div className="h-full bg-white flex flex-col px-6">
      <h1 className="text-2xl font-semibold mt-8 mb-8 text-black text-center">
        {title}
      </h1>
      <div className="flex justify-center">
        <input
          type="text"
          value={username}
          onChange={(e) => handleUsernameChange(e.target.value)}
          placeholder="your.username"
          className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-2/3 text-black rounded-md"
          maxLength={30}
          autoComplete="username"
        />
      </div>
      <Button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
          !username ? "opacity-50" : ""
        }`}
        disabled={!username || loading}
      >
        Continue
      </Button>
    </div>
  );
};

export default UsernameSelection;
