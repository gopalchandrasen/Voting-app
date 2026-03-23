const express = require("express");
const app = express();
const path = require("path");
require("dotenv").config();
const bodyParser = require("body-parser");
app.use(bodyParser.json());
const userRoute = require("./routes/userRoute");
const { connectToMongoDB } = require("./connect");
const PORT = process.env.PORT || 8003;

//Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View Engine
app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

// Routes
app.use("/", userRoute);

// MongoDB Connection
connectToMongoDB("mongodb://127.0.0.1:27017/VotingDB")
  .then(() => console.log("DB connected successfully"))
  .catch((err) => console.error(err));

app.listen(PORT, () =>
  console.log(`Server started at port http://localhost:${PORT}`)
);
