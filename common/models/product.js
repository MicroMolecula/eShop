module.exports = (Product) => {
  Product.observe('after save', async (ctx) => {
    const product = await app.models.Product.findById(ctx.instance.id);
    const cartItems = await app.models.CartItem.find({ where: { productId: ctx.instance.id } });

    if (ctx.instance && ctx.instance.price) {
      for (let cartItem of cartItems) {
        const cart = await app.models.Cart.findById(cartItem.cartId);

        cartItems.totalSum = ctx.instance.price * cartItems.quantity;
        cartItem.totalSum += cartItems.totalSum;
        await cartItem.save();
        await cart.save();
      };
    }
  });
};