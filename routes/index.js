const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
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
const Reviews = models.Reviews;

const global_ctx = {
  title: 'AVEIRO|market - You buy, we deliver',
  shipping: 3.5
}

const Cart = require('../helpers/cartHelper');

const capitalize = str => {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/* GET home page. */
router.get('/', (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user
  }
  res.render('index', ctx);
});

router.get('/sellers', async (req, res, next) => {
  ctx = {
    ...global_ctx,
    user: req.user,
    maxPerPage: 5,
  }
  await Users.findAll({
    where: {
      userType: 1
    }
  }).then(sellers => {
    ctx.sellers = sellers;
    ctx.totalSellers = sellers.length;
  });
  res.render('sellers', ctx);
});

router.get('/sellers/:id', async (req, res, next) => {

  let ctx = {
    ...global_ctx,
    user: req.user,
    maxPerPage: 3,
  };
  await Users.findByPk(req.params.id)
    .then(seller => {
      console.log(seller);
      ctx.seller = seller;
    })
  await Products.findAll({
      where: {
        seller: req.params.id
      }
    })
    .then(products => {
      ctx.products = products;
    })
    .catch(err => {
      console.log('ERROR! Couldnt get seller catalog!', err);
    })
  ctx.products_count = ctx.products.length;
  res.render('seller_page', ctx);
});

router.get('/products', async (req, res, next) => {
  category_list = ["food", "groceries", "health", "electronics", "apparel&shoes", "promos"];
  category = req.query.category && category_list.includes(req.query.category) && req.query.category != '' ? capitalize(req.query.category) : 'Products';
  let ctx = {
    ...global_ctx,
    user: req.user,
    category,
    sellers: {},
    maxPerPage: 16,
  }
  if (!req.query.category) {
    await Products.findAll()
      .then(products => {
        ctx.products = products;
      }).catch(err => {
        console.log('ERROR! Couldnt get products.', err);
      })
  } else {
    let category_id;
    await Categories.findOne({
        where: {
          category: {
            [Sequelize.Op.like]: req.query.category
          }
        }
      })
      .then(result => {
        category_id = result.dataValues.id;
      })
      .catch(err => {
        console.log('ERROR! Couldnt get categories!', err);
      })
    await Products.findAll({
        where: {
          category: category_id
        }
      })
      .then(result => {
        ctx.products = result;
      })
      .catch(err => {
        console.log('ERROR! Couldnt get products by category', err);
      })
  }
  res.render('products', ctx);
});

router.get('/products/:id', async (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  await Products.findByPk(req.params.id)
    .then(product => {
      ctx.product = product;
    })
    .catch(err => {
      console.log('ERROR! Couldnt get product by id.', err);
    });

  await Users.findByPk(ctx.product.dataValues.seller.trim())
    .then(seller => {
      ctx.seller = seller;
    })
    .catch(err => {
      console.log('ERROR! Couldnt get seller by id.', err);
    })

  await Reviews.findAll({
      where: {
        idProduct: req.params.id
      },
      include: [{
        model: Users
      }]
    })
    .then(result => {
      result.forEach(item => {
        item.dataValues.date = item.dataValues.date.toLocaleString('pt-PT', {
          timezone: 'UTC'
        });
      })
      ctx.reviews = result;
    })
    .catch(err => {
      console.log(err);
    })
  let avgRating = 0;
  ctx.reviews.forEach(key => {
    avgRating += key.dataValues.score;;
  })
  avgRating /= ctx.reviews.length;
  ctx.avgRating = avgRating;
  res.render('product_page', ctx);
});

router.get('/review/:id', ensureAuthenticated, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
    product_id: req.params.id
  }
  res.render('review_product', ctx);
});

router.post('/review/:id', async (req, res, next) => {
  let {
    rating,
    review
  } = req.body;
  let newReview = {
    score: rating,
    review,
    idProduct: req.params.id,
    idUser: req.user.id
  }
  Reviews.create(newReview)
    .then(result => {
      req.flash('success_msg', 'Review successfully added!');
      res.redirect(path.join('/products/', req.params.id));
    })
});

router.get('/checkout', ensureAuthenticated, (req, res, next) => {
  let ctx = {
    ...global_ctx,
    user: req.user,
  }
  if (!req.session.cart) {
    return res.render("cart", ctx);
  }
  let cart = new Cart(req.session.cart)
  ctx.products = cart.generateArray();
  let subtotal = 0;
  ctx.products.forEach(element => {
    subtotal += Number(element.price);
  });
  ctx.subtotal = subtotal.toFixed(2);
  let totalPrice = 0;
  ctx.products.forEach(element => {
    totalPrice += parseFloat(element.price);
  })
  totalPrice += parseFloat(ctx.shipping);
  ctx.totalPrice = totalPrice.toFixed(2);
  res.render('checkout', ctx);
});

router.post('/checkout', ensureAuthenticated, (req, res, next) => {
  if (!req.session.cart) {
    res.redirect('/cart');
  }
  let cart = new Cart(req.session.cart);
  cart.totalPrice += global_ctx.shipping;
  let newOrder = {
    idCustomer: req.user.id,
    idSeller: cart.items[Object.keys(cart.items)[0]].item.seller,
    state: 0,
    products: cart.items,
    payment: 'paypal',
    totalPrice: cart.totalPrice
  }

  Orders.create(newOrder)
    .then(result => {
      req.flash('success_msg', 'Order placed successfuly!')
      res.redirect('/users/dashboard');
    })
    .catch(err => {
      console.log('ERROR! Couldnt place order!\n', err);
    })

})

module.exports = router;