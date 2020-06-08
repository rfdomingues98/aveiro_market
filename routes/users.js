const express = require('express');
const router = express.Router();
const passport = require("passport");
const crypto = require('crypto');
const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const fs = require('fs');
const path = require('path');

const {
  ensureCustomer,
  ensureSeller,
  forwardAuthenticated,
  ensureAuthenticated,
} = require("../config/auth");

const models = require('../db/models');
const Users = models.Users;
const Addresses = models.Addresses;

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'eu-west-3'
});

const s3 = new aws.S3();

const seller_signup = multer({
  fileFilter: (req, file, cb) => {
    fileCheck(file, cb);
  },
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      let name = 'seller-' + Date.now() + path.extname(file.originalname).toLowerCase();
      cb(null, 'sellers/' + name);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});

const fileCheck = (file, cb) => {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb('Permited files: .jpg, .jpeg & .png!');
  }
};

const global_ctx = {
  title: 'AVEIRO|market - You buy, we deliver',
}

/* GET users listing. */
router.get('/', (req, res, next) => {
  res.redirect("../");
});

router.get('/signup', forwardAuthenticated, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user
  }
  res.render('signup', ctx);
});

router.post('/signup', forwardAuthenticated, (req, res, next) => {
  const {
    firstName,
    lastName,
    emailAddress,
    mobileNumber,
    password1,
    password2,
    agree
  } = req.body;
  if (!agree) {
    req.flash('warning_msg', 'Can\'t signup without agreeing with our Terms & Conditions');
    res.redirect('./signup');
  } else if (!firstName || !lastName || !emailAddress || !mobileNumber || !password1 || !password2) {
    req.flash('warning_msg', 'Please fill all required fields.');
    res.redirect('./signup');
  } else if (password1 !== password2) {
    req.flash('warning_msg', 'The passwords dont match.');
    res.redirect('./signup');
  } else if (password1.length < 8 || !/\d/.test(password1)) {
    req.flash('warning_msg', 'Password must contain at least 8 characters and 1 digit.');
    res.redirect('./signup');
  } else {
    Users.findOne({
        where: {
          email: emailAddress
        }
      })
      .then(user => {
        if (user) {
          req.flash('warning_msg', 'That email is already registered.');
          res.redirect('./signup');
        } else {
          let newUser = {
            userType: 0,
            email: emailAddress,
            password: crypto.createHash('md5').update(password1).digest('hex'),
            displayName: '',
            firstName,
            lastName,
            phone: mobileNumber
          }
          Users.create(newUser)
            .then(() => {
              console.log('MARIADB: User successfuly created!');
              req.flash('success_msg', 'Account successfuly created!');
              res.redirect('/');
            })
            .catch(err => {
              console.log('MARIADB: ERROR! ', err);
            })
        }
      })
  }
})

router.get('/signup/seller', forwardAuthenticated, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  res.render('signup_seller', ctx);
});

