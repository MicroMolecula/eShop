module.exports = function (user) {
  user.observe('after save', async (ctx) => {
    const Cart = user.app.models.Cart;

    await Cart.create({
      userId: ctx.instance.id
    });
  });
};