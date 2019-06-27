module.exports = (CurrencyConvertion) => {
    CurrencyConvertion.observe('loaded', async (ctx) => {
        var request = require('request-promise-native');

        await request.get('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', (error, response, body) => {

            if (ctx.data.price) {
                ctx.data.price *= JSON.parse(body)[0].sale;
            } else if (ctx.data.totalSum) {
                const totalSum = ctx.data.totalSum *= JSON.parse(body)[0].sale;
                ctx.data.totalSum = Math.round(totalSum);
            }
        })
    });
};