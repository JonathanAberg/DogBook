import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  getDogs,
  getDogById,
  deleteDog,
  addFriend,
  removeFriend,
  getImageUrl,
} from "../services/api";
import "../components/DogProfile.css";

function Profile() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [error, setError] = useState(null);
  const [availableDogs, setAvailableDogs] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        // Fetch both current dog and all dogs
        const [currentDog, allDogs] = await Promise.all([
          getDogById(id),
          getDogs(),
        ]);

        if (!currentDog) {
          setError("Hunden hittades inte!");
          return;
        }

        setDog(currentDog);

        // Filter out current dog and its friends from available dogs
        const available = allDogs.filter(
          (d) =>
            d._id !== id &&
            !currentDog.friends.some((friend) => friend._id === d._id)
        );
        setAvailableDogs(available);
      } catch (err) {
        setError("Kunde inte hämta hunddata");
        console.error(err);
      }
    }
    fetchData();
  }, [id]);

  if (!dog) return <p>Laddar...</p>;

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

  return (
    <div className="dog-profile">
      {error && <p style={{ color: "red" }}>{error}</p>}

      <div className="profile-header">
        <div className="profile-image-container">
          <img
            src={getImageUrl(dog.imagePath)}
            alt={dog.name}
            className="profile-image"
            onError={(e) => {
              e.target.src = getImageUrl();
              e.target.onerror = null;
            }}
          />
        </div>
        <div className="profile-info">
          <h1>{dog.name} 🐶</h1>
          {dog.nick && <h3>Smeknamn: {dog.nick}</h3>}
          <p>Ålder: {dog.age}</p>
          <p>{dog.present ? "🐶 Är på dagis" : "🐾 Inte på dagis"}</p>
        </div>
      </div>

      <div className="profile-bio">
        <h3>Om mig 📝</h3>
        <p>{dog.bio || "Ingen biografi ännu!"}</p>
      </div>

      <div className="dog-friends-section">
        <h3>Lägg till vänner</h3>
        {availableDogs.length > 0 ? (
          <ul className="available-dogs-list">
            {availableDogs.map((availableDog) => (
              <li key={availableDog._id}>
                <Link to={`/profile/${availableDog._id}`}>
                  {availableDog.name}
                </Link>
                <button
                  onClick={() => handleAddFriend(availableDog._id)}
                  style={{ marginLeft: "10px" }}
                >
                  Lägg till som vän
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p>Inga tillgängliga hundar att bli vän med!</p>
        )}

        <h3>Vänner 🐾</h3>
        {dog.friends.length > 0 ? (
          <div className="friends-grid">
            {dog.friends.map((friend) => (
              <div key={friend._id} className="friend-item">
                <Link to={`/profile/${friend._id}`} className="friend-link">
                  <div className="friend-image-container">
                    <img
                      src={getImageUrl(friend.imagePath)}
                      alt={friend.name}
                      className="friend-image"
                      onError={(e) => {
                        e.target.src = getImageUrl();
                        e.target.onerror = null;
                      }}
                    />
                  </div>
                  <p>@{friend.name}</p>
                </Link>
                <button
                  onClick={() => handleRemoveFriend(friend._id)}
                  className="remove-friend-btn"
                >
                  Ta bort vän
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>Inga vänner än!</p>
        )}
      </div>

      <div className="profile-actions">
        <button onClick={handleDelete} className="delete-btn">
          ❌ Radera
        </button>
        <Link to={`/edit/${id}`} className="edit-btn">
          ✏️ Redigera
        </Link>
        <Link to="/" className="back-btn">
          🏠 Tillbaka
        </Link>
      </div>
    </div>
  );
}

export default Profile;