router.post('/signup/seller', forwardAuthenticated, seller_signup.array('images', 2), (req, res, next) => {
  let {
    displayName,
    address,
    emailAddress,
    mobileNumber,
    facebook,
    instagram,
    password1,
    password2,
    agree
  } = req.body;

  if (!agree) {
    req.flash('warning_msg', 'Can\'t signup without agreeing with our Terms & Conditions');
    res.redirect('./signup/seller');
  } else if (req.files.length != 2 || !displayName || !address || !emailAddress || !mobileNumber || !password1 || !password2) {
    req.flash('warning_msg', 'Please fill all required fields.');
    res.redirect('./signup/seller');
  } else if (password1 !== password2) {
    req.flash('warning_msg', 'The passwords dont match.');
    res.redirect('./signup/seller');
  } else if (password1.length < 8 || !/\d/.test(password1)) {
    req.flash('warning_msg', 'Password must contain at least 8 characters and 1 digit.');
    res.redirect('./signup/seller');
  } else {
    Users.findOne({
        where: {
          email: emailAddress
        }
      })
      .then(user => {
        if (user) {
          req.flash('warning_msg', 'That email is already registered.');
          res.redirect('./signup/seller');
        } else {
          Users.findOne({
              where: {
                displayName
              }
            })
            .then(user => {
              if (user) {

                req.flash('warning_msg', 'That display name aleady exists.');
                res.redirect('./signup/seller')
              } else {

                let newUser = {
                  userType: 1,
                  email: emailAddress,
                  password: crypto.createHash('md5').update(password1).digest('hex'),
                  displayName,
                  firstName: '',
                  lastName: '',
                  logo: req.files[0].key.replace('sellers/', ''),
                  banner: req.files[1].key.replace('sellers/', ''),
                  facebook,
                  instagram,
                  address,
                  phone: mobileNumber
                }
                Users.create(newUser)
                  .then(() => {
                    console.log('MARIADB: User successfuly created!');
                    req.flash('success_msg', 'Account successfuly created!');
                    res.redirect('/');
                  })
                  .catch(err => {
                    console.log('MARIADB: ERROR! ', err);
                  })
              }
            })
        }
      })
  }
});

router.post("/login", forwardAuthenticated, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "./dashboard",
    failureRedirect: "/",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", ensureAuthenticated, (req, res) => {
  req.logout();
  req.flash("success_msg", "Logged out successfully!");
  res.redirect("/");
});

router.get('/edit', ensureCustomer, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user
  }
  res.render('edit_customer', ctx);
});


router.get('/edit/seller', ensureSeller, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  res.render('edit_seller', ctx);
});

router.get('/dashboard', ensureAuthenticated, (req, res, next) => {
  /*let ctx = {
    ...global_ctx,
    user: {
      name: "John Doe",
      type: {
        isCustomer: false,
        isSeller: true,
      },
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
    },
    catalog: [{
        name: "Test 1",
        price: "123",
        stock: 123,
        image: "blue-tshirt.jpg",
        stockQty: true,
        stockWeight: false
      },
      {
        name: "Test 1",
        price: "123",
        stock: 123,
        image: "blue-tshirt.jpg",
        stockQty: true,
        stockWeight: false
      },
      {
        name: "Test 1",
        price: "123",
        stock: 123,
        image: "blue-tshirt.jpg",
        stockQty: true,
        stockWeight: false
      }
    ],
    orders: [{
        order_no: 123456789,
        price: 132

      },
      {
        order_no: 123456789,
        price: 231,

      },
      {
        order_no: 123456789,
        price: 123

      }
    ],
  } */



  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  res.render('dashboard', ctx);
});

router.get('/dashboard/order/:id', ensureCustomer, (req, res, next) => {
  let order = {
    order_no: 123456789,
    date: "Jan 12, 2020",
    state: "On-Hold",
    payment_method: 'Paypal',
    products: [{
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      },
      {
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      },
      {
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      }
    ],
  };
  totalPrice = 0;
  order.products.forEach(element => {
    totalPrice += element.amount;
  });
  order.totalPrice = totalPrice;
  let ctx = {
    ...global_ctx,
    order: order,
  }

  res.render('order_status', ctx);
});

router.get('/dashboard/manage/:id', ensureSeller, (req, res, next) => {
  let order = {
    order_no: 123456789,
    date: "Jan 12, 2020",
    state: "On-Hold",
    payment_method: 'Paypal',
    products: [{
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      },
      {
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      },
      {
        name: 'Test 1',
        weight: '2.31',
        quantity: '-',
        amount: 9.49,
      }
    ],
  };
  totalPrice = 0;
  order.products.forEach(element => {
    totalPrice += element.amount;
  });
  order.totalPrice = totalPrice;
  let ctx = {
    ...global_ctx,
    order: order,
  }
  res.render('manage_order', ctx);
});

module.exports = router;