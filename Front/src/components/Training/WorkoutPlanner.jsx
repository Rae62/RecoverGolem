import { useState } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Plus,
  Trash2,
  Save,
  Copy,
  Edit3,
  CheckCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
} from "lucide-react";

const WorkoutPlanner = () => {
  const {
    weeklyTemplates,
    exercises,
    createWeeklyTemplate,
    updateWeeklyTemplate,
    deleteWeeklyTemplate,
    addExercise,
  } = useWorkout();

  const [activeTemplate, setActiveTemplate] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showNewExercise, setShowNewExercise] = useState(false);
  const [newExercise, setNewExercise] = useState("");
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  const daysOfWeek = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

  const [templateForm, setTemplateForm] = useState({
    name: "",
    description: "",
    days: daysOfWeek.reduce(
      (acc, day) => ({
        ...acc,
        [day]: {
          isRestDay: false,
          exercises: [],
        },
      }),
      {}
    ),
  });

  const createNewTemplate = () => {
    setTemplateForm({
      name: "",
      description: "",
      days: daysOfWeek.reduce(
        (acc, day) => ({
          ...acc,
          [day]: {
            isRestDay: false,
            exercises: [],
          },
        }),
        {}
      ),
    });
    setActiveTemplate(null);
    setIsEditing(true);
    setCurrentDayIndex(0);
  };

  const editTemplate = (template) => {
    setTemplateForm(template);
    setActiveTemplate(template);
    setIsEditing(true);
    setCurrentDayIndex(0);
  };

  const saveTemplate = () => {
    if (!templateForm.name.trim()) return;

    if (activeTemplate) {
      updateWeeklyTemplate(activeTemplate.id, templateForm);
    } else {
      createWeeklyTemplate(templateForm);
    }

    setIsEditing(false);
    setActiveTemplate(null);
    setCurrentDayIndex(0);
  };

  const nextDay = () => {
    if (currentDayIndex < daysOfWeek.length - 1) {
      setCurrentDayIndex((prev) => prev + 1);
    }
  };

  const prevDay = () => {
    if (currentDayIndex > 0) {
      setCurrentDayIndex((prev) => prev - 1);
    }
  };

  const goToDay = (index) => {
    setCurrentDayIndex(index);
  };

  const addExerciseToDay = (day) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: [
            ...prev.days[day].exercises,
            {
              id: Date.now().toString(),
              name: "",
              sets: [{ reps: "", weight: "" }],
              notes: "",
            },
          ],
        },
      },
    }));
  };

  const updateExercise = (day, exerciseId, field, value) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: prev.days[day].exercises.map((ex) =>
            ex.id === exerciseId ? { ...ex, [field]: value } : ex
          ),
        },
      },
    }));
  };

  const addSetToExercise = (day, exerciseId) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: prev.days[day].exercises.map((ex) =>
            ex.id === exerciseId
              ? { ...ex, sets: [...ex.sets, { reps: "", weight: "" }] }
              : ex
          ),
        },
      },
    }));
  };

  const updateSet = (day, exerciseId, setIndex, field, value) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: prev.days[day].exercises.map((ex) =>
            ex.id === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.map((set, index) =>
                    index === setIndex ? { ...set, [field]: value } : set
                  ),
                }
              : ex
          ),
        },
      },
    }));
  };

  const removeExercise = (day, exerciseId) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: prev.days[day].exercises.filter(
            (ex) => ex.id !== exerciseId
          ),
        },
      },
    }));
  };

  const removeSet = (day, exerciseId, setIndex) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          exercises: prev.days[day].exercises.map((ex) =>
            ex.id === exerciseId
              ? {
                  ...ex,
                  sets: ex.sets.filter((_, index) => index !== setIndex),
                }
              : ex
          ),
        },
      },
    }));
  };

  const toggleRestDay = (day) => {
    setTemplateForm((prev) => ({
      ...prev,
      days: {
        ...prev.days,
        [day]: {
          ...prev.days[day],
          isRestDay: !prev.days[day].isRestDay,
          exercises: !prev.days[day].isRestDay ? [] : prev.days[day].exercises,
        },
      },
    }));
  };

  const setActiveWeeklyTemplate = (templateId) => {
    // Deactivate all templates
    weeklyTemplates.forEach((template) => {
      if (template.isActive) {
        updateWeeklyTemplate(template.id, { ...template, isActive: false });
      }
    });

    // Activate selected template
    const template = weeklyTemplates.find((t) => t.id === templateId);
    if (template) {
      updateWeeklyTemplate(templateId, { ...template, isActive: true });
    }
  };

  const handleAddNewExercise = () => {
    if (newExercise.trim()) {
      addExercise(newExercise.trim());
      setNewExercise("");
      setShowNewExercise(false);
    }
  };

  const currentDay = daysOfWeek[currentDayIndex];
  const currentDayData = templateForm.days[currentDay];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Calendar className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Workout Planner
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Create and manage your weekly workout templates
              </p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={createNewTemplate}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>New Template</span>
            </button>
          )}
        </div>
      </div>

      {/* Template List */}
      {!isEditing && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {weeklyTemplates.map((template, index) => (
            <div
              key={template.id}
              className="card p-6 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {template.name}
                  </h3>
                  {template.description && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                      {template.description}
                    </p>
                  )}
                  {template.isActive && (
                    <div className="flex items-center space-x-2 text-green-600 text-sm">
                      <CheckCircle className="w-4 h-4" />
                      <span>Active Template</span>
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => editTemplate(template)}
                    className="p-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteWeeklyTemplate(template.id)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {daysOfWeek.map((day, dayIndex) => {
                  const dayData = template.days[day];
                  return (
                    <div
                      key={day}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {dayLabels[dayIndex]}
                      </span>
                      <span className="text-gray-600 dark:text-gray-400">
                        {dayData.isRestDay
                          ? "Rest Day"
                          : `${dayData.exercises.length} exercise${
                              dayData.exercises.length !== 1 ? "s" : ""
                            }`}
                      </span>
                    </div>
                  );
                })}
              </div>

              {!template.isActive && (
                <button
                  onClick={() => setActiveWeeklyTemplate(template.id)}
                  className="btn-outline w-full"
                >
                  Set as Active
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Template Editor */}
      {isEditing && (
        <div className="space-y-6">
          {/* Template Info */}
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {activeTemplate ? "Edit Template" : "Create New Template"}
              </h3>
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setCurrentDayIndex(0);
                  }}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  onClick={saveTemplate}
                  className="btn-primary flex items-center space-x-2"
                >
                  <Save className="w-4 h-4" />
                  <span>Save Template</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Template Name
                </label>
                <input
                  type="text"
                  value={templateForm.name}
                  onChange={(e) =>
                    setTemplateForm((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g., Push/Pull/Legs"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Description (Optional)
                </label>
                <input
                  type="text"
                  value={templateForm.description}
                  onChange={(e) =>
                    setTemplateForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Brief description of this template"
                  className="input-field"
                />
              </div>
            </div>
          </div>

          {/* Day Navigation */}
          <div className="card p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={prevDay}
                disabled={currentDayIndex === 0}
                className={`p-3 rounded-lg transition-colors ${
                  currentDayIndex === 0
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <div className="flex-1 text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {dayLabels[currentDayIndex]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Day {currentDayIndex + 1} of 7
                </p>
              </div>

              <button
                onClick={nextDay}
                disabled={currentDayIndex === daysOfWeek.length - 1}
                className={`p-3 rounded-lg transition-colors ${
                  currentDayIndex === daysOfWeek.length - 1
                    ? "text-gray-400 cursor-not-allowed"
                    : "text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Day Dots Navigation */}
            <div className="flex justify-center space-x-2">
              {daysOfWeek.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToDay(index)}
                  className={`w-3 h-3 rounded-full transition-colors ${
                    index === currentDayIndex
                      ? "bg-primary-600"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* New Exercise Input */}
          {showNewExercise && (
            <div className="card p-6 animate-slide-down">
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Add New Exercise
              </h4>
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={newExercise}
                  onChange={(e) => setNewExercise(e.target.value)}
                  placeholder="Enter exercise name"
                  className="input-field flex-1"
                />
                <button onClick={handleAddNewExercise} className="btn-primary">
                  Add
                </button>
                <button
                  onClick={() => setShowNewExercise(false)}
                  className="btn-outline"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Current Day Editor */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentDayIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
              className="card p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {dayLabels[currentDayIndex]} Workout
                </h4>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={currentDayData.isRestDay}
                    onChange={() => toggleRestDay(currentDay)}
                    className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Rest Day
                  </span>
                </label>
              </div>

              {!currentDayData.isRestDay ? (
                <div className="space-y-6">
                  {currentDayData.exercises.map((exercise, exerciseIndex) => (
                    <motion.div
                      key={exercise.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: exerciseIndex * 0.1 }}
                      className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <select
                          value={exercise.name}
                          onChange={(e) =>
                            updateExercise(
                              currentDay,
                              exercise.id,
                              "name",
                              e.target.value
                            )
                          }
                          className="input-field flex-1 mr-3"
                        >
                          <option value="">Select exercise</option>
                          {exercises.map((ex) => (
                            <option key={ex} value={ex}>
                              {ex}
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() =>
                            removeExercise(currentDay, exercise.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="space-y-3">
                        <h5 className="font-medium text-gray-900 dark:text-white">
                          Sets
                        </h5>
                        {exercise.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex items-center space-x-3"
                          >
                            <span className="text-sm font-medium text-gray-600 dark:text-gray-400 w-12">
                              Set {setIndex + 1}
                            </span>
                            <input
                              type="number"
                              placeholder="Reps"
                              value={set.reps}
                              onChange={(e) =>
                                updateSet(
                                  currentDay,
                                  exercise.id,
                                  setIndex,
                                  "reps",
                                  e.target.value
                                )
                              }
                              className="input-field flex-1"
                            />
                            <input
                              type="number"
                              placeholder="Weight (lbs)"
                              value={set.weight}
                              onChange={(e) =>
                                updateSet(
                                  currentDay,
                                  exercise.id,
                                  setIndex,
                                  "weight",
                                  e.target.value
                                )
                              }
                              className="input-field flex-1"
                              step="0.5"
                            />
                            {exercise.sets.length > 1 && (
                              <button
                                onClick={() =>
                                  removeSet(currentDay, exercise.id, setIndex)
                                }
                                className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() =>
                            addSetToExercise(currentDay, exercise.id)
                          }
                          className="btn-outline w-full text-sm py-2"
                        >
                          Add Set
                        </button>
                      </div>

                      <input
                        type="text"
                        placeholder="Notes (optional)"
                        value={exercise.notes}
                        onChange={(e) =>
                          updateExercise(
                            currentDay,
                            exercise.id,
                            "notes",
                            e.target.value
                          )
                        }
                        className="input-field text-sm"
                      />
                    </motion.div>
                  ))}

                  <div className="flex space-x-3">
                    <button
                      onClick={() => addExerciseToDay(currentDay)}
                      className="btn-outline flex-1 flex items-center justify-center space-x-2 py-4"
                    >
                      <Plus className="w-5 h-5" />
                      <span>Add Exercise</span>
                    </button>
                    <button
                      onClick={() => setShowNewExercise(true)}
                      className="btn-outline px-6"
                    >
                      New Exercise
                    </button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">😴</span>
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    Rest Day
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">
                    Take time to recover and prepare for your next workout
                  </p>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Navigation Footer */}
          <div className="flex justify-between items-center">
            <button
              onClick={prevDay}
              disabled={currentDayIndex === 0}
              className={`btn-outline flex items-center space-x-2 ${
                currentDayIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous Day</span>
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {currentDayIndex + 1} of {daysOfWeek.length}
              </p>
            </div>

            <button
              onClick={nextDay}
              disabled={currentDayIndex === daysOfWeek.length - 1}
              className={`btn-primary flex items-center space-x-2 ${
                currentDayIndex === daysOfWeek.length - 1
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              <span>Next Day</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkoutPlanner;
