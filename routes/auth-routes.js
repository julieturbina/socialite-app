const passport = require("passport");
const ensureLogin = require("connect-ensure-login");
const express = require("express");
const authRoutes = express.Router();

// User model
const User           = require("../models/user");

// BCrypy encrypt passwords
const bcrypt         = require("bcrypt");
const bcryptSalt     = 10;

//FACEBOOK===================
authRoutes.get("/auth/facebook", passport.authenticate("facebook"));
authRoutes.get("/auth/facebook/callback", passport.authenticate("facebook", {
  successRedirect: "/private-page",
  failureRedirect: "/"
}));

authRoutes.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/login");
});

// authRoutes.get("/home", ensureLogin.ensureLoggedIn(), (req, res) => {
//   res.render("/private", { user: req.user });
// });


authRoutes.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});
authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.post("/signup", (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username === "" || password === "") {
      res.render("auth/signup", { message: "Indicate username and password" });
      return;
    }
      
    User.findOne({ username })
    .then(user => {
      if (user !== null) {
        res.render("auth/signup", { message: "The username already exists" });
        return;
      }
  

    const salt     = bcrypt.genSaltSync(bcryptSalt);
    const hashPass = bcrypt.hashSync(password, salt);
    
    const newUser = new User({
      username,
      password: hashPass
    });

    newUser.save((err) => {
      if (err) {
        res.render("auth/signup", { message: "Something went wrong" });
      } else {
        res.redirect("/");
      }
    });
  })
  .catch(error => {
    next(error);
  });
});
 

authRoutes.get("/login", (req, res, next) => {
  res.render("auth/login", { "message": req.flash("error") });
});

authRoutes.post("/login", passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/login",
  failureFlash: true,
  passReqToCallback: true
}));

authRoutes.post("/login", (req, res, next) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username === "" || password === "") {
    res.render("auth/login", {
      errorMessage: "Indicate a username and a password to sign up"
    });
    return;
  }

  User.findOne({ "username": username }, (err, user) => {
      if (err || !user) {
        res.render("auth/login", {
          errorMessage: "The username doesn't exist"
        });
        return;
      }
      if (bcrypt.compareSync(password, user.password)) {
        // Save the login in the session!
        req.session.currentUser = user;
        res.redirect("/layout");
      } else {
        res.render("auth/login", {
          errorMessage: "Incorrect password"
        });
      }
      authRoutes.get("/private-page", ensureLogin.ensureLoggedIn(), (req, res) => {
        res.render("private", { user: req.user });
      });

      authRoutes.get("/logout", (req, res) => {
        req.logout();
        res.redirect("/login");
      });
  });
});

module.exports = authRoutes;