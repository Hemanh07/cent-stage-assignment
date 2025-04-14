const express = require("express");
const router = express.Router();
const Goal = require("../models/Goal");

// GET all goals
router.get("/", async (req, res) => {
  try {
    const goals = await Goal.find();
    res.json(goals);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST new goal
router.post("/", async (req, res) => {
  const goal = new Goal({
    name: req.body.name,
    color: req.body.color,
  });

  try {
    const newGoal = await goal.save();
    res.status(201).json(newGoal);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// POST new task to a goal
router.post("/:id/tasks", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    const task = {
      name: req.body.name,
      completed: false,
    };

    goal.tasks.push(task);
    const updatedGoal = await goal.save();

    // Return the newly created task
    const newTask = updatedGoal.tasks[updatedGoal.tasks.length - 1];
    res.status(201).json(newTask);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update task in a goal
router.put("/:goalId/tasks/:taskId", async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.goalId);
    if (!goal) return res.status(404).json({ message: "Goal not found" });

    const task = goal.tasks.id(req.params.taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    // Update task properties
    if (req.body.name) task.name = req.body.name;
    if (req.body.completed !== undefined) task.completed = req.body.completed;

    await goal.save();
    res.json(task);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
