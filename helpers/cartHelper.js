module.exports = function Cart(oldCart) {
    this.items = oldCart.items || {};
    this.qty = oldCart.qty || 0;
    this.totalPrice = oldCart.qty || 0;

    this.add = function (item, id, qty) {
        let storedItem = this.items[id];
        if (!storedItem) {
            storedItem = this.items[id] = {
                item: item.dataValues,
                qty: 0,
                price: 0
            }
        }
        storedItem.qty += parseInt(qty, 10);
        storedItem.price += Number(item.dataValues.price).toFixed(2) * parseInt(qty, 10);
    }

    this.removeItem = function (id) {
        this.totalQty -= this.items[id].qty
        if (this.totalQty < 0)
            this.totalQty = 0;
        this.totalPrice -= this.items[id].price
        if (this.totalPrice < 0)
            this.totalPrice = 0;
        delete this.items[id]
    }

    this.generateArray = function () {
        var arr = []
        for (var id in this.items) {
            arr.push(this.items[id])
        }
        return arr
    }
}