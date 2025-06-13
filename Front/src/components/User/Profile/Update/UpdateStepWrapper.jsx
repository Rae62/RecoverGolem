import { motion, AnimatePresence } from "framer-motion";
import RegisterHeader from "./UpdateHeader";

const variants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
};

const UpdateStepWrapper = ({
  children,
  step,
  totalSteps = 7, // Default to 7 for register, can be overridden
  handleBack,
  handleContinue,
  hideHeader = false,
  hideSkip = false,
  title = null, // Optional custom title
}) => {
  return (
    <div className="flex flex-col h-full overflow-auto px-6 overflow-x-hidden">
      {!hideHeader && (
        <RegisterHeader
          step={step}
          totalSteps={totalSteps}
          handleBack={handleBack}
          handleContinue={handleContinue}
          hideSkip={hideSkip}
          title={title}
        />
      )}
      <div className="">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default UpdateStepWrapper;
