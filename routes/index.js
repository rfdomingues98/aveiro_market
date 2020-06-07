var express = require('express');
var router = express.Router();

const global_ctx = {
  title: 'AVEIRO|market - You buy, we deliver',
  sellers: [
    'Farmácia Central',
    'Garrafeira 5 Estrelas',
    'Mercearia A Portuguesa',
    'Talho Basilio',
    'Têzero',
    'Trendy Shop',
  ],
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', global_ctx);
});

router.get('/sellers', function (req, res, next) {
  sellers = [{
      name: 'Mercearia A Portuguesa',
      image: 'mercearia-a-portuguesa.jpg',
      logo: 'mercearia-logo.png'
    },
    {
      name: 'Talho Basilio',
      image: 'talho-basilio.jpg',
      logo: 'talho-basilio-logo.png'
    },
    {
      name: 'Trendy Store',
      image: 'trendy-store.jpg',
      logo: 'trendy-logo.png'
    },
    {
      name: 'Farmácia Central',
      image: 'farmacia-central.jpg',
      logo: 'farmacia-logo.png'
    },
    {
      name: 'TêZero',
      image: 'tezero.jpg',
      logo: 'tezero-logo.png'
    },
  ];
  ctx = {
    ...global_ctx,
    test: 1,
    sellers_info: sellers,
    maxPerPage: 5,
    totalSellers: sellers.length
  }
  res.render('sellers', ctx);
});

router.get('/seller/:id', function (req, res, next) {
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
    seller: {
      name: 'Trendy Store',
      image: 'trendy-logo.png',
      address: 'Rua Domingos Carrancho, 21, 3800-145 Aveiro',
      phone: 234423330,
      email: 'trendystore@mail.com'
    },
    products,
    maxPerPage: 3,
  };
  ctx.products_count = ctx.products.length;
  res.render('seller_page', ctx);
});

router.get('/products', function (req, res, next) {
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

router.get('/products/:id', function (req, res, next) {
  let ctx = {
    ...global_ctx,
  }
  res.render('product_page', ctx);
});

router.get('/review/:id', function (req, res, next) {
  res.render('review_product', global_ctx);
});

router.get('/cart', function (req, res, next) {
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

router.get('/checkout/:id', function (req, res, next) {
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