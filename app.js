require("dotenv").config();
const express = require("express");
const app = express();
const Pool = require("./models/pool");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//mongoose connection
const mongoose = require("mongoose");
mongoose.connect(process.env.DB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

//post route to create a new pool
app.post("/createpool", (req, res) => {
  console.log(req.body);
  const pool = new Pool({
    name: req.body.name,
  });
  pool.save();
  res.send(pool);
});

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
