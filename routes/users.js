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

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.redirect("../");
});

router.get('/signup', function (req, res, next) {
  res.render('signup', global_ctx);
});

router.get('/signup/seller', function (req, res, next) {
  res.render('signup_seller', global_ctx);
});

router.get('/dashboard', function (req, res, next) {
  let ctx = {
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
  }
  res.render('dashboard', ctx);
});

module.exports = router;