import { useState } from "react";
import Button from "../../ui/MotionButton";

const GenderSelection = ({
  initialGender = "",
  handleContinue,
  handleBack,
  title = "Choose your gender",
}) => {
  const [selectedGender, setSelectedGender] = useState(initialGender);

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
  };

  const onContinue = () => {
    handleContinue({ gender: selectedGender.toLowerCase() });
  };

  return (
    <div className="h-full bg-white flex flex-col px-6 ">
      <h1 className="text-[28px] font-semibold mt-8 mb-8">{title}</h1>

      <div className="space-y-4">
        {[
          {
            value: "Female",
            emoji: "👱‍♀️",
            label: "Woman",
            description: "Train like a queen.",
          },
          {
            value: "Male",
            emoji: "👱‍♂️",
            label: "Man",
            description: "Unleash your beast mode.",
          },
          {
            value: "Other",
            emoji: "🤔",
            label: "Other",
            description: "We'll personalize it for you.",
          },
        ].map((option) => (
          <button
            key={option.value}
            onClick={() => handleGenderSelect(option.value)}
            className={`w-full flex items-center justify-between px-4 py-4 rounded-2xl border transition cursor-pointer ${
              selectedGender === option.value
                ? "border-black bg-[#F8F8F8]"
                : "border-gray-200"
            }`}
          >
            <div className="flex items-center">
              <span className="text-3xl mr-4">{option.emoji}</span>
              <div className="text-left">
                <p className="font-medium text-black">{option.label}</p>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>

      <Button
        whileTap={{ scale: 0.95 }}
        onClick={onContinue}
        className={`w-full bg-black text-white py-4 rounded-xl font-medium mt-6 ${
          !selectedGender ? "opacity-50" : ""
        }`}
        disabled={!selectedGender}
      >
        Continue
      </Button>
    </div>
  );
};

export default GenderSelection;
