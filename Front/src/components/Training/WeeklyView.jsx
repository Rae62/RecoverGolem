import { useState } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import {
  format,
  startOfWeek,
  addWeeks,
  subWeeks,
  addDays,
  isSameDay,
} from "date-fns";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  TrendingUp,
  Target,
  Clock,
  Plus,
  Play,
} from "lucide-react";

const WeeklyView = ({ setCurrentView, onStartWorkout }) => {
  const {
    getWeekData,
    getPlannedWorkout,
    getActualWorkout,
    getProgressiveOverloadSuggestion,
  } = useWorkout();

  const [currentWeek, setCurrentWeek] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [selectedDay, setSelectedDay] = useState(null);

  const weekData = getWeekData(currentWeek);
  const today = new Date();

  const navigateWeek = (direction) => {
    if (direction === "prev") {
      setCurrentWeek((prev) => subWeeks(prev, 1));
    } else {
      setCurrentWeek((prev) => addWeeks(prev, 1));
    }
    setSelectedDay(null);
  };

  const selectDay = (day) => {
    setSelectedDay(day);
  };

  const startWorkout = (day) => {
    const planned = getPlannedWorkout(day.date);
    if (!planned || planned.isRestDay) return;

    const sessionData = {
      date: day.date,
      dayName: format(day.date, "EEEE"),
      plannedWorkout: planned,
      exercises: planned.exercises.map((exercise) => ({
        ...exercise,
        suggestions: getProgressiveOverloadSuggestion(
          exercise.name,
          exercise.sets
        ),
      })),
    };

    onStartWorkout(sessionData);
  };

  const getCompletionColor = (completionRate) => {
    if (completionRate === 0) return "text-gray-400";
    if (completionRate < 50) return "text-red-500";
    if (completionRate < 100) return "text-yellow-500";
    return "text-green-500";
  };

  const getDayStatus = (day) => {
    if (day.planned?.isRestDay) return "rest";
    if (day.isCompleted) return "completed";
    if (isSameDay(day.date, today)) return "today";
    if (day.date < today) return "missed";
    return "upcoming";
  };

  const getDayStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 dark:bg-green-900 border-green-500";
      case "today":
        return "bg-blue-100 dark:bg-blue-900 border-blue-500";
      case "missed":
        return "bg-red-100 dark:bg-red-900 border-red-500";
      case "rest":
        return "bg-gray-100 dark:bg-gray-700 border-gray-400";
      default:
        return "bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600";
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <CalendarDays className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Weekly View
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {format(currentWeek, "MMM dd")} -{" "}
                {format(addDays(currentWeek, 6), "MMM dd, yyyy")}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigateWeek("prev")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() =>
                setCurrentWeek(startOfWeek(new Date(), { weekStartsOn: 1 }))
              }
              className="btn-outline px-4 py-2"
            >
              Today
            </button>
            <button
              onClick={() => navigateWeek("next")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekData.map((day, index) => {
          const status = getDayStatus(day);
          const isSelected =
            selectedDay && isSameDay(selectedDay.date, day.date);

          return (
            <div
              key={day.dayName}
              onClick={() => selectDay(day)}
              className={`card p-4 cursor-pointer transition-all duration-200 animate-slide-up border-2 ${getDayStatusColor(
                status
              )} ${isSelected ? "ring-2 ring-primary-500" : ""}`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="text-center">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                  {day.dayName.slice(0, 3)}
                </h3>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {format(day.date, "d")}
                </p>

                {day.planned?.isRestDay ? (
                  <div className="text-center">
                    <span className="text-2xl mb-2 block">😴</span>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Rest Day
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-center">
                      {status === "completed" ? (
                        <CheckCircle className="w-6 h-6 text-green-500" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-400" />
                      )}
                    </div>

                    {day.planned && (
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {day.planned.exercises.length} exercise
                        {day.planned.exercises.length !== 1 ? "s" : ""}
                      </p>
                    )}

                    {day.isCompleted && (
                      <p className="text-xs text-green-600 dark:text-green-400">
                        {Math.round(day.completionRate)}% complete
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Day Detail */}
      {selectedDay && (
        <div className="card p-6 animate-slide-up">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {format(selectedDay.date, "EEEE, MMMM d, yyyy")}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {getDayStatus(selectedDay) === "today" && "Today • "}
                {selectedDay.planned?.isRestDay ? "Rest Day" : "Workout Day"}
              </p>
            </div>

            {selectedDay.planned &&
              !selectedDay.planned.isRestDay &&
              !selectedDay.isCompleted && (
                <button
                  onClick={() => startWorkout(selectedDay)}
                  className="btn-primary flex items-center space-x-2 text-lg px-6 py-3"
                >
                  <Play className="w-5 h-5" />
                  <span>Start Training</span>
                </button>
              )}
          </div>

          {selectedDay.planned?.isRestDay ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gray-200 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-4xl">😴</span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Rest Day
              </h4>
              <p className="text-gray-600 dark:text-gray-400">
                Take time to recover and prepare for your next workout
              </p>
            </div>
          ) : selectedDay.planned ? (
            <div className="space-y-6">
              {/* Planned Workout Overview */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                  <Target className="w-5 h-5 text-primary-600" />
                  <span>Today's Workout</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedDay.planned.exercises.map((exercise, index) => (
                    <div
                      key={exercise.id}
                      className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                    >
                      <h5 className="font-semibold text-gray-900 dark:text-white mb-2">
                        {exercise.name}
                      </h5>
                      <div className="space-y-1">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.sets.length} sets
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {exercise.sets[0]?.reps} reps ×{" "}
                          {exercise.sets[0]?.weight} lbs
                        </p>
                      </div>
                      {exercise.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                          {exercise.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Actual Workout */}
              {selectedDay.actual.length > 0 && (
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Completed Exercises</span>
                  </h4>
                  <div className="space-y-4">
                    {selectedDay.actual.map((workout, index) => (
                      <div
                        key={workout.id}
                        className="p-4 bg-green-50 dark:bg-green-900 rounded-lg"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-semibold text-gray-900 dark:text-white">
                            {workout.exercise}
                          </h5>
                          <span className="text-xs text-gray-600 dark:text-gray-400">
                            {format(new Date(workout.timestamp), "h:mm a")}
                          </span>
                        </div>
                        <div className="space-y-1">
                          {workout.sets.map((set, setIndex) => (
                            <div
                              key={setIndex}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="text-gray-600 dark:text-gray-400">
                                Set {setIndex + 1}
                              </span>
                              <span className="font-medium">
                                {set.reps} reps × {set.weight} lbs
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12">
              <Plus className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No Workout Planned
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Create a workout template to plan your training
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WeeklyView;
