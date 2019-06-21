module.exports = (CartItem) => {
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

  CartItem.deleteItemsFromCart = async (CartItemId) => {
    const Cart = app.models.Cart;
    const cartItem = await CartItem.findById(CartItemId);
    const cart = await Cart.findById(cartItem.cartId);

    cart.totalSum -= cartItem.totalSum;
    await cart.save();
  };

  CartItem.remoteMethod('deleteItemsFromCart', {
    accepts: { arg: 'CartItemId', type: 'string' },
    returns: { arg: 'message', type: 'string' },
    http: { verb: 'delete' }
  });

  CartItem.changeCartItemQuantityOrCreateNew = async (productId, cartId, quantity) => {
    const cart = await app.models.Cart.findById(cartId);
    const product = await app.models.Product.findById(productId);
    const cartItem = await app.models.CartItem.findOne({ where: { productId: productId, cartId: cartId } });
    
    if (cartItem) {

      cart.totalSum -= cartItem.totalSum;
      cartItem.quantity += quantity;
      cartItem.totalSum = cartItem.quantity * product.price;
      cart.totalSum += cartItem.totalSum;

      await cartItem.save();     
      await cart.save();
      return 'cartItem has added';
    }
    else {
      const totalSum = quantity * product.price;
      await CartItem.create({
        quantity: quantity,
        totalSum: totalSum,
        cartId: cartId,
        productId: productId
      })
      return 'new cartItem has created'
    }
  }

  CartItem.remoteMethod('changeCartItemQuantityOrCreateNew', {
    accepts: [
      { arg: 'productId', type: 'string' },
      { arg: 'cartId', type: 'string' },
      { arg: 'quantity', type: 'Number' }
    ],
    returns: { arg: 'message', type: 'string' },
    http: { verb: 'post' }
  });
};