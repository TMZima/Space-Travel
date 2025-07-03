import { React, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SpaceTravelApi from "../../services/SpaceTravelApi";
import SpacecraftContext from "../../context/SpacecraftContext";

import styles from "./AddSpacecraftForm.module.css";

export default function AddSpacecraftForm() {
  const { loading, setLoading, error, setError } =
    useContext(SpacecraftContext);
  const navigate = useNavigate();

  // Initialize form state
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    description: "",
    pictureUrl: "",
  });

  // Initialize form error state
  const [errors, setErrors] = useState({});

  // Handle input changes and update form state
  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Validate form data
  const validate = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.capacity) newErrors.capacity = "Capacity is required";
    if (isNaN(formData.capacity) || formData.capacity <= 0)
      newErrors.capacity = "Capacity must be a positive number";
    if (!formData.description)
      newErrors.description = "Description is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    const { name, capacity, description, pictureUrl } = formData;

    setLoading(true);

    try {
      // Send form data to the API
      const res = await SpaceTravelApi.buildSpacecraft({
        name,
        capacity: parseInt(capacity, 10),
        description,
        pictureUrl,
      });

      if (res.isError) {
        setError("Error creating spacecraft");
        return;
      }

      // Navigate to the spacecraft list page on success
      navigate("/spacecrafts");
    } catch (error) {
      console.error("Error:", error);
      setError("Failed to create spacecraft. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.formContainer}>
      <button onClick={() => navigate("/spacecrafts")}>Back {"👈"}</button>

      {/* Form for adding a new spacecraft */}
      <form method="post" onSubmit={handleSubmit}>
        <label htmlFor="name">
          Name:
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
          {errors.name && <p className={styles.error}>{errors.name}</p>}
        </label>
        <label htmlFor="capacity">
          Capacity:
          <input
            type="number"
            id="capacity"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
          />
          {errors.capacity && <p className={styles.error}>{errors.capacity}</p>}
        </label>
        <label htmlFor="description">
          Description:
          <textarea
            id="description"
            name="description"
            placeholder="Description"
            value={formData.description}
            onChange={handleChange}
          />
          {errors.description && (
            <p className={styles.error}>{errors.description}</p>
          )}
        </label>
        <label htmlFor="pictureUrl">
          Picture URL:
          <input
            type="url"
            id="pictureUrl"
            name="pictureUrl"
            placeholder="Picture URL"
            value={formData.pictureUrl}
            onChange={handleChange}
          />
        </label>
        <button type="submit" disabled={loading}>
          {loading ? "Building..." : "Build 🏗️"}
        </button>
      </form>

      {error && <p className={styles.errorState}>{error}</p>}
    </div>
  );
}
