import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { NavLink, useLocation, useNavigate, Outlet } from "react-router-dom";

const navLinks = [
  { icon: "bx bx-grid-alt", label: "Dashboard", path: "/plans" },
  { icon: "bx bx-calendar", label: "Weekly View", path: "/plans/weekly-view" },
  {
    icon: "bx bx-calendar-plus",
    label: "Workout Planner",
    path: "/plans/workout-planner",
  },
  { icon: "bx bx-trending-up", label: "Progress", path: "/plans/progress" },
  { icon: "bx bx-history", label: "History", path: "/plans/history" },
];

// Utility to get page title from path
const getPageTitle = (pathname) => {
  if (pathname === "/plans" || pathname === "/plans/") return "Dashboard";
  if (pathname.startsWith("/plans/weekly-view")) return "Weekly View";
  if (pathname.startsWith("/plans/workout-planner")) return "Workout Planner";
  if (pathname.startsWith("/plans/progress")) return "Progress";
  if (pathname.startsWith("/plans/history")) return "History";
  if (pathname.startsWith("/plans/workout-session")) return "Workout Session";
  if (pathname.includes("/exercise")) return "Exercise";
  return "ProgressLift";
};

export default function AppLayout() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Define routes where back button should show and sidebar hidden
  const viewsWithBackButton = ["/plans/workout-session", "/plans/exercise"];
  const showBackButton = viewsWithBackButton.some((prefix) =>
    location.pathname.startsWith(prefix)
  );
  const showSidebar = !showBackButton;

  const toggleSidebar = () => setIsOpen(!isOpen);
  const onBackClick = () => {
    navigate("/plans/weekly-view");
  };

  return (
    <div className="flex min-h-screen bg-[#E4E9F7]">
      {showSidebar && (
        <motion.nav
          animate={{ width: isOpen ? 250 : 78 }}
          transition={{ type: "spring", stiffness: 200, damping: 30 }}
          className="fixed top-0 left-0 h-screen bg-[#11101D] p-2 z-50 flex flex-col justify-between select-none shadow-lg"
        >
          <div>
            {/* Logo and clickable title at top */}
            <div className="flex items-center h-14 px-3">
              <i
                className="bx bx-dumbbell text-3xl text-white opacity-0 pointer-events-none transition-opacity duration-500"
                style={{ opacity: isOpen ? 1 : 0 }}
                aria-hidden="true"
              />
              <motion.div
                initial={false}
                animate={{ opacity: isOpen ? 1 : 0 }}
                className="ml-2 whitespace-nowrap flex-grow"
              >
                {isOpen && (
                  <NavLink
                    to="/home"
                    className="text-white font-semibold text-xl no-underline hover:underline"
                  >
                    ProgressLift
                  </NavLink>
                )}
              </motion.div>
            </div>

            {/* Navigation list with burger toggle as first item */}
            <ul className="mt-4 flex flex-col space-y-2">
              {/* Burger toggle button as first nav item */}
              <li className="relative group">
                <button
                  onClick={toggleSidebar}
                  aria-label="Toggle sidebar"
                  className="flex items-center gap-4 rounded-xl w-full text-left px-3 py-2 transition-colors bg-[#11101D] text-white"
                  type="button"
                >
                  <i
                    className={`bx ${
                      isOpen ? "bx-menu-alt-right" : "bx-menu"
                    } text-2xl flex-shrink-0`}
                    aria-hidden="true"
                  />
                  <motion.span
                    initial={false}
                    animate={{
                      opacity: isOpen ? 1 : 0,
                      width: isOpen ? "auto" : 0,
                    }}
                    className="whitespace-nowrap overflow-hidden"
                  >
                    Menu
                  </motion.span>
                </button>
                {!isOpen && (
                  <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-white text-gray-900 px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                    Menu
                  </span>
                )}
              </li>

              {/* Your nav links */}
              {navLinks.map(({ icon, label, path }, idx) => (
                <li key={idx} className="relative group">
                  <NavLink
                    to={path}
                    end={path === "/plans"}
                    className={({ isActive }) =>
                      `flex items-center gap-4 px-3 py-2 rounded-xl text-left w-full no-underline transition-colors ${
                        isActive
                          ? "bg-white text-[#11101D]"
                          : "bg-[#11101D] text-white hover:bg-white hover:text-[#11101D]"
                      }`
                    }
                  >
                    <i
                      className={`${icon} text-lg flex-shrink-0`}
                      aria-hidden="true"
                    />
                    <motion.span
                      initial={false}
                      animate={{
                        opacity: isOpen ? 1 : 0,
                        width: isOpen ? "auto" : 0,
                      }}
                      className="whitespace-nowrap overflow-hidden"
                    >
                      {label}
                    </motion.span>
                  </NavLink>
                  {!isOpen && (
                    <span className="absolute left-full top-1/2 -translate-y-1/2 ml-3 bg-white text-gray-900 px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none select-none">
                      {label}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
          {/* Profile section */}
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              `flex items-center gap-4 px-1 py-2 rounded-xl text-left transition-colors cursor-pointer select-none ${
                isActive
                  ? "bg-white text-[#11101D] hover:bg-gray-100"
                  : " text-white hover:bg-white hover:text-[#11101D]"
              }`
            }
            style={{ transition: "width 0.5s ease" }}
          >
            <div className="h-12 w-12 rounded-md bg-primary-600 flex items-center justify-center flex-shrink-0">
              <i className="bx bx-user text-white text-2xl" />
            </div>
            <motion.div
              initial={false}
              animate={{ opacity: isOpen ? 1 : 0, marginLeft: isOpen ? 12 : 0 }}
              className="overflow-hidden whitespace-nowrap"
            >
              {isOpen && (
                <>
                  <div className="font-medium text-base leading-tight">
                    Fitness User
                  </div>
                  <div className="text-sm text-gray-400 leading-tight">
                    Athlete
                  </div>
                </>
              )}
            </motion.div>
          </NavLink>
        </motion.nav>
      )}
      {/* Main content */}
      <motion.div
        animate={{
          marginLeft: showSidebar ? (isOpen ? 250 : 78) : 0,
          width: showSidebar ? `calc(100% - ${isOpen ? 250 : 78}px)` : "100%",
        }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
        className="flex-1 flex flex-col"
      >
        {/* Top bar for workout/exercise views */}
        {showBackButton && (
          <div className="bg-white shadow-sm border-b border-gray-200 p-4 lg:p-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackClick}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeft className="w-6 h-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900">
                {getPageTitle(location.pathname)}
              </h2>
            </div>
          </div>
        )}
        {/* Page content */}
        <main className={`flex-1 p-6 ${showSidebar ? "" : "bg-gray-50"}`}>
          {!showSidebar && (
            <div className="mb-6">
              <h1 className="text-2xl font-semibold text-[#11101D]">
                {getPageTitle(location.pathname)}
              </h1>
            </div>
          )}
          <Outlet />
        </main>
      </motion.div>
    </div>
  );
}
