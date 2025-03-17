const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// Helper function for ObjectId validation
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/dogbook", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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
  nickname: String,
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  bio: String,
  imageUrl: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "Dog" }],
  present: Boolean,
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
  try {
    const dog = await Dog.findById(req.params.id).populate("friends");
    if (!dog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    res.json(dog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching dog", error: error.message });
  }
});

app.post("/dogs", async (req, res) => {
  const { name, age, present } = req.body;

  if (!name || name.trim() === "" || age === undefined || age <= 0) {
    return res.status(400).json({ message: "Namn och ålder krävs!" });
  }

  try {
    const newDog = new Dog({ name, age, present });
    await newDog.save();
    return res.status(201).json(newDog);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating dog", error: error.message });
  }
});

app.put("/dogs/:id", async (req, res) => {
  try {
    const updatedDog = await Dog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedDog) {
      return res.status(404).json({ message: "Dog not found" });
    }
    res.json(updatedDog);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating dog", error: error.message });
  }
});

app.delete("/dogs/:id", async (req, res) => {
  try {
    const deletedDog = await Dog.findByIdAndDelete(req.params.id);
    if (!deletedDog) {
      return res.status(404).json({ message: "Dog not found" });
    }
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
  console.log("Attempting to add friend:", { id, friendId });

  if (!isValidObjectId(id) || !isValidObjectId(friendId)) {
    console.log("Invalid ObjectId:", { id, friendId });
    return res.status(400).json({
      message: "Invalid ID format",
      details: { dogId: id, friendId },
    });
  }

  try {
    const dog = await Dog.findById(id);
    const friend = await Dog.findById(friendId);

    if (!dog || !friend) {
      console.log("Dog or friend not found:", {
        dogExists: !!dog,
        friendExists: !!friend,
      });
      return res.status(404).json({
        message: "Dog or friend not found",
        details: { dogId: id, friendId },
      });
    }

    // Check if they're already friends
    if (dog.friends.includes(friendId)) {
      return res.status(400).json({
        message: "Already friends",
        details: { dogId: id, friendId },
      });
    }

    // Add friend relationship
    dog.friends.push(friendId);
    friend.friends.push(id);

    // Save both documents
    await Promise.all([dog.save(), friend.save()]);

    // Populate and return updated dog
    const updatedDog = await dog.populate("friends");

    console.log("Friend added successfully");
    res.json({
      message: "Vänskap skapad!",
      dog: updatedDog,
    });
  } catch (error) {
    console.error("Error in addFriend:", error);
    res.status(500).json({
      message: "Error adding friend",
      error: error.message,
      stack: error.stack,
    });
  }
});

app.patch("/dogs/:id/removeFriend/:friendId", async (req, res) => {
  const { id, friendId } = req.params;

  if (!isValidObjectId(id) || !isValidObjectId(friendId)) {
    return res.status(400).json({
      message: "Invalid ID format",
      details: { dogId: id, friendId },
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
