var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect("../");
});

router.get('/signup', function (req, res, next) {
  let ctx = {
    title: 'AVEIRO|market - You buy, we deliver',
  }
  res.render('signup', ctx);
});

router.get('/signup/seller', function (req, res, next) {
  let ctx = {
    title: 'AVEIRO|market - You buy, we deliver',
  }
  res.render('signup_seller', ctx);
});

router.get('/dashboard', function (req, res, next) {
  let ctx = {
    title: 'AVEIRO|market - You buy, we deliver',
    user: {
      name: "John Doe",
      order_history: [{
          order_no: 123456789,
          date: "Jan 12, 2020",
          state: "On-Hold"
        },
        {
          order_no: 123456789,
          date: "Jan 12, 2020",
          state: "On-Hold"
        },
        {
          order_no: 123456789,
          date: "Jan 12, 2020",
          state: "On-Hold"
        }
      ],
    }
  }
  res.render('dashboard', ctx);
});

module.exports = router;