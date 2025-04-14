const fs = require("fs");
const path = require("path");
const https = require("https");

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Path for default dog image
const defaultImagePath = path.join(__dirname, "public/uploads/default-dog.png");

// Create a default placeholder image if it doesn't exist yet
if (!fs.existsSync(defaultImagePath)) {
  console.log("Default dog image not found. Creating placeholder image...");

  // Create a write stream for the file
  const file = fs.createWriteStream(defaultImagePath);

  // Download a generic dog silhouette placeholder
  // This is just a placeholder image with "Dog" text - not an actual dog photo
  const request = https.get(
    "https://via.placeholder.com/300x300?text=Default+Dog",
    (response) => {
      response.pipe(file);

      file.on("finish", () => {
        file.close();
        console.log(
          `Default placeholder image created at: ${defaultImagePath}`
        );
        console.log(`This image will be used when no dog image is uploaded.`);
      });
    }
  );

  request.on("error", (err) => {
    fs.unlink(defaultImagePath, () => {});
    console.error("Error downloading default placeholder image:", err.message);
  });
} else {
  console.log(
    `Default dog placeholder image already exists at: ${defaultImagePath}`
  );
}

console.log("Setup completed");
