const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const eventRoutes = require("./routes/events");
const goalRoutes = require("./routes/goals");

const app = express();
const PORT = process.env.PORT || 5000;
const dotenv = require("dotenv");

dotenv.config();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.use("/api/events", eventRoutes);
app.use("/api/goals", goalRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
