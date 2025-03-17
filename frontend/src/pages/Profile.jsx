import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDogs,
  getDogById,
  deleteDog,
  addFriend,
  removeFriend,
} from "../services/api";

function Profile() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);
  const [availableDogs, setAvailableDogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dogData, allDogs] = await Promise.all([
          getDogById(id),
          getDogs(),
        ]);
        setDog(dogData);
        // Filtrera bort nuvarande hund och dess vänner
        const available = allDogs.filter(
          (d) => d._id !== id && !dogData.friends.some((f) => f._id === d._id)
        );
        setAvailableDogs(available);
        setError(null);
      } catch (err) {
        setError("Kunde inte hämta information");
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  async function handleAddFriend(friendId) {
    try {
      await addFriend(id, friendId);
      const updatedDog = await getDogById(id);
      setDog(updatedDog);
      setError(null);
    } catch (err) {
      setError("Kunde inte lägga till vän");
      console.error(err);
    }
  }

  async function handleRemoveFriend(friendId) {
    try {
      await removeFriend(id, friendId);
      const updatedDog = await getDogById(id);
      setDog(updatedDog);
      setError(null);
    } catch (err) {
      setError("Kunde inte ta bort vän");
      console.error(err);
    }
  }

  async function handleDelete() {
    try {
      await deleteDog(id);
      alert("Hund raderad!");
      window.location.href = "/";
    } catch (err) {
      setError("Kunde inte radera hunden");
      console.error(err);
    }
  }

  if (!dog) return <p>Laddar...</p>;

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <h1>{dog.name} 🐶</h1>
      <p>Ålder: {dog.age}</p>
      <p>{dog.present ? "🐶 Är på dagis" : "🐾 Inte på dagis"}</p>

      <h3>Om mig 📝</h3>
      <p>{dog.bio || "Ingen biografi ännu!"}</p>

      <h3>Lägg till vänner</h3>
      <ul>
        {availableDogs.map((availableDog) => (
          <li key={availableDog._id}>
            {availableDog.name}
            <button onClick={() => handleAddFriend(availableDog._id)}>
              Lägg till som vän
            </button>
          </li>
        ))}
      </ul>

      <h3>Vänner 🐾</h3>
      <ul>
        {dog.friends.length > 0 ? (
          dog.friends.map((friend) => (
            <li key={friend._id}>
              <Link to={`/profile/${friend._id}`}>{friend.name}</Link>
              <button onClick={() => handleRemoveFriend(friend._id)}>
                Ta bort vän
              </button>
            </li>
          ))
        ) : (
          <p>Inga vänner än!</p>
        )}
      </ul>

      <button onClick={handleDelete}>❌ Radera</button>
      <Link to={`/edit/${id}`}>✏️ Redigera</Link>
      <br />
      <Link to="/">🏠 Tillbaka</Link>
    </div>
  );
}

export default Profile;
