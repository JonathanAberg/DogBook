const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.json());
app.use(cors());

// Make public directory available as static files
app.use(express.static("public"));

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "public/uploads");
if (!fs.existsSync(uploadsDir)) {
  console.log(`Creating uploads directory: ${uploadsDir}`);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage: storage });

// Helper function for ObjectId validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Make uploads directory available as static resource
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/dogBook", {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error);
  });

// Dog Schema
const dogSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  nick: {
    type: String,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  present: {
    type: Boolean,
    default: false,
  },
  bio: String,
  imagePath: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dog" }],
});

const Dog = mongoose.model("Dog", dogSchema);

// Routes
app.get("/dogs", async (req, res) => {
  try {
    const dogs = await Dog.find().populate("friends");
    res.json(dogs);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dogs", error: error.message });
  }
});

app.get("/dogs/:id", async (req, res) => {
  const { id } = req.params;

  try {
    if (!isValidObjectId(id)) {
      return res.status(400).json({ message: "Ogiltigt hund-ID format" });
    }

    const dog = await Dog.findById(id).populate("friends");
    if (!dog) {
      return res.status(404).json({ message: "Hund hittades inte!" });
    }
    res.json(dog);
  } catch (error) {
    console.error("Error fetching dog:", error);
    res.status(500).json({
      message: "Fel vid hämtning av hund",
      error: error.message,
    });
  }
});

app.post("/dogs", upload.single("image"), async (req, res) => {
  try {
    const { name, nick, age, present, bio } = req.body;

    // Validate required fields
    if (!name || !age) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newDog = new Dog({
      name,
      nick,
      age: Number(age),
      present: present === "true",
      bio,
      imagePath: req.file ? `/uploads/${req.file.filename}` : null,
      friends: [],
    });

    const savedDog = await newDog.save();
    res.status(201).json(savedDog);
  } catch (error) {
    console.error("Create error:", error);
    res.status(500).json({
      message: "Error creating dog",
      error: error.message,
    });
  }
});

app.patch("/dogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, nick, nickname, age, present, bio } = req.body;

    const updateData = {
      name,
      nick: nick || nickname,
      age: Number(age),
      present: present === "true",
      bio,
    };

    // Only update the image path if a new image is uploaded
    if (req.file) {
      updateData.imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedDog = await Dog.findByIdAndUpdate(id, updateData, {
      new: true,
    }).populate("friends");

    if (!updatedDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    res.json(updatedDog);
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({
      message: "Error updating dog",
      error: error.message,
    });
  }
});

app.delete("/dogs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedDog = await Dog.findByIdAndDelete(id);
    if (!deletedDog) {
      return res.status(404).json({ message: "Dog not found" });
    }

    // Remove the deleted dog from all friends lists
    await Dog.updateMany({ friends: id }, { $pull: { friends: id } });

    res.json({ message: "Dog deleted" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting dog", error: error.message });
  }
});

// Friend management routes
app.patch("/dogs/:id/addFriend/:friendId", async (req, res) => {
  const { id, friendId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(friendId)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  try {
    const dog = await Dog.findById(id);
    const friend = await Dog.findById(friendId);

    if (!dog || !friend) {
      return res.status(404).json({
        message: "Dog or friend not found",
      });
    }

    // Check if they're already friends
    if (dog.friends.includes(friendId)) {
      return res.status(400).json({
        message: "Already friends",
      });
    }

    // Add friend relationship
    dog.friends.push(friendId);
    friend.friends.push(id);

    // Save both documents
    await Promise.all([dog.save(), friend.save()]);

    // Populate and return updated dog
    const updatedDog = await dog.populate("friends");

    res.json({
      message: "Vänskap skapad!",
      dog: updatedDog,
    });
  } catch (error) {
    console.error("Error in addFriend:", error);
    res.status(500).json({
      message: "Error adding friend",
      error: error.message,
    });
  }
});

app.patch("/dogs/:id/removeFriend/:friendId", async (req, res) => {
  const { id, friendId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(friendId)) {
    return res.status(400).json({
      message: "Invalid ID format",
    });
  }

  try {
    const dog = await Dog.findById(id);
    const friend = await Dog.findById(friendId);

    if (!dog || !friend) {
      return res.status(404).json({ message: "Hund eller vän hittades inte" });
    }

    dog.friends = dog.friends.filter((f) => f.toString() !== friendId);
    await dog.save();

    friend.friends = friend.friends.filter((f) => f.toString() !== id);
    await friend.save();

    res.json({ message: "Vänskap borttagen!", dog });
  } catch (error) {
    res.status(500).json({
      message: "Fel vid borttagning av vänskap",
      error: error.message,
    });
  }
});

const PORT = 5001;
app
  .listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start:", error);
  });
