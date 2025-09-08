
import { success } from "zod";
import Task from "../config/db.js";
import type { Request, Response } from "express";
// create a task
export const createTask = async (req: Request, res: Response) => {
    try {
        const { title, description, priority, dueDate, completed } = req.body;
        const task = new Task({
            title,
            description,
            priority,
            dueDate,
            completed:completed === 'yes' ||completed===true,
            owner:req.user.id
        });
const saved = await task.save()
res.status(201).json({success:true,task:saved, Message:"Task successfully saved"})    
} catch (err) {
         if (err instanceof Error) {
    res.status(400).json({ success: false, message: err.message });
  } else {
    res.status(400).json({ success: false, message: String(err) });
  }
    }
};

