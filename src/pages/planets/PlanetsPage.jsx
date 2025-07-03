import { React, useContext, useEffect, useState } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import SpacecraftContext from "../../context/SpacecraftContext";
import PlanetCard from "../../components/Planets/PlanetCard";

import styles from "./PlanetsPage.module.css";
import { useNavigate } from "react-router-dom";

export default function PlanetsPage() {
  const {
    spacecrafts,
    loading,
    setLoading,
    error,
    setError,
    fetchSpacecrafts,
  } = useContext(SpacecraftContext);

  // Set local state
  const [planets, setPlanets] = useState([]);
  const [selectedSpacecraft, setSelectedSpacecraft] = useState(null);
  const [selectedPlanet, setSelectedPlanet] = useState(null);
  const [moving, setMoving] = useState(false); // New state for moving spacecraft

  const navigate = useNavigate();

  // fetch planets and store in local state
  useEffect(() => {
    async function fetchPlanets() {
      setError(null);
      setLoading(true);
      try {
        const res = await SpaceTravelApi.getPlanets();
        setPlanets(res.data);
      } catch (error) {
        console.error("Error fetching Planets:", error);
        setError("Error fetching Planets. Please try again");
      } finally {
        setLoading(false);
      }
    }
    fetchPlanets();
  }, []);

  const handleSpacecraftClick = (spacecraft) => {
    setSelectedSpacecraft(spacecraft);
  };

  const handlePlanetClick = async (planet) => {
    if (selectedSpacecraft) {
      setMoving(true);
      try {
        const res = await SpaceTravelApi.sendSpacecraftToPlanet({
          spacecraftId: selectedSpacecraft.id,
          targetPlanetId: planet.id,
        });
        if (res.isError) {
          throw new Error(res.data);
        }
        // Update local state
        setPlanets((prevPlanets) =>
          prevPlanets.map((p) => {
            if (p.id === planet.id) {
              return {
                ...p,
                currentPopulation:
                  p.currentPopulation + selectedSpacecraft.capacity,
              };
            } else if (p.id === selectedSpacecraft.currentLocation) {
              return {
                ...p,
                currentPopulation:
                  p.currentPopulation - selectedSpacecraft.capacity,
              };
            } else {
              return p;
            }
          })
        );
        setSelectedSpacecraft(null);
        setSelectedPlanet(null);
        // Update spacecraft location
        fetchSpacecrafts();
      } catch (error) {
        console.error("Error moving spacecraft:", error);
        setError(error.message);
      } finally {
        setMoving(false);
      }
    }
  };

  // when user moves spacecraft to a planet it's already on
  const handleTryAgain = () => {
    navigate("/planets");
    window.location.reload();
  };

  return (
    <div className={styles.planetsPage}>
      {loading || moving ? ( // Show loading screen if loading or moving
        <div className={styles.loading}>
          <p>Loading...</p>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div>
          <div>
            <button onClick={handleTryAgain}>Try Again! {"⏎"}</button>
          </div>

          <div className={styles.error}>
            <p>{error}</p>
          </div>
        </div>
      ) : (
        <div className={styles.planetsContainer}>
          {planets.map((planet) => (
            <PlanetCard
              key={planet.id}
              name={planet.name}
              currentPopulation={planet.currentPopulation}
              pictureUrl={planet.pictureUrl}
              onClick={() => handlePlanetClick(planet)}
              isSelected={selectedPlanet === planet.id}
              spacecrafts={spacecrafts.filter(
                (spacecraft) => spacecraft.currentLocation === planet.id
              )}
              onSpacecraftClick={handleSpacecraftClick}
              selectedSpacecraftId={selectedSpacecraft?.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
