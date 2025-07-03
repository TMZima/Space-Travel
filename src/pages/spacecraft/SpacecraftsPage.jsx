import { React, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import SpacecraftContext from "../../context/SpacecraftContext";
import SpacecraftCard from "../../components/Spacecraft/SpacecraftCard";

import styles from "./SpacecraftsPage.module.css";

export default function SpacecraftsPage() {
  const {
    spacecrafts,
    loading,
    error,
    setError,
    fetchSpacecrafts,
    handleDestroySpacecraft,
  } = useContext(SpacecraftContext);

  const navigate = useNavigate();
  // call fetchSpacecrafts only on mount to display loading screen
  useEffect(() => {
    fetchSpacecrafts();
  }, []);

  const handleNavigateToBuilder = () => {
    setError(null);
    navigate("/spacecrafts/builder");
  };

  return (
    <div className={styles.spacecraftsPage}>
      {!loading && (
        <button onClick={handleNavigateToBuilder}>
          {"⚙️"} Build a Spacecraft
        </button>
      )}

      {loading ? (
        <div className={styles.loading}>
          <p>Loading...</p>
          <div className={styles.spinner}></div>
        </div>
      ) : error ? (
        <div className={styles.error}>
          <p>{error}</p>
        </div>
      ) : (
        <div className={styles.spacecraftsContainer}>
          {spacecrafts.map((spacecraft) => (
            <SpacecraftCard
              key={spacecraft.id}
              id={spacecraft.id}
              name={spacecraft.name}
              capacity={spacecraft.capacity}
              pictureUrl={spacecraft.pictureUrl}
              onViewDetails={() =>
                navigate(`/spacecrafts/${spacecraft.id}`, {
                  state: { spacecraft },
                })
              }
              onDecommission={handleDestroySpacecraft}
              onError={setError}
            />
          ))}
        </div>
      )}
    </div>
  );
}
