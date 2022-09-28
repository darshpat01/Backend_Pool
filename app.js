require("dotenv").config();
const express = require("express");
const app = express();
const Pool = require("./models/pool");
const User = require("./models/user");
const Match = require("./models/match");

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

//ROUTES

//post route to create a new pool
app.post("/createpool", (req, res) => {
  console.log(req.body);
  const pool = new Pool({
    name: req.body.name,
  });
  pool.save();
  res.send(pool);
});

//create user
app.post("/createuser", (req, res) => {
  console.log(req.body);
  const user = new User({
    name: req.body.name,
    occupation: req.body.occupation,
    age: req.body.age,
  });
  user.save();
  res.send(user);
});

//add user to pool
app.post("/adduser", (req, res) => {
  console.log(req.body);
  Pool.findById(req.body.poolId, (err, pool) => {
    pool.users.push(req.body.userId);
    //add pool to user
    User.findById(req.body.userId, (err, user) => {
      user.pool = req.body.poolId;
      user.save();
    });
    pool.save();
    res.send(pool);
  });
  console.log("user added to pool");
});

//check if user is in the pool and match it to another user in the pool if they have the same occupation and highest age difference, then remove both users from the pool and add to them to the match table
app.post("/match", (req, res) => {
  console.log(req.body);
  Pool.findById(req.body.poolId, (err, pool) => {
    //check if user is in the pool
    if (pool.users.includes(req.body.userId)) {
      //find user in pool
      User.findById(req.body.userId, (err, user) => {
        //find users in pool with the same occupation
        User.find({ occupation: user.occupation }, (err, users) => {
          //find the user with the highest age difference
          let highestAgeDifference = 0;
          let highestAgeDifferenceUser = null;
          users.forEach((user_each) => {
            if (Math.abs(user_each.age - user.age) > highestAgeDifference) {
              highestAgeDifference = Math.abs(user_each.age - user.age);
              highestAgeDifferenceUser = user_each;
            }
          });
          //add both users to the match table
          const match = new Match({
            user1: req.body.userId,
            user2: highestAgeDifferenceUser._id,
          });
          //console the name of both the matched users
          console.log(
            `Matched ${user.name} with ${highestAgeDifferenceUser.name}`
          );

          match.save();
          //remove both users from the pool
          pool.users.pull(req.body.userId);
          pool.users.pull(highestAgeDifferenceUser._id);
          pool.save();
          res.send(match);

          //remove pool from both users
          User.findById(req.body.userId, (err, user) => {
            user.pool = null;
            user.save();
          });
          User.findById(highestAgeDifferenceUser._id, (err, user) => {
            user.pool = null;
            user.save();
          });
        });
      });
    } else {
      res.send("user not in pool");
    }
  });
});

//add all users to the pool
app.post("/addall", (req, res) => {
  console.log(req.body);
  User.find({}, (err, users) => {
    users.forEach((user) => {
      Pool.findById(req.body.poolId, (err, pool) => {
        pool.users.push(user._id);
        pool.save();
      });
    });
  });
  res.send("all users added to pool");
  //add pool to all users
  User.find({}, (err, users) => {
    users.forEach((user) => {
      User.findById(user._id, (err, user) => {
        user.pool = req.body.poolId;
        user.save();
      });
    });
  });
});

//remove all users from the pool
app.delete("/removeall", (req, res) => {
  console.log(req.body);
  Pool.findById(req.body.poolId, (err, pool) => {
    pool.users = [];
    pool.save();
  });
  res.send("all users removed from pool");
});

//get route to get all pools
app.get("/pools", (req, res) => {
  Pool.find({}, (err, pools) => {
    res.send(pools);
  });
});

//delete all matches
app.delete("/deletematches", (req, res) => {
  Match.deleteMany({}, (err) => {
    res.send("all matches deleted");
  });
});

app.listen(3000, () => {
  console.log("listening on port 3000!");
});
