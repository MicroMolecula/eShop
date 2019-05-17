module.exports = (CartItem) => {
  const Cart = app.models.Cart;
  const Product = app.models.Product;

  CartItem.observe('before save', async (ctx) => {
    const Cart = app.models.Cart;
    const Product = app.models.Product;

    if (ctx.instance.cartId) {
      const product = await Product.findById(ctx.instance.productId);
      const cart = await Cart.findById(ctx.instance.cartId);

      ctx.instance.totalSum = ctx.instance.quantity * product.price;
      cart.totalSum += ctx.instance.totalSum;
      await cart.save();
    } else if (ctx.data) {
      const product = await Product.findById(ctx.where.productId);
      const cart = await Cart.findById(ctx.where.cartId);

      ctx.currentInstance.totalSum = product.price * ctx.currentInstance.quantity;
      cart.totalSum += ctx.currentInstance.totalSum;

      cart.totalSum -= ctx.currentInstance.totalSum;
      ctx.data.totalSum = ctx.data.quantity * product.price;
      cart.totalSum += ctx.data.totalSum;

      await cart.save();
    }
  });

  CartItem.observe('before delete', async (ctx) => {
    const cart = app.models.Cart.findById(ctx.where.id);
    const cartItem = app.models.CartItem.findById(ctx.where.id);

    cart.totalSum -= cartItem.totalSum;
    await cart.save();
  });

  CartItem.observe('before save', async (ctx) => {
    if (ctx.currentInstance) {
      const product = await Product.findById(ctx.instance.productId);
      const error = new EvalError();

      if (product.isAvailable === false) {
        throw error('Sorry, current product is not available');
      }
    };
    if (ctx.data) {
      const product = await Product.findById(ctx.currentInstance.productId);

      if (product.isAvailable === false) {
        throw new EvalError('Sorry, current product is not available');
      }
    }
  });
};