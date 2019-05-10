module.exports = (CartItem) => {
  CartItem.observe('before save', async (ctx) => {
    const cart = await app.models.Cart;
    const product = await app.models.Product;

    if (ctx.instance.cartId) {
      const Cart = await cart.findById(ctx.instance.cartId);
      const Product = await product.findById(ctx.instance.productId);

      ctx.instance.totalSum = Product.price * ctx.instance.quantity;
      Cart.totalSum += ctx.instance.totalSum;
      await Cart.save();
    } else if (ctx.data) {
      const Product = await product.findById(ctx.currentInstance.productId);
      const Cart = await cart.findById(ctx);

      ctx.currentInstance.totalSum = Product.price * ctx.currentInstance.quantity;
      Cart.totalSum += ctx.currentInstance.totalSum;

      Cart.totalSum -= ctx.currentInstance.totalSum;
      ctx.data.totalSum = ctx.data.quantity * product.price;
      Cart.totalSum += ctx.data.totalSum;

      await Cart.save();
    }
  });

  CartItem.observe('before delete', async (ctx) => {
    const cart = app.models.Cart.findById(ctx.where.id);
    const cartItem = app.models.CartItem.findById(ctx.where.id);

    cart.totalSum -= cartItem.totalSum;
    await cart.save();
  });
};