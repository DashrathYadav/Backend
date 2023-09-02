const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bodyParser = require("body-parser");
const router = require("./router/userRouter");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

mongoose.connect(process.env.DB_URL);
mongoose.connection.useDb("Assignment");
mongoose.connection.on("error", (err) => {
  console.log("failed to connect DataBase", err);
});
mongoose.connection.on("connected", (connected) => {
  console.log("Connected to Database");
});

//recordingapp.netlify.app
//http://localhost:5173
app.use(
  cors({
    origin: "https://recordingapp.netlify.app",
    credentials: true,
  })
);

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(router);
app.use((req, res, next) => {
  res.status(400).json({
    msg: "Bad Request page you request in not present",
  });
});

const port = process.env.PORT|| 3000;
app.listen(port, () => {
  console.log("sever started at", "http://localhost:3000");
});
