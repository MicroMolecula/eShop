module.exports = async (Order) => {
    Order.observe('before save', async (ctx) => {
        const cart = await app.models.Cart.findOne({ where: { userId: ctx.instance.ownerId } });
        const cartItem = await app.models.CartItem.find({ where: { cartId: cart.id } });
    
        for (let item of cartItem) {
          ctx.instance.totalSum += item.totalSum;
    
          item.cartId = null;
          cart.totalSum = 0;
          await item.save();
        }
      });
};