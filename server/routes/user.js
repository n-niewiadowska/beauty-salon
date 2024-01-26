const express = require("express");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const { verify, verifyRole } = require("../middleware/verify");
const User = require("../models/user.model");

const router = express.Router();

// create an account
router.post("/sign-up", (req, res) => {
  const { name, surname, email, nickname, password } = req.body;
  const newUser = new User(req.body);

  User.findOne({ $or: [{ email }, { nickname }] })
    .then(existingUser => {
      if (existingUser) {
        let errorMessage = "";

        if (existingUser.email === email) {
          errorMessage = "User with this email already exists.";
        } else {
          errorMessage = "User with this nickname already exists.";
        }

        return res.status(404).send(errorMessage);
      }

      newUser.save()
        .then(savedUser => {
          const { __v, ...userData } = savedUser._doc;

          let options = {
            maxAge: 60 * 60 * 1000, 
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
          };

          const token = savedUser.generateAccessJWT(); 
          res.cookie("Session", token, options);
        
          fs.appendFile("logs.txt", 
            `${new Date().toLocaleString()} : User ${savedUser.nickname} created new account.\n`,
            (error) => {
              if (error) {
                console.log(error);
              }
            });
        
          res.status(200).json({ message: "Your account has been created successfully", user: userData });
        })
        .catch(error => res.status(500).send(error.message));
    })
    .catch(error => res.status(500).send(error.message));
});

// log in
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  User.findOne({ email: email }).select("+password")
    .then(user => {
      if (!user) {
        return res.status(401).send("Invalid e-mail.");
      }

      bcrypt.compare(`${password}`, user.password)
        .then(isPasswordValid => {
          if (!isPasswordValid) {
            return res.status(401).send("Invalid password");
          }

          let options = {
            maxAge: 60 * 60 * 1000, 
            httpOnly: true,
            secure: false,
            sameSite: "Lax"
          };
          
          const token = user.generateAccessJWT(); 
          res.cookie("Session", token, options);
      
          res.status(200).json({ message: "You logged in successfully.", user: user });
        })
        .catch(error => res.status(500).send(error.message));
    })
    .catch(error => res.status(500).send(error.message));
});

// log out
router.post("/logout", (req, res) => {
  res.clearCookie("Session");

  res.status(200).send("User logged out successfully.");
});

// delete an account
router.delete("/user", verify, (req, res) => {
  User.findByIdAndDelete(req.user.id)
    .then(user => {
      if (!user) {
        return res.status(404).send("User not found.");
      }

      res.clearCookie("Session");
      fs.appendFile("logs.txt", 
      `${new Date().toLocaleString()} : User ${req.user.nickname} deleted their account.\n`,
      (error) => {
        if (error) {
          console.log(error);
        }
      });
      
      res.status(200).send("Account deleted successfully.");
    })
    .catch(error => res.status(500).send(error.message));
});

// ADMIN

// get all users (and search by name/surname/nickname)
router.get("/", verify, verifyRole, (req, res) => {
  if (req.query.searchby) {
    const searchQuery = new RegExp(req.query.searchby, "i");

    User.find({
      $or: [
        { name: { $regex: searchQuery } },
        { surname: { $regex: searchQuery } },
        { nickname: { $regex: searchQuery } }
      ]
    }, {
      _id: 0,
      name: 1,
      surname: 1,
      nickname: 1
    })
      .then(users => res.status(200).send(users))
      .catch(error => res.status(500).send(error.message));
  } else {
    User.find({}, { _id: 0, email: 0, password: 0 })
    .then(users => {
      if (!users) {
        return res.status(404).send("No users found.");
      }

      res.status(200).send(users);
    })
    .catch(error => res.status(500).send(error.message));
  }
});

// get logs from the file
router.get("/logs", verify, verifyRole, (req, res) => {
  fs.readFile("logs.txt", "utf8", (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.status(200).send(data);
  })
});

// delete all logs from the file
router.delete("/logs/delete", verify, verifyRole, (req, res) => {
  fs.writeFile("logs.txt", "", err => {
    if(err) {
      console.error(err);
      return res.status(500).send(err.message);
    }
    res.status(200).send("Logs deleted successfully!");
  });
});

module.exports = router;