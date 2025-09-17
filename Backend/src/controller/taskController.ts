import Task from "../config/db.js";
import type { Request, Response } from "express";

// ✅ Create a task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    const task = new Task({
      title,
      description,
      priority,
      dueDate,
      completed: completed === "yes" || completed === true, // ✅ handles string & boolean
      owner: req.user.id,
    });

    const saved = await task.save();
    res
      .status(201)
      .json({ success: true, task: saved, message: "Task successfully saved" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(400).json({ success: false, message: err.message });
    } else {
      res.status(400).json({ success: false, message: String(err) });
    }
  }
};

// ✅ Get all tasks for logged in user
export const getTask = async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({ owner: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, tasks });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: String(err) });
    }
  }
};

// ✅ Get single task by id
export const getTaskbyId = async (req: Request, res: Response) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, owner: req.user.id });
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }
    res.json({ success: true, task });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: String(err) });
    }
  }
};

// ✅ Update a task by id
export const updateTask = async (req: Request, res: Response) => {
  try {
    const data = { ...req.body };

    if (data.completed !== undefined) {
      data.completed = data.completed === "yes" || data.completed === true;
    }

    const updated = await Task.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      data,
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Task not found or not yours",
      });
    }

    res.json({ success: true, message: "Task updated", task: updated });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: String(err) });
    }
  }
};

// ✅ Delete a task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const deletedTask = await Task.findOneAndDelete({
      _id: req.params.id,
      owner: req.user.id,
    });

    if (!deletedTask) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found or not deleted" });
    }

    res.json({ success: true, message: "Task deleted" });
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ success: false, message: err.message });
    } else {
      res.status(500).json({ success: false, message: String(err) });
    }
  }
};
