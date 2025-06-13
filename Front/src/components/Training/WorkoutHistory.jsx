import { useState } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import { format } from "date-fns";
import {
  History,
  Search,
  Filter,
  Calendar,
  Trash2,
  Edit3,
  ChevronDown,
  ChevronUp,
  Target,
  Clock,
} from "lucide-react";

const WorkoutHistory = () => {
  const { workouts, deleteWorkout } = useWorkout();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExercise, setSelectedExercise] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState("desc");
  const [expandedWorkouts, setExpandedWorkouts] = useState(new Set());

  const uniqueExercises = [...new Set(workouts.map((w) => w.exercise))].sort();

  const filteredWorkouts = workouts
    .filter((workout) => {
      const matchesSearch =
        workout.exercise.toLowerCase().includes(searchTerm.toLowerCase()) ||
        workout.notes.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesExercise =
        !selectedExercise || workout.exercise === selectedExercise;
      return matchesSearch && matchesExercise;
    })
    .sort((a, b) => {
      let aValue, bValue;

      switch (sortBy) {
        case "date":
          aValue = new Date(a.timestamp);
          bValue = new Date(b.timestamp);
          break;
        case "exercise":
          aValue = a.exercise.toLowerCase();
          bValue = b.exercise.toLowerCase();
          break;
        case "volume":
          aValue = a.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
          bValue = b.sets.reduce((sum, set) => sum + set.weight * set.reps, 0);
          break;
        default:
          return 0;
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const toggleWorkoutExpansion = (workoutId) => {
    const newExpanded = new Set(expandedWorkouts);
    if (newExpanded.has(workoutId)) {
      newExpanded.delete(workoutId);
    } else {
      newExpanded.add(workoutId);
    }
    setExpandedWorkouts(newExpanded);
  };

  const handleDelete = (workoutId) => {
    if (confirm("Are you sure you want to delete this workout?")) {
      deleteWorkout(workoutId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
            <History className="w-6 h-6 text-primary-600 dark:text-primary-400" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Workout History
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {filteredWorkouts.length} workout
              {filteredWorkouts.length !== 1 ? "s" : ""} found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search workouts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>

          {/* Exercise Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="input-field pl-10"
            >
              <option value="">All exercises</option>
              {uniqueExercises.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="input-field"
          >
            <option value="date">Sort by Date</option>
            <option value="exercise">Sort by Exercise</option>
            <option value="volume">Sort by Volume</option>
          </select>

          {/* Sort Order */}
          <button
            onClick={() =>
              setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
            className="btn-outline flex items-center justify-center space-x-2"
          >
            <span>{sortOrder === "asc" ? "Ascending" : "Descending"}</span>
            {sortOrder === "asc" ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Workout List */}
      {filteredWorkouts.length === 0 ? (
        <div className="card p-12 text-center">
          <History className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No workouts found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {workouts.length === 0
              ? "You haven't logged any workouts yet. Start your fitness journey!"
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredWorkouts.map((workout, index) => {
            const isExpanded = expandedWorkouts.has(workout.id);
            const totalVolume = workout.sets.reduce(
              (sum, set) => sum + set.weight * set.reps,
              0
            );
            const maxWeight = Math.max(
              ...workout.sets.map((set) => set.weight)
            );

            return (
              <div
                key={workout.id}
                className="card p-6 animate-slide-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-primary-100 dark:bg-primary-900 rounded-lg">
                      <Target className="w-6 h-6 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {workout.exercise}
                      </h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>
                            {format(
                              new Date(workout.timestamp),
                              "MMM dd, yyyy"
                            )}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-4 h-4" />
                          <span>
                            {format(new Date(workout.timestamp), "h:mm a")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleWorkoutExpansion(workout.id)}
                      className="btn-outline px-3 py-2"
                    >
                      {isExpanded ? (
                        <ChevronUp className="w-4 h-4" />
                      ) : (
                        <ChevronDown className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleDelete(workout.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">
                      {workout.sets.length}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Sets
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-lg font-bold text-primary-600 dark:text-primary-400">
                      {maxWeight} lbs
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Max Weight
                    </p>
                  </div>
                  <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <p className="text-lg font-bold text-secondary-600 dark:text-secondary-400">
                      {totalVolume.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      Total Volume
                    </p>
                  </div>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="animate-slide-down">
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                        Set Details
                      </h4>
                      <div className="grid gap-2">
                        {workout.sets.map((set, setIndex) => (
                          <div
                            key={setIndex}
                            className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
                          >
                            <span className="font-medium text-gray-900 dark:text-white">
                              Set {setIndex + 1}
                            </span>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-gray-600 dark:text-gray-400">
                                {set.reps} reps × {set.weight} lbs
                              </span>
                              <span className="font-semibold text-primary-600 dark:text-primary-400">
                                {(set.reps * set.weight).toLocaleString()} lbs
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {workout.notes && (
                        <div className="mt-4">
                          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                            Notes
                          </h4>
                          <p className="text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                            {workout.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WorkoutHistory;
