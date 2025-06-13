import { useState, useEffect } from "react";
import { useWorkout } from "../../contexts/WorkoutContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { format } from "date-fns";
import { TrendingUp, BarChart, Activity, Target } from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ProgressCharts = () => {
  const { workouts, exercises } = useWorkout();
  const [selectedExercise, setSelectedExercise] = useState("");
  const [chartType, setChartType] = useState("line");
  const [isLoading, setIsLoading] = useState(true);

  const exercisesWithData = exercises.filter((exercise) =>
    workouts.some((w) => w.exercise === exercise)
  );

  useEffect(() => {
    if (exercisesWithData.length > 0 && !selectedExercise) {
      setSelectedExercise(exercisesWithData[0]);
    }
    setIsLoading(false);
  }, [exercisesWithData, selectedExercise]);

  const getExerciseData = (exerciseName) => {
    return workouts
      .filter((w) => w.exercise === exerciseName)
      .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
      .map((workout) => ({
        date: format(new Date(workout.timestamp), "MMM dd"),
        maxWeight: Math.max(...workout.sets.map((set) => set.weight)),
        totalVolume: workout.sets.reduce(
          (sum, set) => sum + set.weight * set.reps,
          0
        ),
        totalReps: workout.sets.reduce((sum, set) => sum + set.reps, 0),
        sets: workout.sets.length,
      }));
  };

  const getProgressData = () => {
    if (!selectedExercise) return null;

    const data = getExerciseData(selectedExercise);
    if (data.length === 0) return null;

    const chartData = {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Max Weight (lbs)",
          data: data.map((d) => d.maxWeight),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointRadius: 6,
          pointHoverRadius: 8,
          pointBackgroundColor: "rgb(59, 130, 246)",
          pointBorderColor: "white",
          pointBorderWidth: 2,
        },
      ],
    };

    return chartData;
  };

  const getVolumeData = () => {
    if (!selectedExercise) return null;

    const data = getExerciseData(selectedExercise);
    if (data.length === 0) return null;

    const chartData = {
      labels: data.map((d) => d.date),
      datasets: [
        {
          label: "Total Volume (lbs)",
          data: data.map((d) => d.totalVolume),
          backgroundColor: "rgba(16, 185, 129, 0.8)",
          borderColor: "rgb(16, 185, 129)",
          borderWidth: 2,
          borderRadius: 6,
          borderSkipped: false,
        },
      ],
    };

    return chartData;
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12,
            weight: "bold",
          },
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        cornerRadius: 8,
        padding: 12,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.1)",
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
    },
  };

  const progressData = getProgressData();
  const volumeData = getVolumeData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (exercisesWithData.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="card p-8 max-w-md mx-auto">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No Data Available
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Add some workouts to see your progress charts!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Controls */}
      <div className="card p-6 animate-slide-up">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-primary-100 dark:bg-primary-900 rounded-lg">
              <TrendingUp className="w-6 h-6 text-primary-600 dark:text-primary-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Progress Charts
            </h2>
          </div>

          <div className="flex space-x-4">
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="input-field w-48"
            >
              {exercisesWithData.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>

            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setChartType("line")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === "line"
                    ? "bg-white dark:bg-gray-800 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Line
              </button>
              <button
                onClick={() => setChartType("bar")}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  chartType === "bar"
                    ? "bg-white dark:bg-gray-800 text-primary-600 shadow-sm"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                }`}
              >
                Bar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Weight Progress Chart */}
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.1s" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <Target className="w-5 h-5 text-primary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Weight Progress
            </h3>
          </div>
          <div className="h-80">
            {progressData &&
              (chartType === "line" ? (
                <Line data={progressData} options={chartOptions} />
              ) : (
                <Bar data={progressData} options={chartOptions} />
              ))}
          </div>
        </div>

        {/* Volume Chart */}
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.2s" }}
        >
          <div className="flex items-center space-x-3 mb-6">
            <BarChart className="w-5 h-5 text-secondary-600" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Volume Progress
            </h3>
          </div>
          <div className="h-80">
            {volumeData && <Bar data={volumeData} options={chartOptions} />}
          </div>
        </div>
      </div>

      {/* Exercise Stats */}
      {selectedExercise && (
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.3s" }}
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
            {selectedExercise} Statistics
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(() => {
              const exerciseWorkouts = workouts.filter(
                (w) => w.exercise === selectedExercise
              );
              const totalSessions = exerciseWorkouts.length;
              const totalSets = exerciseWorkouts.reduce(
                (sum, w) => sum + w.sets.length,
                0
              );
              const totalReps = exerciseWorkouts.reduce(
                (sum, w) => sum + w.sets.reduce((s, set) => s + set.reps, 0),
                0
              );
              const maxWeight = Math.max(
                ...exerciseWorkouts.flatMap((w) => w.sets.map((s) => s.weight))
              );

              const stats = [
                {
                  label: "Total Sessions",
                  value: totalSessions,
                  color: "text-blue-600",
                },
                {
                  label: "Total Sets",
                  value: totalSets,
                  color: "text-green-600",
                },
                {
                  label: "Total Reps",
                  value: totalReps,
                  color: "text-purple-600",
                },
                {
                  label: "Max Weight",
                  value: `${maxWeight} lbs`,
                  color: "text-red-600",
                },
              ];

              return stats.map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <p className={`text-2xl font-bold ${stat.color} mb-1`}>
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {stat.label}
                  </p>
                </div>
              ));
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressCharts;
