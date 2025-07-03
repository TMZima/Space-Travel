import React from "react";
import { useState, useEffect } from "react";
import SpaceTravelApi from "../services/SpaceTravelApi";
import SpacecraftContext from "./SpacecraftContext";

function SpacecraftContextProvider({ children }) {
  const [spacecrafts, setSpacecrafts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSpacecrafts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SpaceTravelApi.getSpacecrafts();
      setSpacecrafts(res.data);
    } catch (error) {
      console.error("Error fetching Spacecraft:", error);
      setError("Error fetching spacecraft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSpacecraftById = async (id) => {
    setLoading(true);
    setError(null);
    try {
      const res = await SpaceTravelApi.getSpacecraftById({ id });
      if (res.isError) {
        throw new Error(res.data);
      }
      return res.data;
    } catch (error) {
      console.error("Error fetching spacecraft details:", error);
      setError("Error fetching spacecraft details. Please try again.");
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSpacecrafts();
  }, []);

  const handleDestroySpacecraft = async (id) => {
    setLoading(true);
    try {
      await SpaceTravelApi.destroySpacecraftById({ id });
      setSpacecrafts((prevSpacecrafts) =>
        prevSpacecrafts.filter((spacecraft) => spacecraft.id !== id)
      );
    } catch (error) {
      console.error("Error destroying spacecraft:", error);
      setError("Error decommissioning spacecraft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SpacecraftContext.Provider
      value={{
        spacecrafts,
        loading,
        setLoading,
        error,
        setError,
        fetchSpacecrafts,
        fetchSpacecraftById,
        handleDestroySpacecraft,
      }}
    >
      {children}
    </SpacecraftContext.Provider>
  );
}

export default SpacecraftContextProvider;
