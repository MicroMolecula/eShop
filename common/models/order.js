module.exports = async (Order) => {
    Order.makeOrder = async (userId) => {
        const cart = await app.models.Cart.findOne({ where: { userId: userId } });
        const cartItem = await app.models.CartItem.find({ where: { cartId: cart.id } });
        const user = await app.models.User.findById(userId);
        const currentDate = new Date();
        const order = await Order.create({});

        for (let item of cartItem) {
            order.totalSum += item.totalSum;
            item.id = order.id;
            item.cartId = null;
            cart.totalSum = 0;

            await item.save();
            return 'Order has created';
        }
        await cart.save();
        await order.save();

        await Order.app.models.Email.send({
            to: user.email,
            from: '',
            subject: 'Internet shop',
            text: '',
            html: "<p> Hello  " + user.username + " \n Thanks for shopping in my shop. \n Your order sum is "
                + ctx.instance.totalSum + " " + currentDate + "</p>"
        })
    }
    Order.remoteMethod('makeOrder', {
        'descriptions': 'Make order',
        accepts:
            { arg: 'userId', type: 'string' },
        returns: { arg: 'message', type: 'string' },
        http: { verb: 'post' }
    });
};