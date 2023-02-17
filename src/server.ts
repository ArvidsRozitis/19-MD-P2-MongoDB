import express from "express";
import { Request, Response } from "express";
import bodyparser from "body-parser";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// getting-started.js

mongoose.connect("mongodb://127.0.0.1:27017/myapp");

const schema = new mongoose.Schema({
  name: "string",
  title: "string",
  content: "string",
  date: "string",
  isDone: Boolean,
});

const ToDo = mongoose.model("ToDo", schema);

app.use(bodyparser.json());
app.use(cors({ origin: "*" }));

// get all tasks
app.get("/tasks", async (req, res) => {
  const allTasks = await ToDo.find();
  return res.status(200).json(allTasks);
});

// post new task
app.post("/tasks/post", async (req: Request, res: Response) => {
  console.log(req.body);
  const newTask = req.body.newTask;
  if (!newTask || !newTask.title || !newTask.content) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  const newTodo = new ToDo({
    title: newTask.title,
    content: newTask.content,
    date: formattedDate,
    isDone: newTask.isDone || false, // Set isDone to false if it is not provided
  });
  try {
    const insertedTask = await newTodo.save();
    return res.status(201).json(insertedTask);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// deleteTask
app.delete("/tasks/delete/:id", async (req: Request, res: Response) => {
  const taskId = req.params.id;
  try {
    const deletedTask = await ToDo.findOneAndDelete({ _id: taskId });
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    return res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/", (req: Request, res: Response) => {
  res.send("Application works!");
});

app.listen(3004, () => {
  console.log("Application started on port 3004!");
});

const date = new Date();
const formattedDate = date.toLocaleDateString("en-US");
