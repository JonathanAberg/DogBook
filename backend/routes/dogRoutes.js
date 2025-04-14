const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Dog = require("../models/Dog");

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// deleteFile function with absolute path handling
const deleteFile = (filePath) => {
  try {
    // Make sure we have a file path
    if (!filePath) {
      console.log("No file path provided for deletion");
      return;
    }

    // Skip default images
    if (filePath.includes("default-dog.png")) {
      console.log("Skipping deletion of default image");
      return;
    }

    // Extract the filename from the path
    let filename;
    if (filePath.startsWith("/uploads/")) {
      filename = filePath.substring("/uploads/".length);
    } else if (filePath.includes("/uploads/")) {
      filename = filePath.split("/uploads/").pop();
    } else {
      filename = filePath;
    }

    // Use absolute path to the project root
    const projectRoot = path.resolve(__dirname, "../..");
    const fullPath = path.join(projectRoot, "public/uploads", filename);

    console.log(`Project root directory: ${projectRoot}`);
    console.log(`Full path to file: ${fullPath}`);

    // Check if file exists before attempting to delete
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      console.log(`Successfully deleted file: ${fullPath}`);
      return true;
    } else {
      // Try an alternative path
      const altPath = path.join(process.cwd(), "public/uploads", filename);
      console.log(`File not found. Trying alternative path: ${altPath}`);

      if (fs.existsSync(altPath)) {
        fs.unlinkSync(altPath);
        console.log(`Successfully deleted file at alt path: ${altPath}`);
        return true;
      } else {
        console.log(
          `File not found at alternative path either. Cannot delete.`
        );
        // List contents of uploads directory
        try {
          const uploadsDir = path.join(process.cwd(), "public/uploads");
          const files = fs.readdirSync(uploadsDir);
          console.log("Files in uploads directory:");
          files.forEach((file) => console.log(` - ${file}`));
        } catch (e) {
          console.error("Error listing uploads directory:", e);
        }
        return false;
      }
    }
  } catch (error) {
    console.error("Error during file deletion:", error);
    return false;
  }
};

// Modify the route handlers that create or update dogs
router.post("/dogs", upload.single("image"), async (req, res) => {
  try {
    const dogData = req.body;

    // Set default image path if no image was uploaded
    if (req.file) {
      dogData.imagePath = `/uploads/${req.file.filename}`;
    } else {
      dogData.imagePath = "/uploads/default-dog.png";
    }

    const newDog = await Dog.create(dogData);
    res.status(201).json(newDog);
  } catch (error) {
    console.error("Error creating dog:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Make sure the profile picture update route also handles missing images
router.patch(
  "/dogs/:id/profile-picture",
  upload.single("image"),
  async (req, res) => {
    try {
      const { id } = req.params;
      const { oldImagePath } = req.body;

      console.log("Profile picture update request received:");
      console.log("- Dog ID:", id);
      console.log("- Old image path:", oldImagePath);
      console.log("- New image file:", req.file ? req.file.filename : "None");

      // Set imagePath - use default if no file uploaded
      let imagePath;
      if (req.file) {
        imagePath = `/uploads/${req.file.filename}`;

        // Delete the old profile picture if it exists and isn't the default
        if (oldImagePath && !oldImagePath.includes("default-dog.png")) {
          console.log(
            `Attempting to delete old profile picture: ${oldImagePath}`
          );
          deleteFile(oldImagePath);
        }
      } else {
        imagePath = "/uploads/default-dog.png";
      }

      // Update the dog with the new image path
      const updatedDog = await Dog.findByIdAndUpdate(
        id,
        { imagePath },
        { new: true }
      );

      if (!updatedDog) {
        return res.status(404).json({ message: "Dog not found" });
      }

      console.log(`Profile picture updated successfully for dog ${id}`);
      res.status(200).json(updatedDog);
    } catch (error) {
      console.error("Error updating dog profile picture:", error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
);

// Test route for direct file deletion
router.delete("/test-delete/:filename", (req, res) => {
  const { filename } = req.params;
  console.log(`Testing direct deletion of file: ${filename}`);

  try {
    // Try multiple path combinations
    const paths = [
      path.join(__dirname, "../public/uploads", filename),
      path.join(process.cwd(), "public/uploads", filename),
      path.resolve("public/uploads", filename),
    ];

    let deleted = false;

    for (const testPath of paths) {
      console.log(`Testing path: ${testPath}`);
      if (fs.existsSync(testPath)) {
        fs.unlinkSync(testPath);
        console.log(`Successfully deleted file at: ${testPath}`);
        deleted = true;
        break;
      } else {
        console.log(`File not found at: ${testPath}`);
      }
    }

    if (deleted) {
      res
        .status(200)
        .json({ success: true, message: "File deleted successfully" });
    } else {
      res
        .status(404)
        .json({ success: false, message: "File not found in any location" });
    }
  } catch (error) {
    console.error("Error in direct file deletion:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Debug route to check paths and list files
router.get("/debug-paths", (req, res) => {
  try {
    const pathInfo = {
      cwd: process.cwd(),
      dirname: __dirname,
      resolvedUploadPath: path.resolve("public/uploads"),
      joinedUploadPath: path.join(__dirname, "../public/uploads"),
      uploadsExists: fs.existsSync(path.join(__dirname, "../public/uploads")),
    };

    // List files in uploads directory
    try {
      const uploadsPath = path.join(__dirname, "../public/uploads");
      if (fs.existsSync(uploadsPath)) {
        pathInfo.files = fs.readdirSync(uploadsPath);
      } else {
        pathInfo.files = "Uploads directory not found";
      }
    } catch (e) {
      pathInfo.filesError = e.message;
    }

    res.status(200).json(pathInfo);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
