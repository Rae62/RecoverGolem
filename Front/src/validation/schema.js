import * as yup from "yup";

// Training plan name schema
export const trainingPlanNameSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Training plan name is required")
    .min(3, "Name must be at least 3 characters")
    .max(50, "Name must be less than 50 characters"),
});

// Exercise schema for creating new exercises
export const exerciseSchema = yup.object({
  name: yup
    .string()
    .trim()
    .required("Exercise name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must be less than 50 characters"),
  sets: yup
    .number()
    .required("Number of sets is required")
    .integer("Sets must be a whole number")
    .min(1, "Minimum 1 set required")
    .max(20, "Maximum 20 sets allowed"),
  reps: yup
    .number()
    .required("Number of reps is required")
    .integer("Reps must be a whole number")
    .min(1, "Minimum 1 rep required")
    .max(100, "Maximum 100 reps allowed"),
  weight: yup
    .number()
    .required("Weight is required")
    .min(0, "Weight must be 0 or greater")
    .max(1000, "Weight must be less than 1000"),
  recuperation: yup
    .number()
    .required("Recuperation time is required")
    .integer("Recuperation must be a whole number")
    .min(0, "Recuperation must be 0 or greater")
    .max(600, "Recuperation must be less than 600 seconds"),
});

// Schema for recording actual performance
export const performanceSchema = yup.object({
  reps: yup
    .number()
    .required("Actual reps is required")
    .integer("Reps must be a whole number")
    .min(0, "Reps must be 0 or greater")
    .max(100, "Reps must be less than 100"),
  weight: yup
    .number()
    .required("Actual weight is required")
    .min(0, "Weight must be 0 or greater")
    .max(1000, "Weight must be less than 1000"),
});
