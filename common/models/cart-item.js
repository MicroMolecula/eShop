module.exports = (CartItem) => {
  CartItem.observe('before delete', async (ctx) => {
    const cart = app.models.Cart.findById(ctx.where.id);
    const cartItem = app.models.CartItem.findById(ctx.where.id);

    cart.totalSum -= cartItem.totalSum;
    await cart.save();
  });

  CartItem.observe('before save', async (ctx) => {
    const Product = app.models.Product;
    const error = new Error('Sorry, current product is out of stock');

    error.status = 412;

    if (ctx.instance && ctx.instance.productId) {
      const product = await Product.findById(ctx.instance.productId);

      if (product.isAvailable === false) {
        throw error;
      }
    };
    if (ctx.data) {
      const product = await Product.findById(ctx.currentInstance.productId);

      if (product.isAvailable === false) {
        throw error;
      }
    }
  });

  CartItem.observe('before save', async (ctx) => {
    const Cart = app.models.Cart;
    const Product = app.models.Product;

    if (ctx.instance && ctx.instance.cartId) {
      const product = await Product.findById(ctx.instance.productId);
      const cart = await Cart.findById(ctx.instance.cartId);

      ctx.instance.totalSum = ctx.instance.quantity * product.price;
      cart.totalSum += ctx.instance.totalSum;
      await cart.save();
    } else if (ctx.data) {
      const product = await Product.findById(ctx.currentInstance.productId);
      const cart = await Cart.findById(ctx.currentInstance.cartId);
      const oldTotalSum = ctx.currentInstance.totalSum;

      ctx.data.totalSum = ctx.data.quantity * product.price;
      cart.totalSum -= oldTotalSum;
      cart.totalSum += ctx.data.totalSum;
      await cart.save();
    }
  });
};