import { useState } from "react";
import Button from "../../ui/MotionButton";
import { toast } from "react-toastify";

const WeightSelection = ({
  initialWeight = "",
  initialWeightUnit = "Kg",
  handleContinue,
  handleBack,
  title = "Select weight",
  step = "current", // "current" or "goal"
  isRequired = false, // For current weight it's required, for goal it's optional
}) => {
  const [weight, setWeight] = useState(initialWeight.toString());
  const [weightUnit, setWeightUnit] = useState(initialWeightUnit);

  const handleWeightChange = (value) => {
    if (value === "" || /^\d*$/.test(value)) {
      setWeight(value);
    }
  };

  const handleUnitChange = (unit) => {
    setWeightUnit(unit);
  };

  const onContinue = () => {
    // Validate weight only if filled or if required
    if (isRequired && weight === "") {
      toast.error(`Please enter your ${step} weight.`);
      return;
    }

    if (weight !== "") {
      const numWeight = Number(weight);
      if (weightUnit === "Kg" && (numWeight < 30 || numWeight > 300)) {
        toast.error(
          `${
            step === "current" ? "Current" : "Goal"
          } weight must be between 30 and 300 kg`
        );
        return;
      }
      if (weightUnit === "Lb" && (numWeight < 66 || numWeight > 661)) {
        toast.error(
          `${
            step === "current" ? "Current" : "Goal"
          } weight must be between 66 and 661 lbs`
        );
        return;
      }
    }

    const weightKey = step === "current" ? "currentWeight" : "goalWeight";
    const weightUnitKey =
      step === "current" ? "currentWeightUnit" : "goalWeightUnit";

    handleContinue({
      [weightKey]: weight === "" ? null : Number(weight),
      [weightUnitKey]: weightUnit,
    });
  };

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="px-6 flex-1">
        <h1 className="text-2xl font-semibold mt-4 mb-8 text-black text-center">
          {title}
        </h1>

        <div className="flex rounded-xl bg-[#F7F7F7] p-1 mb-8">
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
              weightUnit === "Lb" ? "bg-white shadow" : "text-opacity-50"
            }`}
            onClick={() => handleUnitChange("Lb")}
          >
            Pounds
          </button>
          <button
            className={`flex-1 py-2 rounded-lg text-sm font-medium text-black ${
              weightUnit === "Kg" ? "bg-white shadow" : "text-opacity-50"
            }`}
            onClick={() => handleUnitChange("Kg")}
          >
            Kilograms
          </button>
        </div>

        <div className="flex justify-center">
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            value={weight}
            onChange={(e) => handleWeightChange(e.target.value)}
            placeholder="75"
            className="m-4 text-center border border-gray-400 focus-within:border-black flex items-center justify-center h-auto min-h-[56px] w-1/3 text-black rounded-md"
          />
          <div className="text-center text-lg flex items-center text-black">
            {weightUnit}
          </div>
        </div>

        <Button
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className={`w-full bg-black text-white py-4 rounded-xl font-medium ${
            isRequired && !weight ? "opacity-50" : ""
          }`}
          disabled={isRequired && !weight}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default WeightSelection;
