// Skapa ny hund
import { useState } from "react";
import { createDog } from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import "../components/DogProfile.css";
import "./Form.css"; // We'll create this new CSS file

function Create() {
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [name, setName] = useState("");
  const [nick, setNick] = useState("");
  const [bio, setBio] = useState("");
  const [age, setAge] = useState(0);
  const [present, setPresent] = useState(false);
  const [error, setError] = useState(""); // Lägger till ett felmeddelande
  const navigate = useNavigate();

  function handleImageChange(e) {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setImage(selectedFile);

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    // Kontrollerar att fälten inte är tomma
    if (!name.trim() || age <= 0) {
      setError("Fyll i namn och en ålder över 0");
      return;
    }

    // Fix the error handling section
    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("nick", nick.trim());
      formData.append("age", age.toString());
      formData.append("present", present.toString());
      formData.append("bio", bio.trim());

      if (image) {
        formData.append("image", image);
      }

      // Debug log
      console.log("sending dog data:");
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      // Rensar tidigare felmeddelanden
      setError("");

      // Skickar bilden och hundens data till backend
      const result = await createDog(formData);
      console.log("Dog created successfully:", result);
      navigate("/"); // Navigera tillbaka till startsidan efter skapandet
    } catch (err) {
      console.error("Fel vid skapande av hund:", err);
      if (err.response) {
        // Changed 'error' to 'err'
        // Om servern skickar ett felmeddelande
        setError(
          `Server error: ${
            err.response.data.message || err.response.statusText
          }`
        );
        console.error("Server response:", err.response.data);
      } else {
        setError("Fel vid skapande av hund. Försök igen senare.");
      }
    }
  }

  return (
    <div className="dog-profile">
      <h1 className="page-title">Lägg till en ny hund</h1>
      {error && <p className="error-message">{error}</p>}

      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="image">Profilbild:</label>
            <div className="image-upload-container">
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="image-input"
              />
              {imagePreview && (
                <div className="image-preview-container">
                  <img
                    src={imagePreview}
                    alt="Förhandsvisning"
                    className="image-preview"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="name">Namn:</label>
            <input
              id="name"
              type="text"
              placeholder="Namn"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nick">Smeknamn:</label>
            <input
              id="nick"
              type="text"
              placeholder="Smeknamn"
              value={nick}
              onChange={(e) => setNick(e.target.value)}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Beskrivning:</label>
            <textarea
              id="bio"
              placeholder="Skriv en kort beskrivning..."
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="form-control textarea"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Ålder:</label>
            <input
              id="age"
              type="number"
              placeholder="Ålder"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              className="form-control"
              required
              min="1"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={present}
                onChange={(e) => setPresent(e.target.checked)}
              />
              <span>Är på dagis</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Skapa
            </button>
            <Link to="/" className="cancel-btn">
              Avbryt
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Create;
