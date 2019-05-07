module.exports = (CartItem) => {
  CartItem.observe('before save', async (ctx) => {
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
    const cart = app.models.Cart.findById(ctx.where.id);
    const cartItem = app.models.CartItem.findById(ctx.where.id);

    cart.totalSum -= cartItem.totalSum;
  });

  CartItem.observe('before save', async (ctx, quantity) => {
    const product = await app.models.Product.findById(ctx.instance.productId);

    if (product.isAvailable === false) {
      throw new Error('Sorry, current product is not available');
    } else {
      return 'Cart item had crated';
    }
  });
};