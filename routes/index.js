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
/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', global_ctx);
});

router.get('/review', function (req, res, next) {
  res.render('review_product', global_ctx);
});

module.exports = router;