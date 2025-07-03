import React from "react";
import { MemoryRouter, Routes, Route, Navigate } from "react-router-dom";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

// context and layouts
import SpacecraftContextProvider from "../context/SpacecraftContextProvider";
import RootLayout from "../layouts/RootLayout";
import SpacecraftsLayout from "../layouts/SpacecraftsLayout";

// pages
import HomePage from "../pages/home/HomePage";
import SpacecraftsPage from "../pages/spacecraft/SpacecraftsPage";
import SpacecraftDetailsPage from "../pages/spacecraft/SpacecraftDetailsPage";
import AddSpacecraftForm from "../components/Spacecraft/AddSpacecraftForm";
import PlanetsPage from "../pages/planets/PlanetsPage";

const custRender = ({ route } = { route: "/" }) => {
  return render(
    <SpacecraftContextProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/" element={<RootLayout />}>
            <Route index element={<HomePage />} />
            <Route path="spacecrafts" element={<SpacecraftsLayout />}>
              <Route index element={<SpacecraftsPage />} />
              <Route path=":id" element={<SpacecraftDetailsPage />} />
              <Route path="builder" element={<AddSpacecraftForm />} />
            </Route>
            <Route path="planets" element={<PlanetsPage />} />
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </SpacecraftContextProvider>
  );
};

global.React = React;
global.screen = screen;
global.userEvent = userEvent;
global.custRender = custRender;
