import React from "react";
import { NavLink, Outlet } from "react-router-dom";
import styles from "./RootLayout.module.css";
import Footer from "../components/Footer/Footer";

export default function RootLayout() {
  return (
    <div className={styles.rootLayout}>
      <header>
        <nav>
          <NavLink
            to="/"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            {"🌎"}Home
          </NavLink>
          <NavLink
            to="spacecrafts"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            {"🚀"}Spacecraft
          </NavLink>
          <NavLink
            to="planets"
            className={({ isActive }) => (isActive ? styles.active : "")}
          >
            {"🪐"}Planets
          </NavLink>
        </nav>
      </header>

      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
