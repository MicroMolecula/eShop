module.exports = (Cart) => {
  Cart.clearCart = async (cartId) => {
    const cartItem = await app.models.CartItem.find({ where: { cartId: cartId } });
    const cart = await Cart.findById(cartId);

    for (let item of cartItem) {
      await app.models.CartItem.destroyById(item.id);
    };
    cart.totalSum = 0;
    await cart.save();
    return 'Cart has been cleaned';
  };

  Cart.remoteMethod('clearCart', {
    accepts: { arg: 'cartId', type: 'string' },
    returns: { arg: 'message', type: 'string' },
    http: { verb: 'delete' }
  });
};