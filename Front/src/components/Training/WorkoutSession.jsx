import { useState } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { format } from "date-fns";
import {
  Play,
  CheckCircle,
  Clock,
  Target,
  Edit3,
  SkipForward,
  Calendar,
} from "lucide-react";

const WorkoutSession = ({ sessionData, setCurrentView, onStartExercise }) => {
  const { addWorkout } = useWorkout();
  const [completedExercises, setCompletedExercises] = useState([]);

  if (!sessionData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No workout session data available
        </p>
      </div>
    );
  }

  const handleStartExercise = (exercise, index) => {
    const exerciseData = {
      ...exercise,
      sessionData,
      exerciseIndex: index,
      onComplete: (completedExercise) => {
        // Update completed exercises state
        setCompletedExercises((prev) => {
          const newCompleted = prev.filter((ex) => ex.exerciseIndex !== index);
          return [
            ...newCompleted,
            { ...completedExercise, exerciseIndex: index, completed: true },
          ];
        });

        // Add workout to history
        addWorkout({
          exercise: completedExercise.name,
          sets: completedExercise.completedSets,
          notes: completedExercise.notes || "",
        });
      },
    };
    onStartExercise(exerciseData);
  };

  const handleSkipExercise = (exerciseIndex) => {
    const exercise = sessionData.exercises[exerciseIndex];
    setCompletedExercises((prev) => {
      const newCompleted = prev.filter(
        (ex) => ex.exerciseIndex !== exerciseIndex
      );
      return [
        ...newCompleted,
        {
          ...exercise,
          exerciseIndex,
          skipped: true,
          completed: false,
        },
      ];
    });
  };

  const isExerciseCompleted = (exerciseIndex) => {
    return completedExercises.some(
      (ex) => ex.exerciseIndex === exerciseIndex && ex.completed && !ex.skipped
    );
  };

  const isExerciseSkipped = (exerciseIndex) => {
    return completedExercises.some(
      (ex) => ex.exerciseIndex === exerciseIndex && ex.skipped
    );
  };

  const completedCount = completedExercises.filter(
    (ex) => ex.completed && !ex.skipped
  ).length;
  const totalExercises = sessionData.exercises.length;
  const progressPercentage =
    totalExercises > 0 ? (completedCount / totalExercises) * 100 : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {sessionData.dayName} Workout
              </h1>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4" />
                <span>{format(sessionData.date, "MMMM d, yyyy")}</span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
              {completedCount}/{totalExercises}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Exercises
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
          <div
            className="bg-gradient-to-r from-primary-500 to-accent-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
          {Math.round(progressPercentage)}% Complete
        </p>
      </div>

      {/* Exercise List */}
      <div className="space-y-4">
        {sessionData.exercises.map((exercise, index) => {
          const isCompleted = isExerciseCompleted(index);
          const isSkipped = isExerciseSkipped(index);
          const totalSets = exercise.sets.length;
          const estimatedTime = totalSets * 3; // Assuming 3 minutes per set (including rest)

          return (
            <div
              key={exercise.id}
              className={`card p-6 animate-slide-up transition-all duration-300 ${
                isCompleted
                  ? "bg-green-50 dark:bg-green-900 border-green-500"
                  : isSkipped
                  ? "bg-gray-100 dark:bg-gray-700 border-gray-400 opacity-60"
                  : "hover:shadow-lg"
              }`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        isCompleted
                          ? "bg-green-100 dark:bg-green-800"
                          : isSkipped
                          ? "bg-gray-200 dark:bg-gray-600"
                          : "bg-primary-100 dark:bg-primary-900"
                      }`}
                    >
                      {isCompleted ? (
                        <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                      ) : (
                        <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {exercise.name}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <span>{totalSets} sets</span>
                        <span className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>~{estimatedTime} min</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Set Preview */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                    {exercise.sets.slice(0, 3).map((set, setIndex) => (
                      <div
                        key={setIndex}
                        className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                            Set {setIndex + 1}
                          </span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {set.reps} × {set.weight} lbs
                          </span>
                        </div>
                      </div>
                    ))}
                    {exercise.sets.length > 3 && (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          +{exercise.sets.length - 3} more
                        </span>
                      </div>
                    )}
                  </div>

                  {exercise.notes && (
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <strong>Notes:</strong> {exercise.notes}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col space-y-2 ml-6">
                  {!isCompleted && !isSkipped && (
                    <>
                      <button
                        onClick={() => handleStartExercise(exercise, index)}
                        className="btn-primary flex items-center space-x-2 px-4 py-3"
                      >
                        <Play className="w-5 h-5" />
                        <span>Start</span>
                      </button>

                      <button className="btn-outline flex items-center space-x-2 px-4 py-2">
                        <Edit3 className="w-4 h-4" />
                        <span>Edit</span>
                      </button>

                      <button
                        onClick={() => handleSkipExercise(index)}
                        className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 flex items-center space-x-2 px-4 py-2 transition-colors"
                      >
                        <SkipForward className="w-4 h-4" />
                        <span>Skip</span>
                      </button>
                    </>
                  )}

                  {isCompleted && (
                    <div className="flex items-center space-x-2 text-green-600 dark:text-green-400">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Completed</span>
                    </div>
                  )}

                  {isSkipped && (
                    <div className="flex items-center space-x-2 text-gray-500">
                      <SkipForward className="w-5 h-5" />
                      <span className="font-medium">Skipped</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Session Complete */}
      {completedCount === totalExercises && totalExercises > 0 && (
        <div className="card p-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Workout Complete!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Great job! You've completed all exercises for today.
          </p>
          <button
            onClick={() => setCurrentView("weekly-view")}
            className="btn-primary px-6 py-3"
          >
            Back to Weekly View
          </button>
        </div>
      )}
    </div>
  );
};

export default WorkoutSession;
