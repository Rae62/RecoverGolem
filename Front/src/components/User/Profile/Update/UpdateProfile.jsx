import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import { toast } from "react-toastify";
import UsernameSelection from "../../UpdateStep/UsernameSelection";
import GenderSelection from "../../UpdateStep/GenderSelection";
import AgeSelection from "../../UpdateStep/AgeSelection";
import HeightSelection from "../../UpdateStep/HeightSelection";
import WeightSelection from "../../UpdateStep/WeightSelection ";
import StepWrapper from "./UpdateStepWrapper";
import { BASE_URL } from "../../../../utils/url";

const UpdateProfile = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();
  const { user, setUser } = useUser();
  const [originalUser, setOriginalUser] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user && !originalUser) {
      setOriginalUser({ ...user });
    }
  }, [user, originalUser]);

  useEffect(() => {
    if (originalUser && user) {
      const fieldsToCheck = [
        "username",
        "gender",
        "age",
        "height",
        "heightUnit",
        "currentWeight",
        "currentWeightUnit",
        "goalWeight",
        "goalWeightUnit",
      ];
      const changed = fieldsToCheck.some(
        (field) => originalUser[field] !== user[field]
      );
      setHasChanges(changed);
    }
  }, [user, originalUser]);

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      if (hasChanges) {
        const confirm = window.confirm(
          "You have unsaved changes. Are you sure you want to leave?"
        );
        if (confirm) {
          navigate(-1);
        }
      } else {
        navigate(-1);
      }
    }
  };

  const handleContinue = async (formData) => {
    if (formData) {
      setUser((prev) => ({ ...prev, ...formData }));
    }

    // Username validation - step 1
    if (step === 1) {
      const username = formData?.username ?? user?.username;
      if (!username || username.trim() === "") {
        toast.error("Please enter a username.");
        return;
      }
      if (!/^[a-zA-Z0-9_.]{3,30}$/.test(username)) {
        toast.error(
          "Username must be 3-30 characters, letters, numbers, underscores or dots only."
        );
        return;
      }
    }

    // Gender validation can be added here if needed (step === 2)

    // Age validation (step 3)
    if (step === 3) {
      const age = formData?.age ?? user?.age;
      if (age !== undefined && age !== null && age !== "") {
        if (age < 12 || age > 120) {
          toast.error("Age must be between 12 and 120.");
          return;
        }
      }
    }

    // Height validation (step 4)
    if (step === 4) {
      const height = formData?.height ?? user?.height;
      const heightUnit = formData?.heightUnit ?? user?.heightUnit ?? "cm";
      if (heightUnit === "cm" && height) {
        if (height < 100 || height > 200) {
          toast.error("Height must be between 100 cm and 200 cm.");
          return;
        }
      }
    }

    // Weight validations (current = 5, goal = 6)
    if (step === 5 || step === 6) {
      const weightKey = step === 5 ? "currentWeight" : "goalWeight";
      const weightUnitKey = step === 5 ? "currentWeightUnit" : "goalWeightUnit";
      const weight = formData?.[weightKey] ?? user?.[weightKey];
      const weightUnit =
        formData?.[weightUnitKey] ?? user?.[weightUnitKey] ?? "Kg";
      if (weight !== "" && weight !== null && weight !== undefined) {
        if (weightUnit.toLowerCase() === "kg") {
          if (weight < 30 || weight > 300) {
            toast.error(
              `Weight must be between 30 kg and 300 kg (${
                step === 5 ? "current weight" : "goal weight"
              }).`
            );
            return;
          }
        } else {
          if (weight < 66 || weight > 661) {
            toast.error(
              `Weight must be between 66 lbs and 661 lbs (${
                step === 5 ? "current weight" : "goal weight"
              }).`
            );
            return;
          }
        }
      }
    }

    if (step === 6) {
      if (!hasChanges) {
        toast.info("No changes to save.");
        navigate(-1);
        return;
      }
      try {
        const userId = user._id;
        if (!userId) throw new Error("User ID missing");

        const allowedFields = [
          "username",
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
        for (const field of allowedFields) {
          let v = user[field];
          if (
            v !== undefined &&
            v !== null &&
            !(typeof v === "string" && v.trim() === "")
          ) {
            if (
              ["age", "height", "currentWeight", "goalWeight"].includes(
                field
              ) &&
              typeof v === "string"
            ) {
              v = Number(v);
            }
            filteredUserData[field] = v;
          }
        }

        const res = await fetch(`${BASE_URL}/auth/profile`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(filteredUserData),
        });
        if (!res.ok) {
          const errorData = await res.json().catch(() => null);
          const errorMessage = errorData?.message || "Error updating profile.";
          throw new Error(errorMessage);
        }
        const data = await res.json();
        setUser(data.user);
        setOriginalUser({ ...data.user });
        setHasChanges(false);
        toast.success("Profile updated successfully!");
        navigate(-1);
      } catch (error) {
        toast.error("Error updating profile: " + error.message);
        return;
      }
      return;
    }
    setStep(step + 1);
  };

  const handleSkip = () => {
    setStep(step + 1);
  };

  const steps = {
    1: (
      <UsernameSelection
        initialUsername={user?.username || ""}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update your username"
      />
    ),
    2: (
      <GenderSelection
        initialGender={user?.gender || ""}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update your gender"
      />
    ),
    3: (
      <AgeSelection
        initialAge={user?.age || ""}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update your age"
      />
    ),
    4: (
      <HeightSelection
        initialHeight={user?.height || ""}
        initialHeightUnit={user?.heightUnit || "cm"}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update your height"
      />
    ),
    5: (
      <WeightSelection
        initialWeight={user?.currentWeight || ""}
        initialWeightUnit={user?.currentWeightUnit || "Kg"}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update current weight"
        step="current"
        isRequired={false}
      />
    ),
    6: (
      <WeightSelection
        initialWeight={user?.goalWeight || ""}
        initialWeightUnit={user?.goalWeightUnit || "Kg"}
        handleContinue={handleContinue}
        handleBack={handleBack}
        title="Update goal weight"
        step="goal"
        isRequired={false}
      />
    ),
  };

  return (
    <StepWrapper
      step={step}
      totalSteps={6}
      handleBack={handleBack}
      handleContinue={handleSkip}
      hideHeader={false}
      hideSkip={false}
      title="Update Profile"
    >
      {steps[step] || null}
    </StepWrapper>
  );
};

export default UpdateProfile;
