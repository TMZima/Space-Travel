import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
  Navigate,
} from "react-router-dom";

import SpacecraftContextProvider from "./context/SpacecraftContextProvider";

import styles from "./App.module.css";

// layouts
import RootLayout from "./layouts/RootLayout";
import SpacecraftsLayout from "./layouts/SpacecraftsLayout";

// pages
import HomePage from "./pages/home/HomePage";
import SpacecraftsPage from "./pages/spacecraft/SpacecraftsPage";
import PlanetsPage from "./pages/planets/PlanetsPage";
import SpacecraftDetailsPage from "./pages/spacecraft/SpacecraftDetailsPage";
import AddSpacecraftForm from "./components/Spacecraft/AddSpacecraftForm";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<RootLayout />}>
      <Route index element={<HomePage />} />

      <Route path="spacecrafts" element={<SpacecraftsLayout />}>
        <Route index element={<SpacecraftsPage />} />
        <Route path=":id" element={<SpacecraftDetailsPage />} />
        <Route path="builder" element={<AddSpacecraftForm />} />
      </Route>

      <Route path="planets" element={<PlanetsPage />} />

      {/* Redirect unmatched routes to the home page */}
      <Route path="*" element={<Navigate to="/" />} />
    </Route>
  )
);

function App() {
  return (
    <div className={styles.app}>
      <SpacecraftContextProvider>
        <RouterProvider router={router} />
      </SpacecraftContextProvider>
    </div>
  );
}

export default App;
