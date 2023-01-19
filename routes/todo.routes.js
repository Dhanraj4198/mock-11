const express = require("express");
const jwt = require("jsonwebtoken");
const todoRouter = express.Router();
const { TodoModel } = require("../Models/Todo.model");

todoRouter.get("/", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, "private", async (err, decoded) => {
    if (err) {
      res.send("Please login again");
    } else if (decoded) {
      const userID = decoded.userID;
      let todos = await TodoModel.find({ userID: userID });
      res.send({ data: todos });
    }
  });
});

todoRouter.post("/create", async (req, res) => {
  console.log(req.headers);
  const token = req.headers.authorization?.split(" ")[1];
  console.log(token);
  jwt.verify(token, "private", async (err, decoded) => {
    if (err) {
      res.send("Please Login again");
    } else if (decoded) {
      const payload = req.body;
      const new_todo = new TodoModel(payload);
      await new_todo.save();
      res.send({ msg: "Note Created Successfully" });
    }
  });
});

todoRouter.patch("/update/:todoID", async (req, res) => {
  const payload = req.body;
  const todoID = req.params.todoID;
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, "private", async (err, decoded) => {
    if (err) {
      res.send("Please Login again");
    } else if (decoded) {
      const userID = decoded.userID;
      const todo = await TodoModel.findOne({ _id: todoID });
      if (userID !== todo.userID) {
        res.send("Not authorised");
      } else {
        await TodoModel.findByIdAndUpdate({ _id: todoID }, payload);
        res.send({ msg: "todo updated successfully" });
      }
    }
  });
});

todoRouter.delete("/delete/:todoID", async (req, res) => {
  const todoID = req.params.todoID;
  const todo = await TodoModel.findOne({ _id: todoID });
  const token = req.headers.authorization?.split(" ")[1];
  jwt.verify(token, "private", async (err, decoded) => {
    if (err) {
      res.send("Please Login again");
    } else if (decoded) {
      const userID = decoded.userID;
      if (userID !== todo.userID) {
        res.send("Not authorised");
      } else {
        await NoteModel.findByIdAndDelete({ _id: noteID });
        res.send({ msg: "Note deleted successfully" });
      }
    }
  });
});

module.exports = { todoRouter };
