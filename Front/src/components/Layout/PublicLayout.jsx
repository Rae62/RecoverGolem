import React from "react";
import { Outlet } from "react-router-dom";

export default function PublicLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* You can add header here if you want */}
      <Outlet />
      {/* You can add footer here if you want */}
    </div>
  );
}
