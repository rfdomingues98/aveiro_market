const express = require('express');
const router = express.Router();

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

const Cart = require('../helpers/cartHelper');

const global_ctx = {
    title: 'AVEIRO|market - You buy, we deliver',
}

router.get('/', (req, res, next) => {
    let ctx = {
        ...global_ctx,
        user: req.user,
        shipping: 3.5
    }
    if (!req.session.cart) {
        return res.render("cart", ctx);
    }
    let cart = new Cart(req.session.cart)
    ctx.products = cart.generateArray();
    let subtotal = 0;
    ctx.products.forEach(element => {
        element.price = Number(element.price).toFixed(2);
        subtotal += Number(element.price);
    });
    ctx.subtotal = subtotal.toFixed(2);
    ctx.totalPrice = parseFloat(ctx.subtotal) + parseFloat(ctx.shipping);
    ctx.totalPrice = ctx.totalPrice.toFixed(2);
    res.render("cart", ctx);
});

router.post('/add/:id', async (req, res, next) => {
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    await Products.findByPk(req.params.id)
        .then(product => {
            cart.add(product, product.id, req.body.qty);
            req.session.cart = cart;
            res.redirect('/cart');
        })
        .catch(err => {
            console.log("CART ERROR!\n", err);
        })
});

router.get('/reduce/:id', (req, res, next) => {
    let cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(req.params.id);
    req.session.cart = cart;
    res.redirect('/cart');
});

router.get("/remove/:id", function (req, res, next) {
    let cart = new Cart(req.session.cart ? req.session.cart : {});

    cart.removeItem(req.params.id);
    req.session.cart = cart;
    res.redirect("/cart");
})

module.exports = router;