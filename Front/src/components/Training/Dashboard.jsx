import { useWorkout } from "../../contexts/WorkoutContext";
import { format, subDays, subWeeks, subMonths } from "date-fns";
import {
  TrendingUp,
  Calendar,
  Target,
  Award,
  Activity,
  BarChart3,
} from "lucide-react";

const Dashboard = () => {
  const { workouts, getTotalVolume, getPersonalRecord } = useWorkout();

  const stats = [
    {
      title: "Total Workouts",
      value: workouts.length,
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100 dark:bg-blue-900",
    },
    {
      title: "Weekly Volume",
      value: `${getTotalVolume("week").toLocaleString()} lbs`,
      icon: TrendingUp,
      color: "text-green-600",
      bgColor: "bg-green-100 dark:bg-green-900",
    },
    {
      title: "Monthly Volume",
      value: `${getTotalVolume("month").toLocaleString()} lbs`,
      icon: BarChart3,
      color: "text-purple-600",
      bgColor: "bg-purple-100 dark:bg-purple-900",
    },
    {
      title: "Personal Records",
      value: workouts.length > 0 ? "12" : "0",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100 dark:bg-yellow-900",
    },
  ];

  const recentWorkouts = workouts.slice(0, 5);
  const uniqueExercises = [...new Set(workouts.map((w) => w.exercise))];

  const getWeeklyProgress = () => {
    const weeks = [];
    for (let i = 6; i >= 0; i--) {
      const weekStart = subWeeks(new Date(), i);
      const weekEnd = subDays(weekStart, -6);

      const weekWorkouts = workouts.filter((w) => {
        const workoutDate = new Date(w.timestamp);
        return workoutDate >= weekStart && workoutDate <= weekEnd;
      });

      const weekVolume = weekWorkouts.reduce((total, workout) => {
        return (
          total +
          workout.sets.reduce((sum, set) => sum + set.weight * set.reps, 0)
        );
      }, 0);

      weeks.push({
        week: format(weekStart, "MMM dd"),
        volume: weekVolume,
        workouts: weekWorkouts.length,
      });
    }
    return weeks;
  };

  const weeklyData = getWeeklyProgress();

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="card p-6 animate-slide-up">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Welcome back!
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Ready to crush your next workout?
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className="card p-6 card-hover animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity & Weekly Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Workouts */}
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.4s" }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Recent Workouts
          </h3>
          {recentWorkouts.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 dark:text-gray-400">
                No workouts yet. Start your fitness journey!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentWorkouts.map((workout, index) => (
                <div
                  key={workout.id}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {workout.exercise}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {workout.sets.length} sets •{" "}
                      {format(new Date(workout.timestamp), "MMM dd, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600 dark:text-primary-400">
                      {Math.max(...workout.sets.map((s) => s.weight))} lbs
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Max weight
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Weekly Progress */}
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.5s" }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Weekly Volume
          </h3>
          <div className="space-y-4">
            {weeklyData.map((week, index) => (
              <div
                key={week.week}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-primary-500 rounded-full"></div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {week.week}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {week.volume.toLocaleString()} lbs
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {week.workouts} workouts
                    </p>
                  </div>
                  <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-primary-500 to-accent-500 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          (week.volume /
                            Math.max(...weeklyData.map((w) => w.volume))) *
                            100,
                          100
                        )}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exercise Overview */}
      {uniqueExercises.length > 0 && (
        <div
          className="card p-6 animate-slide-up"
          style={{ animationDelay: "0.6s" }}
        >
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            Exercise Overview
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {uniqueExercises.slice(0, 6).map((exercise, index) => {
              const exerciseWorkouts = workouts.filter(
                (w) => w.exercise === exercise
              );
              const totalSets = exerciseWorkouts.reduce(
                (sum, w) => sum + w.sets.length,
                0
              );
              const maxWeight = Math.max(
                ...exerciseWorkouts.flatMap((w) => w.sets.map((s) => s.weight))
              );

              return (
                <div
                  key={exercise}
                  className="p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 rounded-lg animate-scale-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {exercise}
                  </h4>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {exerciseWorkouts.length} sessions
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {totalSets} total sets
                    </p>
                    <p className="text-sm font-semibold text-primary-600 dark:text-primary-400">
                      {maxWeight} lbs max
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
