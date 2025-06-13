import { useState } from "react";
import Button from "../../ui/MotionButton";
import { toast } from "react-toastify";

const AgeSelection = ({
  initialAge = "",
  handleContinue,
  handleBack,
  title = "Select age",
}) => {
  const [age, setAge] = useState(initialAge.toString());

  const handleAgeChange = (value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setAge(value);
    }
  };

  const onContinue = () => {
    if (age === "") {
      toast.error("Please enter your age.");
      return;
    }

    const num = Number(age);
    if (num < 18 || num > 100) {
      toast.error(
        "You must be at least 18 years old and maximum 100 years old."
      );
      return;
    }

    handleContinue({ age: num });
  };

  return (
    <div className="h-full bg-white flex flex-col px-6">
      <h1 className="text-2xl font-semibold mt-8 mb-8 text-black text-center">
        {title}
      </h1>

      <div className="flex justify-center">
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={age}
          onChange={(e) => handleAgeChange(e.target.value)}
          placeholder="18"
          className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-1/3 text-black rounded-md"
        />
      </div>

      <Button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
          !age ? "opacity-50" : ""
        }`}
        disabled={!age}
      >
        Continue
      </Button>
    </div>
  );
};

export default AgeSelection;
