const express = require("express");
const app = express();
const { connection } = require("./config/db");
const cors = require("cors");
const { signupRouter } = require("./routes/signup.routes");
const { loginRouter } = require("./routes/login.routes");
require("dotenv").config();

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);
app.get("/", (req, res) => {
  res.send("WELCOME");
});

app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connection to DB is Successfull");
  } catch (e) {
    console.log("Connection to DB Unsuccessfull");

    console.log(e.message);
  }
  console.log("YOUR PORT IS WORKING PROPERLY");
});
