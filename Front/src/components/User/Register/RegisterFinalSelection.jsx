import Button from "../../ui/MotionButton";

const RegisterFinalSelection = ({
  handleBack,
  handleContinue,
  navigate,
  step,
  setStep,
}) => {
  const FinishRegister = (setStep = 7);
  return (
    <div className="h-full bg-white flex flex-col ">
      {/* Main content */}
      <div className="px-6  flex flex-col items-center text-center">
        <h1 className="text-[28px] font-semibold mt-8 mb-4 px-4">
          Would you like to enter your training information now?
        </h1>

        <img
          src="https://em-content.zobj.net/source/microsoft-teams/363/thinking-face_1f914.png"
          alt="Thinking emoji"
          className="w-28 h-28 my-8"
        />

        <p className="text-gray-600 px-4 mb-10">
          Enter your training information now and let's start creating your
          progressive overload!
        </p>
      </div>

      {/* Buttons section */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigate("/AddTraining");
          }}
          className="w-full bg-black text-white py-4 rounded-xl font-medium"
        >
          Let's create it now!
        </Button>

        <Button
          whileTap={{ scale: 0.95 }}
          onClick={handleContinue}
          className="w-full bg-black text-white py-4 rounded-xl font-medium"
        >
          Hmm, nah maybe later
        </Button>
      </div>
    </div>
  );
};

export default RegisterFinalSelection;
