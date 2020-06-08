const express = require('express');
const router = express.Router();

const models = require('../db/models');
const Users = models.Users;
const Addresses = models.Addresses;

const global_ctx = {
  title: 'AVEIRO|market - You buy, we deliver',
}
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
  let products = [{
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'apparel'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'groceries'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'apparel'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'food'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'health'
    },
  ];
  let ctx = {
    ...global_ctx,
    products,
    maxPerPage: 3,
  };
  await Users.findByPk(req.params.id)
    .then(seller => {
      ctx.seller = seller;
    })
  ctx.products_count = ctx.products.length;
  res.render('seller_page', ctx);
});

router.get('/products', (req, res, next) => {
  category_list = ["food", "groceries", "health", "electronics", "apparel", "promos"];
  category = req.query.category && category_list.includes(req.query.category) && req.query.category != '' ? capitalize(req.query.category) : 'Products';

  let products = [{
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'apparel'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'groceries'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'apparel'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'food'
    },
    {
      name: "Test 1",
      price: "123",
      stock: 123,
      image: "blue-tshirt.jpg",
      stockQty: true,
      stockWeight: false,
      seller: 'Seller Name',
      category: 'health'
    },
  ];
  let products_by_category = [];
  if (req.query.category) {
    products.forEach(element => {
      if (element.category == req.query.category) {
        products_by_category.push(element)
      }
    });
  }

  let ctx = {
    ...global_ctx,
    category,
    maxPerPage: 16,
  }
  ctx.products = products_by_category.length != 0 ? products_by_category : products;
  ctx.products_count = ctx.products.length;
  res.render('products', ctx);
});

router.get('/products/:id', (req, res, next) => {
  let ctx = {
    ...global_ctx,
  }
  res.render('product_page', ctx);
});

router.get('/review/:id', (req, res, next) => {
  res.render('review_product', global_ctx);
});

router.get('/cart', (req, res, next) => {
  let products = [{
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'griponal.jpg'
    },
    {
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'man-jeans.jpg'
    },
    {
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'blue-tshirt.jpg'
    }
  ];
  let price = 0;
  products.forEach(element => {
    price += element.price;
  });
  let ctx = {
    ...global_ctx,
    products,
    shipping: 3.50,
  }
  ctx.price = price;
  ctx.totalPrice = ctx.shipping + price;
  res.render('cart', ctx);
});

router.get('/checkout/:id', (req, res, next) => {
  let products = [{
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'griponal.jpg'
    },
    {
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'man-jeans.jpg'
    },
    {
      name: 'Test 1',
      amount: '2.31',
      quantity: '-',
      price: 9.49,
      image: 'blue-tshirt.jpg'
    }
  ];
  let price = 0;
  products.forEach(element => {
    price += element.price;
  });
  let ctx = {
    ...global_ctx,
    products,
    shipping: 3.50,
    discount: 5,
  }
  ctx.price = price;
  ctx.totalPrice = ctx.shipping + price - ctx.discount;
  res.render('checkout', ctx);
})

module.exports = router;