import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDogById, updateDog } from "../services/api";
import "../components/DogProfile.css";
import "./Form.css";

function Edit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [dog, setDog] = useState({
    name: "",
    nickname: "",
    age: "",
    present: false,
    bio: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDog() {
      const data = await getDogById(id);
      if (data) {
        setDog(data);
        if (data.imagePath) {
          setImagePreview(`http://localhost:5001${data.imagePath}`);
        }
      }
    }
    fetchDog();
  }, [id]);

  function handleChange(e) {
    setDog({ ...dog, [e.target.name]: e.target.value });
  }

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

    try {
      const formData = new FormData();
      formData.append("name", dog.name);
      formData.append("nick", dog.nick);
      formData.append("age", dog.age);
      formData.append("present", dog.present.toString());
      formData.append("bio", dog.bio || "");

      if (image) {
        formData.append("image", image);
      }

      await updateDog(id, formData);
      navigate(`/profile/${id}`);
    } catch (err) {
      console.error("Error updating dog:", err);
      setError("Fel vid uppdatering av hund. Försök igen senare.");
    }
  }

  if (!dog.name) return <p>Laddar...</p>;

  return (
    <div className="dog-profile">
      <h1 className="page-title">Redigera {dog.name}</h1>
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
              name="name"
              value={dog.name}
              onChange={handleChange}
              className="form-control"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="nickname">Smeknamn:</label>
            <input
              id="nickname"
              type="text"
              name="nickname"
              value={dog.nickname || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="form-group">
            <label htmlFor="age">Ålder:</label>
            <input
              id="age"
              type="number"
              name="age"
              value={dog.age}
              onChange={handleChange}
              className="form-control"
              required
              min="1"
            />
          </div>

          <div className="form-group">
            <label htmlFor="bio">Biografi:</label>
            <textarea
              id="bio"
              name="bio"
              value={dog.bio || ""}
              onChange={handleChange}
              className="form-control textarea"
              rows="3"
            />
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="present"
                checked={dog.present}
                onChange={() => setDog({ ...dog, present: !dog.present })}
              />
              <span>Är på dagis</span>
            </label>
          </div>

          <div className="form-actions">
            <button type="submit" className="submit-btn">
              Spara
            </button>
            <button
              type="button"
              onClick={() => navigate(`/profile/${id}`)}
              className="cancel-btn"
            >
              Avbryt
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Edit;
