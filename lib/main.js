var util = require('util');
var events = require('events');
var https = require('https');
var qs = require('qs');

var stripe = function(api_key, options) {
	var self = this;
	var opts = options || {};
	events.EventEmitter.call(self);

	// REQUEST METHODS
	var request = function(http_method, path, data, resource, method) {
		var req = null;
		var req_data = (typeof data !== 'undefined') ? qs.stringify(data) : '';
		var req_opts = {
			host: 'api.stripe.com',
			port: '443',
			path: path,
			method: http_method,
			auth: api_key + ':',
			headers: {
				'Accept': 'application/json',
				'content-Type': 'application/x-www-form-urlencoded',
				'Content-Length': req_data.length
			}
		}

		req = https.request(req_opts);
		req.on('response', function(res) {
			var response = '';
			res.setEncoding('utf8');

			res.on('data', function(data) {
				response += data;
			});

			res.on('end', function() {
				response = JSON.parse(response);
				self.emit(method+'_'+resource, response);
			});
		});
		req.write(req_data);
		req.end();
	}

	var get = function(path, data, resource, method) {
		request('GET', path, data, resource, method);
	}

	var post = function(path, data, resource, method) {
		request('POST', path, data, resource, method);
	}

	var del = function(path, data, resource, method) {
		request('DELETE', path, data, resource, method);
	}

	// CHARGES
	self.charges = {};

	self.charges.create = function(data) {
		post('/v1/charges', data, 'charge', 'create');
	}

	self.charges.retrieve = function(id) {
		get('/v1/charges'+id, {}, 'charge', 'retrieve')
	}

	self.charges.refund = function(id, options) {
		post('/v1/charges/'+id+'/refund', options || {}, 'charge', 'refund');
	}

	self.charges.capture = function(id, options) {
		post('/v1/charges/'+id+'/capture', options || {}, 'charge', 'capture');
	}

	self.charges.list = function(data) {
		get('/v1/charges', data, 'charges', 'list');
	}

	// CUSTOMERS
	self.customers = {};

	self.customers.create = function(data) {
		post('/v1/customers', data, 'customer', 'create');
	}

	self.customers.retrieve = function(id) {
		get('/v1/customers/'+id, {}, 'customer', 'retrieve');
	}

	self.customers.update = function(id, data) {
		post('/v1/customers/'+id, data, 'customer', 'update');
	}

	self.customers.del = function(data) {
		del('/v1/customers/'+id, data, 'customer', 'del');
	}

	self.customers.list = function(data) {
		get('/v1/customers', data, 'customers', 'list');
	}

	// PLANS
	self.plans = {};

	self.plans.create = function(data) {
		post('/v1/plans', data, 'plan', 'create');
	}

	self.plans.retrieve = function(id) {
		get('/v1/plans/'+id, {}, 'plan', 'retrieve');
	}

	self.plans.update = function(id, data) {
		post('/v1/plans/'+id, data, 'plan', 'update');
	}

	self.plans.del = function(data) {
		del('/v1/plans/'+id, data, 'plan', 'del');
	}

	self.plans.list = function(data) {
		get('/v1/plans', data, 'plans', 'list');
	}

	// INVOICES
	self.invoices = {};

	self.invoices.retrieve = function(id) {
		get('/v1/invoices/'+id, {}, 'invoice', 'retrieve');
	}

	self.invoices.list = function(data) {
		get('/v1/invoices', data, 'invoices', 'list');
	}

	self.invoices.upcoming = function(customer_id) {
		get('/v1/invoices/upcoming', {customer:customer_id}, 'invoice', 'upcoming')
	}

	// INVOICE ITEMS
	self.invoice_items = {};

	self.invoice_items.create = function(data) {
		post('/v1/invoiceitems', data, 'invoice_item', 'create');
	}

	self.invoice_items.retrieve = function(id) {
		get('/v1/invoiceitems/'+id, {}, 'invoice_item', 'retrieve');
	}

	self.invoice_items.update = function(id, data) {
		post('/v1/invoiceitems/'+id, data, 'invoice_item', 'update');
	}

	self.invoice_items.del = function(data) {
		del('/v1/invoiceitems/'+id, data, 'invoice_item', 'del');
	}

	self.invoice_items.list = function(data) {
		get('/v1/invoiceitems', data, 'invoice_itemscoupon', 'list');
	}

	// COUPONS
	self.coupons = {};

	self.coupons.create = function(data) {
		post('/v1/coupons', data, 'coupon', 'create');
	}

	self.coupons.retrieve = function(id) {
		get('/v1/coupons/'+id, {}, 'coupon', 'retrieve');
	}

	self.coupons.del = function(data) {
		del('/v1/coupons/'+id, data, 'coupon', 'del');
	}

	self.coupons.list = function(data) {
		get('/v1/coupons', data, 'coupons', 'list');
	}

	// TOKENS
	self.tokens = {};

	self.tokens.create = function(data) {
		post('/v1/tokens', data, 'token', 'create');
	}

	self.tokens.retrieve = function(id) {
		get('/v1/tokens/'+id, {}, 'token', 'retrieve');
	}

	// ACCOUNT
	self.account = {};

	self.account.retrieve = function() {
		get("/v1/account", {}, 'account', 'retrieve');
	}

	// EVENTS
	self.events = {};
	
	self.events.retrieve = function(id) {
		get('/v1/events/'+id, {}, 'event', 'retrieve');
	}

	self.events.list = function(data) {
		get('/v1/events', data, 'events', 'list');
	}

	return self;
}

util.inherits(stripe, events.EventEmitter);
module.exports = stripe;