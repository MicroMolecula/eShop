module.exports = (Product) => {
  Product.observe('after save', async (ctx) => {
    const cartItems = await app.models.CartItem.find({ where: { productId: ctx.instance.id } });
    const product = await app.models.Product.findById(ctx.instance.id);

    if (ctx.instance && ctx.instance.price) {
      for (let cartItem of cartItems) {
        const cart = await app.models.Cart.findById(cartItem.cartId);

        cart.totalSum -= cartItem.totalSum;
        cartItem.totalSum = product.price * cartItem.quantity;
        cart.totalSum += cartItem.totalSum;
        await cartItem.save();
        await cart.save();
      };
    }
  });
};