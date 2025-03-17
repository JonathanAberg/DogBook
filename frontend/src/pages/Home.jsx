//Startsida (Lista för alla hundar)

import { useEffect, useState } from "react";
import { getDogs } from "../services/api";
import { Link } from "react-router-dom";

function Home() {
  const [dogs, setDogs] = useState([]);

  useEffect(() => {
    async function fetchDogs() {
      const data = await getDogs();
      setDogs(data);
    }
    fetchDogs();
  }, []);

  return (
    <div>
      <h1>DogBook</h1>
      <Link to="/create"> Skapa ny hund</Link>
      <ul>
        {dogs.map((dog) => (
          <li key={dog._id}>
            <Link to={`/profile/${dog._id}`}>{dog.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Home;
