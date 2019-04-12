module.exports = (CartItem) => {
  CartItem.observe('after save', async (ctx) => {
    const cart = await app.models.Cart.findById(ctx.instance.cartId);
    const product = await app.models.Product.findById(ctx.instance.productId);

    if (cart) {
      ctx.instance.totalSum = product.price * ctx.instance.quantity;
      cart.totalSum += ctx.instance.totalSum;
      await cart.save();
    } else {
      cart.totalSum -= ctx.currentInstance.totalSum;
      ctx.data.totalSum = ctx.instance.quantity * product.price;
      cart.totalSum += ctx.instance.totalSum;

      await cart.save();
    }
  });

  CartItem.observe('before delete', async (ctx) => {
    const cart = await app.models.Cart.findById(ctx.instance.cartId);

    cart.totalSum -= ctx.instance.totalSum;
    await cart.save();
  });
};