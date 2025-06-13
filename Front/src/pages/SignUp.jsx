import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";
import { toast } from "react-toastify";
import GenderSelection from "../components/User/UpdateStep/GenderSelection";
import AgeSelection from "../components/User/UpdateStep/AgeSelection";
import HeightSelection from "../components/User/UpdateStep/HeightSelection";
import WeightSelection from "../components/User/UpdateStep/WeightSelection ";
import RegisterForm from "../components/User/Register/RegisterForm";
import RegisterFinalSelection from "../components/User/Register/RegisterFinalSelection";
import StepWrapper from "../components/User/Register/StepWrapper";
import RegisterDone from "../components/User/Register/RegisterDone";
import ConfirmMail from "../components/User/Register/ConfirmMail";
import { BASE_URL } from "../utils/url";

const stepsConfig = [
  {
    // 0
    component: RegisterForm,
    hideSkip: true,
    hideHeader: false,
    required: true,
  },
  {
    // 1
    component: (props) => (
      <ConfirmMail {...props} email={props.tempUser?.email || ""} />
    ),
    hideSkip: true,
    required: true,
  },
  {
    // 2
    component: GenderSelection,
    required: true,
  },
  {
    // 3
    component: AgeSelection,
    required: true,
  },
  {
    // 4
    component: HeightSelection,
    required: true,
  },
  {
    // 5
    component: (props) => (
      <WeightSelection
        {...props}
        title="Select current weight"
        step="current"
        isRequired={true}
      />
    ),
    required: true,
  },
  {
    // 6
    component: (props) => (
      <WeightSelection
        {...props}
        title="Select goal weight"
        step="goal"
        isRequired={false}
      />
    ),
    required: false,
  },
  {
    // 7
    component: RegisterFinalSelection,
    required: false,
  },
  {
    // 8
    component: RegisterDone,
    required: false,
    hideSkip: true,
  },
];

const SignUp = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const navigate = useNavigate();
  const { user, setUser, tempUser, setTempUser } = useUser();
  const stepConfig = stepsConfig[stepIndex];

  useEffect(() => {
    if (tempUser?._id) {
      setUser((prev) => ({ ...prev, ...tempUser }));
      setTempUser(null);
    }
  }, [tempUser, setUser, setTempUser]);

  const nextStep = () =>
    setStepIndex((i) => (i < stepsConfig.length - 1 ? i + 1 : i));

  const prevStep = () => setStepIndex((i) => (i > 0 ? i - 1 : navigate(-1)));

  // central update function (simpler)
  const updateUserData = (formData) => {
    // For early steps, update tempUser, else user
    if (stepIndex <= 2) setTempUser((prev) => ({ ...prev, ...formData }));
    else setUser((prev) => ({ ...prev, ...formData }));
  };

  const handleContinue = async (formData) => {
    if (formData) {
      updateUserData(formData);
    }

    // Save user data for relevant steps (adapt to your needs)
    if (stepIndex === 5 || stepIndex === 6) {
      try {
        // Could move this to a helper function, see previous advice
        const userId = user._id || tempUser?._id;
        if (!userId) throw new Error("User ID manquant");
        const allowedFields = [
          "gender",
          "age",
          "height",
          "heightUnit",
          "currentWeight",
          "currentWeightUnit",
          "goalWeight",
          "goalWeightUnit",
        ];
        const filteredUserData = {};
        allowedFields.forEach((field) => {
          if (formData[field] !== undefined)
            filteredUserData[field] = formData[field];
          else if (user[field] !== undefined)
            filteredUserData[field] = user[field];
        });
        const bodyToSend = { userId, ...filteredUserData };
        const res = await fetch(`${BASE_URL}/auth/update-optional`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyToSend),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage =
            errorData?.message || "Erreur lors de l’envoi des données.";
          throw new Error(errorMessage);
        }
        const data = await res.json();
        setUser(data.user);
      } catch (err) {
        toast.error("Erreur lors de la mise à jour du profil : " + err.message);
        return;
      }
    }
    nextStep();
  };

  // Call each step as a component with right props
  const Step = stepConfig.component;
  return (
    <StepWrapper
      step={stepIndex + 1}
      totalSteps={stepsConfig.length}
      handleBack={prevStep}
      handleContinue={handleContinue}
      hideHeader={!!stepConfig.hideHeader}
      hideSkip={!!stepConfig.hideSkip}
    >
      <Step
        formData={tempUser}
        user={user}
        tempUser={tempUser}
        handleContinue={handleContinue}
        handleBack={prevStep}
        navigate={navigate}
        setStep={setStepIndex}
        // passes more props as needed for your steps
      />
    </StepWrapper>
  );
};

export default SignUp;
