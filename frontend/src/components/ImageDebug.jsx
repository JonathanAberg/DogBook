import React, { useState } from "react";
import { getImageUrl, getDebugPaths } from "../services/api";

const ImageDebug = () => {
  const [debugInfo, setDebugInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const checkImage = async () => {
    setLoading(true);
    try {
      const data = await getDebugPaths();
      setDebugInfo(data);
    } catch (error) {
      console.error("Error fetching debug info:", error);
    } finally {
      setLoading(false);
    }
  };

  // Test images with different paths
  const defaultImage = getImageUrl();
  const relativeImage = getImageUrl("/uploads/default-dog.png");
  const explicitDefaultImage = getImageUrl("default-dog.png");

  return (
    <div
      style={{
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "5px",
        margin: "20px",
      }}
    >
      <h2>Image Debug Tool</h2>

      <div style={{ marginBottom: "20px" }}>
        <h3>Test Images</h3>
        <div style={{ display: "flex", gap: "20px" }}>
          <div>
            <p>Default Image (no path):</p>
            <img
              src={defaultImage}
              alt="Default"
              style={{ maxWidth: "100px", border: "1px solid #999" }}
              onError={(e) => {
                console.error("Default image failed to load");
                e.target.style.border = "2px solid red";
              }}
            />
            <p>
              <small>{defaultImage}</small>
            </p>
          </div>

          <div>
            <p>Relative Path:</p>
            <img
              src={relativeImage}
              alt="Relative"
              style={{ maxWidth: "100px", border: "1px solid #999" }}
              onError={(e) => {
                console.error("Relative image failed to load");
                e.target.style.border = "2px solid red";
              }}
            />
            <p>
              <small>{relativeImage}</small>
            </p>
          </div>

          <div>
            <p>Explicit Filename:</p>
            <img
              src={explicitDefaultImage}
              alt="Explicit"
              style={{ maxWidth: "100px", border: "1px solid #999" }}
              onError={(e) => {
                console.error("Explicit image failed to load");
                e.target.style.border = "2px solid red";
              }}
            />
            <p>
              <small>{explicitDefaultImage}</small>
            </p>
          </div>
        </div>
      </div>

      <button onClick={checkImage} disabled={loading}>
        {loading ? "Loading..." : "Check Server Paths"}
      </button>

      {debugInfo && (
        <div style={{ marginTop: "20px" }}>
          <h3>Server Debug Info:</h3>
          <pre
            style={{
              background: "#f5f5f5",
              padding: "10px",
              borderRadius: "5px",
              overflowX: "auto",
            }}
          >
            {JSON.stringify(debugInfo, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ImageDebug;
