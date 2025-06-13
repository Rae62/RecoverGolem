import Button from "../../ui/MotionButton";
const RegisterDone = ({
  handleBack,
  handleContinue,
  navigate,
  step,
  setStep,
}) => {
  return (
    <div className="h-full bg-white flex flex-col justify-center">
      {/* Main content */}
      <div className="px-6  flex flex-col items-center text-center">
        <a className="text-[28px] font-semibold mt-8 mb-4 px-4" to="/home">
          Ready to go !
        </a>

        <img
          src="https://em-content.zobj.net/source/microsoft-teams/363/ok-hand_1f44c.png"
          alt="OK hand emoji"
          className="w-40 h-40 my-8"
        />

        <p className="text-gray-600 px-4 mb-10">
          You are ready to go ! Explore our app, use it daily and get stronger
          week by week
        </p>
      </div>

      {/* Buttons section */}
      <div className="px-6 pb-8 space-y-3">
        <Button
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            navigate("/Home");
          }}
          className="w-full bg-black text-white py-4 rounded-xl font-medium"
        >
          Let's start now!
        </Button>
      </div>
    </div>
  );
};

export default RegisterDone;
