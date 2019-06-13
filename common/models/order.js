module.exports = async (Order) => {
    Order.observe('before save', async (ctx) => {
        const cart = await app.models.Cart.findOne({ where: { userId: ctx.instance.ownerId } });
        const cartItem = await app.models.CartItem.find({ where: { cartId: cart.id } });
        const user = await app.models.User.findById(ctx.instance.userId);
        const currentDate = new Date();

        for (let item of cartItem) {
            ctx.instance.totalSum += item.totalSum;

            item.cartId = null;
            cart.totalSum = 0;
            await item.save();
        }

        await Order.app.models.Email.send({
            to: user.email,
            from: '',
            subject: 'Internet shop',
            text: '',
            html: "<p> Hello  " + user.username + " \n Thanks for shopping in my shop. \n Your order sum is "
                + ctx.instance.totalSum + currentDate + "</p>"
        })
        
    });
};