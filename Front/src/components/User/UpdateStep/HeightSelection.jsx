import { useState } from "react";
import Button from "../../ui/MotionButton";
import { toast } from "react-toastify";

const HeightSelection = ({
  initialHeight = "",
  initialHeightUnit = "cm",
  handleContinue,
  handleBack,
  title = "Select height",
}) => {
  const [height, setHeight] = useState(initialHeight.toString());
  const [heightUnit, setHeightUnit] = useState(initialHeightUnit);

  const handleHeightChange = (value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setHeight(value);
    }
  };

  const handleUnitChange = (unit) => {
    setHeightUnit(unit);
  };

  const onContinue = () => {
    if (height === "") {
      toast.error("Please enter your height.");
      return;
    }

    if (heightUnit === "cm") {
      const num = Number(height);
      if (num < 100 || num > 200) {
        toast.error("Height must be between 100 cm and 200 cm.");
        return;
      }
    }

    handleContinue({
      height: Number(height),
      heightUnit,
    });
  };

  return (
    <div className="h-full bg-white flex flex-col px-6">
      <h1 className="text-2xl font-semibold mt-8 mb-8 text-black text-center">
        {title}
      </h1>

      <div className="flex rounded-xl bg-[#F7F7F7] p-1 mb-8">
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
            heightUnit === "ft" ? "bg-white shadow" : "text-opacity-50"
          }`}
          onClick={() => handleUnitChange("ft")}
        >
          Feet
        </button>
        <button
          className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
            heightUnit === "cm" ? "bg-white shadow" : "text-opacity-50"
          }`}
          onClick={() => handleUnitChange("cm")}
        >
          Centimeter
        </button>
      </div>

      <div className="flex justify-center">
        <input
          type="tel"
          inputMode="numeric"
          pattern="[0-9]*"
          value={height}
          onChange={(e) => handleHeightChange(e.target.value)}
          placeholder="180"
          className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-1/3 text-black rounded-md"
        />
        <div className="text-center text-lg flex items-center text-black">
          {heightUnit}
        </div>
      </div>

      <Button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
          !height ? "opacity-50" : ""
        }`}
        disabled={!height}
      >
        Continue
      </Button>
    </div>
  );
};

export default HeightSelection;
