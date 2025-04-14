const eventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
  taskId: { type: mongoose.Schema.Types.ObjectId },
  goalId: { type: mongoose.Schema.Types.ObjectId, ref: "Goal" },
  createdAt: { type: Date, default: Date.now },
});
