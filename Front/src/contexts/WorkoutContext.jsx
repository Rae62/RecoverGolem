import { createContext, useContext, useState, useEffect } from "react";
import { format, startOfWeek, addDays, isSameDay, parseISO } from "date-fns";

const WorkoutContext = createContext();

export const useWorkout = () => {
  const context = useContext(WorkoutContext);
  if (!context) {
    throw new Error("useWorkout must be used within a WorkoutProvider");
  }
  return context;
};

export const WorkoutProvider = ({ children }) => {
  const [workouts, setWorkouts] = useState(() => {
    const savedWorkouts = localStorage.getItem("workouts");
    return savedWorkouts ? JSON.parse(savedWorkouts) : [];
  });

  const [exercises, setExercises] = useState(() => {
    const savedExercises = localStorage.getItem("exercises");
    return savedExercises
      ? JSON.parse(savedExercises)
      : [
          "Bench Press",
          "Squat",
          "Deadlift",
          "Overhead Press",
          "Barbell Row",
          "Pull-ups",
          "Dips",
          "Incline Bench Press",
          "Romanian Deadlift",
          "Lunges",
        ];
  });

  const [workoutPlans, setWorkoutPlans] = useState(() => {
    const savedPlans = localStorage.getItem("workoutPlans");
    return savedPlans ? JSON.parse(savedPlans) : [];
  });

  const [weeklyTemplates, setWeeklyTemplates] = useState(() => {
    const savedTemplates = localStorage.getItem("weeklyTemplates");
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });

  useEffect(() => {
    localStorage.setItem("workouts", JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem("exercises", JSON.stringify(exercises));
  }, [exercises]);

  useEffect(() => {
    localStorage.setItem("workoutPlans", JSON.stringify(workoutPlans));
  }, [workoutPlans]);

  useEffect(() => {
    localStorage.setItem("weeklyTemplates", JSON.stringify(weeklyTemplates));
  }, [weeklyTemplates]);

  const addWorkout = (workout) => {
    const newWorkout = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      timestamp: new Date().toISOString(),
      ...workout,
    };
    setWorkouts((prev) => [newWorkout, ...prev]);
  };

  const updateWorkout = (id, updatedWorkout) => {
    setWorkouts((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...updatedWorkout } : w))
    );
  };

  const deleteWorkout = (id) => {
    setWorkouts((prev) => prev.filter((w) => w.id !== id));
  };

  const addExercise = (exerciseName) => {
    if (!exercises.includes(exerciseName)) {
      setExercises((prev) => [...prev, exerciseName]);
    }
  };

  // Workout Plan Management
  const createWorkoutPlan = (plan) => {
    const newPlan = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...plan,
    };
    setWorkoutPlans((prev) => [newPlan, ...prev]);
    return newPlan;
  };

  const updateWorkoutPlan = (id, updatedPlan) => {
    setWorkoutPlans((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedPlan } : p))
    );
  };

  const deleteWorkoutPlan = (id) => {
    setWorkoutPlans((prev) => prev.filter((p) => p.id !== id));
  };

  // Weekly Template Management
  const createWeeklyTemplate = (template) => {
    const newTemplate = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...template,
    };
    setWeeklyTemplates((prev) => [newTemplate, ...prev]);
    return newTemplate;
  };

  const updateWeeklyTemplate = (id, updatedTemplate) => {
    setWeeklyTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updatedTemplate } : t))
    );
  };

  const deleteWeeklyTemplate = (id) => {
    setWeeklyTemplates((prev) => prev.filter((t) => t.id !== id));
  };

  // Get planned workout for a specific date
  const getPlannedWorkout = (date) => {
    const dayOfWeek = format(date, "EEEE").toLowerCase();
    const activeTemplate = weeklyTemplates.find((t) => t.isActive);

    if (!activeTemplate) return null;

    return activeTemplate.days[dayOfWeek] || null;
  };

  // Get actual workout for a specific date
  const getActualWorkout = (date) => {
    const dateString = format(date, "yyyy-MM-dd");
    return workouts.filter((w) => w.date === dateString);
  };

  // Get previous performance for an exercise
  const getPreviousPerformance = (exerciseName, beforeDate) => {
    const previousWorkouts = workouts
      .filter(
        (w) => w.exercise === exerciseName && new Date(w.timestamp) < beforeDate
      )
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return previousWorkouts[0] || null;
  };

  // Calculate progressive overload suggestions
  const getProgressiveOverloadSuggestion = (exerciseName, currentSets) => {
    const lastWorkout = getPreviousPerformance(exerciseName, new Date());

    if (!lastWorkout) {
      return currentSets; // No previous data, use current plan
    }

    const suggestions = currentSets.map((plannedSet, index) => {
      const lastSet = lastWorkout.sets[index];

      if (!lastSet) {
        return plannedSet; // No previous set data
      }

      // Progressive overload logic
      let suggestedWeight = lastSet.weight;
      let suggestedReps = plannedSet.reps;

      // If they completed all reps last time, suggest weight increase
      if (lastSet.reps >= plannedSet.reps) {
        suggestedWeight = lastSet.weight + 2.5; // Increase by 2.5 lbs
      } else {
        // If they didn't complete all reps, keep same weight
        suggestedWeight = lastSet.weight;
      }

      return {
        ...plannedSet,
        weight: suggestedWeight,
        previousWeight: lastSet.weight,
        previousReps: lastSet.reps,
      };
    });

    return suggestions;
  };

  const getExerciseProgress = (exerciseName) => {
    return workouts
      .filter((w) => w.exercise === exerciseName)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  };

  const getPersonalRecord = (exerciseName) => {
    const exerciseWorkouts = workouts.filter(
      (w) => w.exercise === exerciseName
    );
    if (exerciseWorkouts.length === 0) return null;

    return exerciseWorkouts.reduce((max, current) => {
      const currentMax = Math.max(
        ...current.sets.map((set) => set.weight * set.reps)
      );
      const previousMax = max
        ? Math.max(...max.sets.map((set) => set.weight * set.reps))
        : 0;
      return currentMax > previousMax ? current : max;
    });
  };

  const getTotalVolume = (dateRange = "week") => {
    const now = new Date();
    const filtered = workouts.filter((w) => {
      const workoutDate = new Date(w.timestamp);
      const daysDiff = Math.ceil((now - workoutDate) / (1000 * 60 * 60 * 24));

      if (dateRange === "week") return daysDiff <= 7;
      if (dateRange === "month") return daysDiff <= 30;
      return true;
    });

    return filtered.reduce((total, workout) => {
      const workoutVolume = workout.sets.reduce(
        (sum, set) => sum + set.weight * set.reps,
        0
      );
      return total + workoutVolume;
    }, 0);
  };

  // Get week data for weekly view
  const getWeekData = (weekStart) => {
    const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

    return weekDays.map((day) => {
      const planned = getPlannedWorkout(day);
      const actual = getActualWorkout(day);

      return {
        date: day,
        dayName: format(day, "EEEE"),
        planned,
        actual,
        isCompleted: actual.length > 0,
        completionRate:
          planned && actual.length > 0
            ? (actual.length / planned.exercises.length) * 100
            : 0,
      };
    });
  };

  return (
    <WorkoutContext.Provider
      value={{
        workouts,
        exercises,
        workoutPlans,
        weeklyTemplates,
        addWorkout,
        updateWorkout,
        deleteWorkout,
        addExercise,
        createWorkoutPlan,
        updateWorkoutPlan,
        deleteWorkoutPlan,
        createWeeklyTemplate,
        updateWeeklyTemplate,
        deleteWeeklyTemplate,
        getPlannedWorkout,
        getActualWorkout,
        getPreviousPerformance,
        getProgressiveOverloadSuggestion,
        getExerciseProgress,
        getPersonalRecord,
        getTotalVolume,
        getWeekData,
      }}
    >
      {children}
    </WorkoutContext.Provider>
  );
};
