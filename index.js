const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();
const bd = require("body-parser");
const router = require("./router/userRouter");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

//mongo connection
mongoose.connect(process.env.DB_URL);
mongoose.connection.useDb("Assignment");
mongoose.connection.on("error", (err) => {
  console.log("failed to connect DataBase", err);
});
mongoose.connection.on("connected", (connected) => {
  console.log("Connected to Database");
});

// middlewares
app.use(
  cors({
    origin: "https://recordingapp.netlify.app",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(bd.urlencoded({ extended: false }));
app.use(bd.json());
app.use(router);


// handling 404
app.use((req, res, next) => {
  res.status(404).json({
    msg: "Bad Request page you request in not present",
  });
});

const port = process.env.PORT|| 3000;
app.listen(port, () => {
  console.log("sever started");
});
