var stripe_api = require('../lib/main.js');
var stripe = new stripe_api(process.env.STRIPE_KEY);

stripe.charges.create({
	amount: 400,
	currency: 'usd',
	card: {
		number: 4242424242424242,
		exp_month: 12,
		exp_year: 15
	},
	description: 'Charge for test@example.com'
});

stripe.on('list_charges', function(data) {
	console.log(data);
});

stripe.on('create_charge', function(data) {
	stripe.charges.list();
	console.log(data);
});