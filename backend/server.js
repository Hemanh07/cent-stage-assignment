const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/events");
const goalRoutes = require("./routes/goals");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://crazydeveloperr007:kitk@t112@cluster0.uwqknwm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/api/events", eventRoutes);
app.use("/api/goals", goalRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
