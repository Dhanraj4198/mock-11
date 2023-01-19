const express = require("express");
require("dotenv").config();
const { connection } = require("./config/db");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const bcrypt = require("bcrypt");
const { UserModel } = require("./Models/User.model");
const { todoRouter } = require("./routes/todo.routes");
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send("welcome");
});
app.use("/todos", todoRouter);
app.post("/signup", async (req, res) => {
  const { email, password, name, age } = req.body;

  const userPresent = await UserModel.findOne({ email });
  if (userPresent) {
    res.send("User already exists, Please try Logging in");
  } else {
    try {
      bcrypt.hash(password, 4, async (err, hash) => {
        if (err) {
          console.log(err);
        } else {
          const user = new UserModel({ email, password: hash, name, age });
          await user.save();
          res.send("Signup Successfull !!");
        }
      });
    } catch (err) {
      console.log(err);
      console.log("error in signup");
    }
  }
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.find({ email });

    if (user.length > 0) {
      const hashed_password = user[0].password;
      bcrypt.compare(password, hashed_password, function (err, result) {
        if (result) {
          const token = jwt.sign({ userID: user[0]._id }, "private");
          res.send({ msg: "Login successfull", token: token });
        } else {
          res.send("Login failed");
        }
      });
    } else {
      res.send("Login failed");
    }
  } catch {
    res.send("Something went wrong, please try again later");
  }
});

app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB Successfully");
  } catch (err) {
    console.log("Error connecting to DB");
    console.log(err);
  }
  console.log("Listening on PORT 8080");
});
