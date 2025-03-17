// Skapa ny hund
import { useState } from "react";
import { createDog } from "../services/api";
import { useNavigate } from "react-router-dom";

function Create() {
  const [name, setName] = useState("");
  const [age, setAge] = useState(0);
  const [present, setPresent] = useState(false);
  const [error, setError] = useState(""); // Lägger till ett felmeddelande
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    // Kontrollerar att fälten inte är tomma
    if (!name.trim() || age <= 0) {
      setError("Fyll i namn och en ålder över 0");
      return;
    }

    await createDog({ name, age, present });
    navigate("/");
  }

  return (
    <div>
      <h1> Lägg till en ny hund</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Namn"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Ålder"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={present}
            onChange={(e) => setPresent(e.target.checked)}
          />
          Är på dagis
        </label>
        <button type="submit">Skapa</button>
      </form>
    </div>
  );
}

export default Create;
