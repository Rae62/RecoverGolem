import { useState } from "react";
import { useWorkout } from "../context/WorkoutContext";
import { Plus, Trash2, Save, AlertCircle } from "lucide-react";

const WorkoutForm = () => {
  const { addWorkout, exercises, addExercise } = useWorkout();
  const [formData, setFormData] = useState({
    exercise: "",
    sets: [{ reps: "", weight: "" }],
    notes: "",
  });
  const [newExercise, setNewExercise] = useState("");
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.exercise) {
      newErrors.exercise = "Please select an exercise";
    }

    formData.sets.forEach((set, index) => {
      if (!set.reps || set.reps <= 0) {
        newErrors[`reps_${index}`] = "Reps must be greater than 0";
      }
      if (!set.weight || set.weight <= 0) {
        newErrors[`weight_${index}`] = "Weight must be greater than 0";
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const sanitizedData = {
        exercise: formData.exercise.trim(),
        sets: formData.sets.map((set) => ({
          reps: parseInt(set.reps, 10),
          weight: parseFloat(set.weight),
        })),
        notes: formData.notes.trim(),
      };

      addWorkout(sanitizedData);

      // Reset form
      setFormData({
        exercise: "",
        sets: [{ reps: "", weight: "" }],
        notes: "",
      });
      setErrors({});

      // Show success animation
      const successMsg = document.createElement("div");
      successMsg.className =
        "fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce-subtle";
      successMsg.textContent = "Workout added successfully!";
      document.body.appendChild(successMsg);

      setTimeout(() => {
        successMsg.remove();
      }, 3000);
    } catch (error) {
      console.error("Error adding workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSet = () => {
    setFormData((prev) => ({
      ...prev,
      sets: [...prev.sets, { reps: "", weight: "" }],
    }));
  };

  const removeSet = (index) => {
    if (formData.sets.length > 1) {
      setFormData((prev) => ({
        ...prev,
        sets: prev.sets.filter((_, i) => i !== index),
      }));
    }
  };

  const updateSet = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      sets: prev.sets.map((set, i) =>
        i === index ? { ...set, [field]: value } : set
      ),
    }));

    // Clear specific error when user starts typing
    if (errors[`${field}_${index}`]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[`${field}_${index}`];
        return newErrors;
      });
    }
  };

  const handleAddNewExercise = () => {
    if (newExercise.trim()) {
      addExercise(newExercise.trim());
      setFormData((prev) => ({ ...prev, exercise: newExercise.trim() }));
      setNewExercise("");
      setShowNewExercise(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card p-8 animate-slide-up">
        <div className="flex items-center space-x-3 mb-8">
          <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <Plus className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Add New Workout
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              Track your progress with detailed workout data
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Exercise Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Exercise
            </label>
            <div className="flex space-x-2">
              <select
                value={formData.exercise}
                onChange={(e) => {
                  setFormData((prev) => ({
                    ...prev,
                    exercise: e.target.value,
                  }));
                  if (errors.exercise) {
                    setErrors((prev) => ({ ...prev, exercise: undefined }));
                  }
                }}
                className={`input-field flex-1 ${
                  errors.exercise ? "border-red-500" : ""
                }`}
              >
                <option value="">Select an exercise</option>
                {exercises.map((exercise) => (
                  <option key={exercise} value={exercise}>
                    {exercise}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => setShowNewExercise(!showNewExercise)}
                className="btn-outline px-3"
              >
                New
              </button>
            </div>
            {errors.exercise && (
              <div className="flex items-center space-x-2 text-red-600 text-sm animate-slide-down">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.exercise}</span>
              </div>
            )}
          </div>

          {/* New Exercise Input */}
          {showNewExercise && (
            <div className="space-y-2 animate-slide-down">
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                New Exercise Name
              </label>
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="Enter exercise name"
                  className="input-field flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddNewExercise}
                  className="btn-primary px-4"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Sets */}
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Sets
            </label>
            <div className="space-y-3">
              {formData.sets.map((set, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-8">
                    #{index + 1}
                  </span>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Reps"
                      value={set.reps}
                      onChange={(e) => updateSet(index, "reps", e.target.value)}
                      className={`input-field ${
                        errors[`reps_${index}`] ? "border-red-500" : ""
                      }`}
                      min="1"
                    />
                    {errors[`reps_${index}`] && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors[`reps_${index}`]}
                      </p>
                    )}
                  </div>
                  <div className="flex-1">
                    <input
                      type="number"
                      placeholder="Weight (lbs)"
                      value={set.weight}
                      onChange={(e) =>
                        updateSet(index, "weight", e.target.value)
                      }
                      className={`input-field ${
                        errors[`weight_${index}`] ? "border-red-500" : ""
                      }`}
                      min="0"
                      step="0.5"
                    />
                    {errors[`weight_${index}`] && (
                      <p className="text-red-600 text-xs mt-1">
                        {errors[`weight_${index}`]}
                      </p>
                    )}
                  </div>
                  {formData.sets.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSet(index)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addSet}
              className="btn-outline w-full flex items-center justify-center space-x-2"
            >
              <Plus className="w-4 h-4" />
              <span>Add Set</span>
            </button>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
              Notes (Optional)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add any notes about your workout..."
              rows={3}
              className="input-field resize-none"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`btn-primary w-full flex items-center justify-center space-x-2 ${
              isSubmitting ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <Save className="w-5 h-5" />
            <span>{isSubmitting ? "Saving..." : "Save Workout"}</span>
          </button>
        </form>
      </div>
    </div>
  );
};

export default WorkoutForm;
