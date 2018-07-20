const express = require('express');
const router  = express.Router();

/* GET home page */
// router.get('/', (req, res, next) => {
//   res.render('index');
// });


//test below

router.get('/', (req, res, next) => {
  let data = {
    userName: "User",
    bootcamp: "<span>Socialite</span>"
    // cities: ["Miami", "London", "Paris", "Belize", "Dubai", ]
  };
  res.render('index', data);
});

// router.get('/layout', (req, res, next) => {
//   res.render('layout');
// });

// router.get('/private', (req, res, next) => {
//   res.render('private');
// });

module.exports = router;
