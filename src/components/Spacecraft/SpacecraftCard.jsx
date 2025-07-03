import { React, useState } from "react";
import SpaceTravelApi from "../../services/SpaceTravelApi";

import styles from "./SpacecraftCard.module.css";

export default function SpacecraftCard({
  id,
  name,
  capacity,
  pictureUrl,
  onViewDetails,
  onDecommission,
  onError,
}) {
  // Managing state locally
  const [loading, setLoading] = useState(false);

  const handleDecommission = async () => {
    setLoading(true);
    try {
      const res = await SpaceTravelApi.destroySpacecraftById({ id });
      if (res.isError) {
        throw new Error("Error decommissioning spacecraft");
      }
      // Callback to update the state in the parent component
      onDecommission(id);
    } catch (error) {
      console.error("Error", error);
      onError("Failed to decommission spacecraft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Default picture emoji if one is not supplied in creation
  const defaultPicture = "🚀";

  return (
    <div className={styles.card}>
      <div className={styles.details}>
        <div className={styles.imageContainer}>
          {pictureUrl ? (
            <img src={pictureUrl} alt={name} className={styles.image} />
          ) : (
            <span className={styles.emoji}>{defaultPicture}</span>
          )}
        </div>
        <div className={styles.textContainer}>
          <h2 className={styles.title}>{name}</h2>
          <p>Capacity: {capacity}</p>
        </div>
      </div>
      <div>
        <button onClick={onViewDetails}>{"🚀"} View Details</button>
        <button onClick={handleDecommission} disabled={loading}>
          {loading ? "Decommissioning..." : "💥 Decommission"}{" "}
        </button>
      </div>
    </div>
  );
}
