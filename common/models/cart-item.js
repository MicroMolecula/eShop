module.exports = function (CartItem) {
  CartItem.observe('before save', async (ctx) => {
    const Product = CartItem.app.models.Product;
    const product = await Product.findById(ctx.instance.productId);

    ctx.instance.totalSum = product.price * ctx.instance.quantity;
  });
};