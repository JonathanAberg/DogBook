//Startsida (Lista för alla hundar)

import { useEffect, useState } from "react";
import { getDogs, deleteDog } from "../services/api";
import { Link } from "react-router-dom";
import DogCard from "../components/DogCard";
import styles from "./Home.module.css";

function Home() {
  const [dogs, setDogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDogs();
  }, []);

  async function fetchDogs() {
    try {
      const data = await getDogs();
      setDogs(data);
    } catch (err) {
      console.error("Failed to fetch dogs:", err);
      setError("Failed to load dogs. Please try again later.");
    }
  }

  async function handleDelete(id) {
    try {
      await deleteDog(id);
      setDogs(dogs.filter((dog) => dog._id !== id));
    } catch (err) {
      console.error("Failed to delete dog:", err);
      setError("Failed to delete dog. Please try again later.");
    }
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>DogBook</h1>
      <Link to="/create" className={styles.createLink}>
        Skapa ny hund
      </Link>

      {error ? (
        <p className={styles.errorMessage}>{error}</p>
      ) : (
        <div className={styles.dogGrid}>
          {dogs.length > 0 ? (
            dogs.map((dog) => (
              <DogCard
                key={dog._id}
                dog={dog}
                onDelete={() => handleDelete(dog._id)}
              />
            ))
          ) : (
            <p className={styles.emptyMessage}>
              Inga hundar registrerade ännu!
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
