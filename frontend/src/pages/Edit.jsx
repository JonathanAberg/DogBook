import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDogById, updateDog } from "../services/api";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [dog, setDog] = useState({
    name: "",
    age: "",
    present: false,
    bio: "",
  });

  useEffect(() => {
    async function fetchDog() {
      const data = await getDogById(id);
      setDog(data);
    }
    fetchDog();
  }, [id]);

  function handleChange(e) {
    setDog({ ...dog, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await updateDog(id, dog);
    navigate(`/profile/${id}`);
  }

  return (
    <div>
      <h1>Redigera {dog.name}</h1>
      <form onSubmit={handleSubmit}>
        <label>Namn:</label>
        <input
          type="text"
          name="name"
          value={dog.name}
          onChange={handleChange}
          required
        />

        <label>Ålder:</label>
        <input
          type="number"
          name="age"
          value={dog.age}
          onChange={handleChange}
          required
        />

        <label>Biografi:</label>
        <textarea name="bio" value={dog.bio} onChange={handleChange} rows="3" />

        <label>
          <input
            type="checkbox"
            name="present"
            checked={dog.present}
            onChange={() => setDog({ ...dog, present: !dog.present })}
          />
          Är på dagis
        </label>

        <button type="submit">Spara</button>
      </form>
      <button onClick={() => navigate(`/profile/${id}`)}> Avbryt</button>
    </div>
  );
}

export default Edit;
