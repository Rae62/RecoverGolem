import { Outlet, useLoaderData } from "react-router-dom";
import { UserProvider, useUser } from "./contexts/UserContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect } from "react";
import { WorkoutProvider } from "./contexts/WorkoutContext";

function App() {
  return (
    <UserProvider>
      <WorkoutProvider>
        <main className="flex flex-col min-h-screen">
          <Outlet />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </main>
      </WorkoutProvider>
    </UserProvider>
  );
}

export default App;
