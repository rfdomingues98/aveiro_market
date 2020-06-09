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
const Categories = models.Categories;
const Products = models.Products;
const Orders = models.Orders;

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

const product_add = multer({
  fileFilter: (req, file, cb) => {
    fileCheck(file, cb);
  },
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    key: (req, file, cb) => {
      let name = 'product-' + Date.now() + path.extname(file.originalname).toLowerCase();
      cb(null, 'products/' + name);
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
  req.session.cart = {};
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

router.get('/dashboard', ensureAuthenticated, async (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }

  if (req.user.userType == 1) {
    await Products.findAll({
      where: {
        seller: req.user.id
      }
    }).then(catalog => {
      if (catalog.length > 0)
        ctx.catalog = catalog
    }).catch(err => {
      console.log('ERROR! Couldnt get seller catalog!', err);
    })
    await Categories.findAll()
      .then(categories => {
        ctx.categories = categories;
      })
      .catch(err => {
        console.log('ERROR! Couldnt get the categories.', err);
      })
    await Orders.findAll({
        where: {
          idSeller: req.user.id,
          state: 0
        }
      })
      .then(result => {
        result.forEach(item => {
          item.dataValues.date = item.dataValues.date.toLocaleString('pt-PT', {
            timezone: 'UTC'
          });
        })
        ctx.orders = result;
      })
      .catch(err => {
        console.log(err);
      })
  } else {
    await Orders.findAll({
        where: {
          idCustomer: req.user.id
        }
      })
      .then(result => {
        result.forEach(item => {
          item.dataValues.date = item.dataValues.date.toLocaleString('pt-PT', {
            timezone: 'UTC'
          });
        })
        ctx.order_history = result;
      })
      .catch(err => {
        console.log(err);
      })
  }

  res.render('dashboard', ctx);
});

router.get('/dashboard/delete', ensureSeller, async (req, res, next) => {
  console.log(req.query.id);
  if (req.query.id !== undefined) {
    await Products.findByPk(req.query.id)
      .then(product => {
        if (product.dataValues.seller != req.user.id) {
          req.flash('error', 'INVALID OPERATION');
          res.redirect('./');
        } else {
          Products.destroy({
              where: {
                id: req.query.id
              }
            })
            .then(out => {
              s3.deleteObject({
                Bucket: process.env.AWS_BUCKET_NAME,
                Key: path.join('products/', product.dataValues.image)
              }, (err, data) => {
                if (err)
                  console.log(err, err.stack);
                else
                  console.log();
              })
              req.flash('success_msg', 'Product successfuly removed from catalog.');
              res.redirect('./');
            }).catch(err => {
              console.log('ERROR: Couldnt delete product.', err);
            });
        }
      })
  } else {
    res.redirect('./..');
  }
})

router.get('/dashboard/addProduct', ensureSeller, (req, res, next) => {
  res.redirect('./#add-products');
})

router.post('/dashboard/addProduct', ensureSeller, product_add.single('image'), async (req, res, next) => {
  let {
    displayName,
    typeRadio,
    category,
    price,
    stock,
    description,
    details
  } = req.body;
  let findCategory;
  await Categories.findByPk(category).then(result => {
    findCategory = result;
  });
  if (!displayName || !typeRadio || !category || !price || !stock || !description || !details) {
    req.flash('warning_msg', 'Please fill all fields.');
    res.redirect('./#add-products');
  } else if (price < 0 || stock < 0) {
    req.flash('warning_msg', 'Positive numbers only.');
    res.redirect('./#add-products');
  } else if (!findCategory) {
    req.flash('warning_msg', 'Invalid category.');
    res.redirect('./#add-products');
  } else if (parseInt(typeRadio, 10) != 0 && parseInt(typeRadio, 10) != 1) {
    req.flash('warning_msg', 'Invalid stock type.');
    res.redirect('./#add-products');
  } else {
    let newProduct = {
      name: displayName,
      price,
      type: typeRadio,
      category,
      seller: req.user.id,
      stock,
      description,
      details
    }
    if (req.file) {
      newProduct.image = req.file.key.replace('products/', '');
    }

    Products.create(newProduct)
      .then(result => {
        req.flash('success_msg', 'Product successfuly added to catalog.');
        res.redirect('./');
      })
      .catch(err => {
        console.log('MARIADB: ERROR! Couldnt add product.', err);
      })
  }
});

router.get('/dashboard/order/:id', ensureCustomer, async (req, res, next) => {

  let ctx = {
    ...global_ctx,
    user: req.user,
  }

  await Orders.findByPk(req.params.id)
    .then(result => {
      result.dataValues.date = result.dataValues.date.toLocaleString('pt-PT', {
        timezone: 'UTC'
      });
      ctx.order = result.dataValues;
    })
    .catch(err => {
      console.log(err);
    })
  res.render('order_status', ctx);
});

router.get('/dashboard/manage/:id', ensureSeller, async (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  await Orders.findByPk(req.params.id)
    .then(result => {
      result.dataValues.date = result.dataValues.date.toLocaleString('pt-PT', {
        timezone: 'UTC'
      });
      ctx.order = result.dataValues;
    })
    .catch(err => {
      console.log(err);
    })
  res.render('manage_order', ctx);
});

router.get('/dashboard/manage/accept/:id', ensureSeller, async (req, res, next) => {
  await Orders.update({
      state: 1
    }, {
      where: {
        id: req.params.id
      }
    })
    .then(result => {
      req.flash('success_msg', 'Order state updated!');
      res.redirect('/users/dashboard');
    })
    .catch(err => {
      console.log(err);
    })
})
router.get('/dashboard/manage/reject/:id', ensureSeller, async (req, res, next) => {
  await Orders.update({
      state: 2
    }, {
      where: {
        id: req.params.id
      }
    })
    .then(result => {
      req.flash('success_msg', 'Order state updated!');
      res.redirect('/users/dashboard');
    })
    .catch(err => {
      console.log(err);
    })
})

module.exports = router;