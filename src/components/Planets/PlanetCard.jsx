import React from "react";
import styles from "./PlanetCard.module.css";

export default function PlanetCard({
  name,
  currentPopulation,
  pictureUrl,
  onClick,
  isSelected,
  spacecrafts,
  onSpacecraftClick,
  selectedSpacecraftId,
}) {
  return (
    <div
      className={`${styles.planetCard} ${isSelected ? styles.selected : ""}`}
      onClick={onClick}
      data-testid="planet-card"
    >
      <img
        className={styles.planetImage}
        src={pictureUrl}
        alt={`Picture of ${name}`}
      />
      <div className={styles.planetDetails}>
        <h2 className={styles.planetName}>{name}</h2>
        <p className={styles.planetPopulation}>
          Population: {currentPopulation}
        </p>
        <div className={styles.spacecraftsContainer}>
          {spacecrafts.map((spacecraft) => (
            <div
              key={spacecraft.id}
              className={`${styles.spacecraftCard} ${
                selectedSpacecraftId === spacecraft.id
                  ? styles.selectedSpacecraft
                  : ""
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onSpacecraftClick(spacecraft);
              }}
              data-testid={`spacecraft-card-${spacecraft.id}`}
            >
              <div className={styles.imageContainer}>
                {spacecraft.pictureUrl ? (
                  <img
                    src={spacecraft.pictureUrl}
                    alt={spacecraft.name}
                    className={styles.spacecraftImage}
                  />
                ) : (
                  <span className={styles.emoji}>🚀</span>
                )}
              </div>
              <div className={styles.spacecraftDetails}>
                <p>{spacecraft.name}</p>
                <p>Capacity: {spacecraft.capacity}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
