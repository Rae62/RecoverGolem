import { ChevronLeftIcon } from "@heroicons/react/16/solid";
import React from "react";

function RegisterHeader({
  step,
  totalSteps = 7,
  handleBack,
  handleContinue,
  hideSkip = false,
}) {
  return (
    <div className="flex items-center justify-between pt-3 bg-white">
      <button
        type="button"
        onClick={handleBack}
        aria-label="Back"
        className="p-2 -ml-2"
      >
        <ChevronLeftIcon className="w-6 h-6 text-black" />
      </button>
      <span className="text-sm text-gray-600">
        Step {step} of {totalSteps}
      </span>
      {hideSkip ? (
        <span
          className="text-sm font-medium text-gray-300 select-none"
          style={{ minWidth: 32 }}
        />
      ) : (
        <button
          type="button"
          onClick={handleContinue}
          className="text-sm font-medium text-gray-600"
        >
          Skip
        </button>
      )}
    </div>
  );
}

export default RegisterHeader;
