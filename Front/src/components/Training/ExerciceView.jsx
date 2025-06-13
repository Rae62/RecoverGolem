import { useState, useEffect } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  Plus,
  Minus,
  Timer,
  Target,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const ExerciseView = ({ exerciseData, setCurrentView, onCompleteExercise }) => {
  const { getPreviousPerformance } = useWorkout();
  const [currentSetIndex, setCurrentSetIndex] = useState(0);
  const [completedSets, setCompletedSets] = useState([]);
  const [isResting, setIsResting] = useState(false);
  const [restTime, setRestTime] = useState(0);
  const [restDuration, setRestDuration] = useState(90); // Default 90 seconds
  const [showPerformanceModal, setShowPerformanceModal] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [customWeight, setCustomWeight] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    let interval;
    if (isResting && restTime > 0) {
      interval = setInterval(() => {
        setRestTime((prev) => {
          if (prev <= 1) {
            setIsResting(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isResting, restTime]);

  if (!exerciseData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          No exercise data available
        </p>
      </div>
    );
  }

  const currentSet = exerciseData.sets[currentSetIndex];
  const suggestion = exerciseData.suggestions?.[currentSetIndex];
  const previousPerformance = getPreviousPerformance(
    exerciseData.name,
    new Date()
  );
  const isLastSet = currentSetIndex === exerciseData.sets.length - 1;
  const totalSets = exerciseData.sets.length;

  const handleStartSet = () => {
    setShowPerformanceModal(true);
  };

  const handleSelectSuggestion = (type, value = null) => {
    let weight = currentSet.weight;
    let reps = currentSet.reps;

    switch (type) {
      case "add_rep":
        reps = currentSet.reps + 1;
        break;
      case "custom_weight":
        weight = parseFloat(customWeight) || currentSet.weight;
        break;
      case "same":
        // Keep current values
        break;
      case "progressive":
        if (suggestion) {
          weight = suggestion.weight;
          reps = suggestion.reps;
        }
        break;
    }

    setSelectedSuggestion({ type, weight, reps });
    setShowPerformanceModal(false);

    // Start the set with selected parameters
    startSetExecution({ weight, reps });
  };

  const startSetExecution = (setData) => {
    // Here you would implement the actual set execution
    // For now, we'll simulate completion after a short delay
    setTimeout(() => {
      completeSet(setData);
    }, 1000);
  };

  const completeSet = (setData) => {
    const completedSet = {
      ...setData,
      completed: true,
      timestamp: new Date().toISOString(),
    };

    setCompletedSets((prev) => [...prev, completedSet]);

    if (isLastSet) {
      // Exercise complete
      const exerciseComplete = {
        ...exerciseData,
        completedSets: [...completedSets, completedSet],
        notes,
      };
      exerciseData.onComplete?.(exerciseComplete);
      onCompleteExercise();
    } else {
      // Start rest period
      setRestTime(restDuration);
      setIsResting(true);
      setCurrentSetIndex((prev) => prev + 1);
    }
  };

  const skipRest = () => {
    setIsResting(false);
    setRestTime(0);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const adjustRestTime = (adjustment) => {
    setRestDuration((prev) => Math.max(30, prev + adjustment));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Exercise Header */}
      <div className="card p-6 animate-slide-up">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {exerciseData.name}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600 dark:text-gray-400">
            <span>
              Set {currentSetIndex + 1} of {totalSets}
            </span>
            <span>•</span>
            <span>
              {currentSet.reps} reps × {currentSet.weight} lbs
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(currentSetIndex / totalSets) * 100}%` }}
            ></div>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center">
            {completedSets.length} of {totalSets} sets completed
          </p>
        </div>
      </div>

      {/* Rest Timer */}
      {isResting && (
        <div className="card p-8 text-center animate-slide-up">
          <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Timer className="w-10 h-10 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Rest Time
          </h3>
          <div className="text-6xl font-bold text-blue-600 dark:text-blue-400 mb-4">
            {formatTime(restTime)}
          </div>

          <div className="flex items-center justify-center space-x-4 mb-6">
            <button
              onClick={() => adjustRestTime(-15)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {formatTime(restDuration)} default
            </span>
            <button
              onClick={() => adjustRestTime(15)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button onClick={skipRest} className="btn-primary px-6 py-3">
            Skip Rest
          </button>
        </div>
      )}

      {/* Current Set */}
      {!isResting && (
        <div className="card p-6 animate-slide-up">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Set {currentSetIndex + 1}
            </h3>
            <div className="text-3xl font-bold text-gray-900 dark:text-white">
              {currentSet.reps} reps × {currentSet.weight} lbs
            </div>
          </div>

          {/* Previous Performance */}
          {previousPerformance && (
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
              <div className="flex items-center space-x-2 mb-2">
                <TrendingUp className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  Last Week Performance
                </span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                {previousPerformance.sets.slice(0, 3).map((set, index) => (
                  <div key={index} className="text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Set {index + 1}
                    </p>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {set.reps} × {set.weight}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={handleStartSet}
            className="btn-primary w-full flex items-center justify-center space-x-2 text-lg py-4"
          >
            <Play className="w-6 h-6" />
            <span>Start Set</span>
          </button>
        </div>
      )}

      {/* Notes */}
      <div className="card p-6 animate-slide-up">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Exercise Notes
        </label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add notes about this exercise..."
          rows={3}
          className="input-field resize-none"
        />
      </div>

      {/* Performance Modal */}
      {showPerformanceModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full animate-scale-in">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
              Choose Your Performance
            </h3>

            {previousPerformance && (
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Last week:{" "}
                  {previousPerformance.sets[currentSetIndex]?.reps || 0} reps ×{" "}
                  {previousPerformance.sets[currentSetIndex]?.weight || 0} lbs
                </p>
              </div>
            )}

            <div className="space-y-3">
              {suggestion && (
                <button
                  onClick={() => handleSelectSuggestion("progressive")}
                  className="w-full p-4 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 rounded-lg text-left hover:bg-green-100 dark:hover:bg-green-800 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-200">
                        Progressive Overload
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        {suggestion.reps} reps × {suggestion.weight} lbs
                      </p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-green-600 dark:text-green-400" />
                  </div>
                </button>
              )}

              <button
                onClick={() => handleSelectSuggestion("add_rep")}
                className="w-full p-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg text-left hover:bg-blue-100 dark:hover:bg-blue-800 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-blue-800 dark:text-blue-200">
                      Add 1 Rep
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">
                      {currentSet.reps + 1} reps × {currentSet.weight} lbs
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
              </button>

              <div className="p-4 bg-purple-50 dark:bg-purple-900 border border-purple-200 dark:border-purple-700 rounded-lg">
                <p className="font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  Custom Weight
                </p>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    value={customWeight}
                    onChange={(e) => setCustomWeight(e.target.value)}
                    placeholder={currentSet.weight.toString()}
                    className="input-field flex-1"
                    step="0.5"
                  />
                  <button
                    onClick={() => handleSelectSuggestion("custom_weight")}
                    className="btn-primary px-4"
                  >
                    Use
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleSelectSuggestion("same")}
                className="w-full p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-left hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800 dark:text-gray-200">
                      Same as Planned
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {currentSet.reps} reps × {currentSet.weight} lbs
                    </p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                </div>
              </button>
            </div>

            <button
              onClick={() => setShowPerformanceModal(false)}
              className="w-full mt-4 btn-outline"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExerciseView;
