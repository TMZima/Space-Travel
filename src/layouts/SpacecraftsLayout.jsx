import React from "react";
import { Outlet } from "react-router-dom";

export default function SpacecraftsLayout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}
