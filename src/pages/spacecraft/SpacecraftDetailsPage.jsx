import { React, useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import SpacecraftContext from "../../context/SpacecraftContext";

import styles from "./SpacecraftDetailsPage.module.css";

export default function SpacecraftDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchSpacecraftById, loading, error } = useContext(SpacecraftContext);
  const [spacecraft, setSpacecraft] = useState(null);

  useEffect(() => {
    async function fetchSpacecraft() {
      const data = await fetchSpacecraftById(id);
      if (data) {
        setSpacecraft(data);
      }
    }
    fetchSpacecraft();
  }, []);

  if (loading) {
    return (
      <div className={styles.loading}>
        <p>Loading...</p>
        <div className={styles.spinner}></div>
      </div>
    );
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (!spacecraft) {
    return <div className={styles.error}>Spacecraft not found.</div>;
  }

  // Default picture emoji if one is not supplied in creation
  const defaultPicture = "🚀";

  return (
    <div className={styles.spacecraftDetails}>
      <button onClick={() => navigate("/spacecrafts")}>Go Back {"👈"}</button>
      <div className={styles.details}>
        <div className={styles.leftContainer}>
          <div className={styles.imageContainer}>
            {spacecraft.pictureUrl ? (
              <img
                src={spacecraft.pictureUrl}
                alt={spacecraft.name}
                className={styles.image}
              />
            ) : (
              <span className={styles.emoji}>{defaultPicture}</span>
            )}
          </div>
          <div className={styles.textContainer}>
            <h1>{spacecraft.name}</h1>
            <p>Capacity: {spacecraft.capacity}</p>
          </div>
        </div>
        <div className={styles.rightContainer}>
          <h2>Description:</h2>
          <p>{spacecraft.description}</p>
        </div>
      </div>
    </div>
  );
}
