# Evented Stripe For Node.js
This is a basic Node.js library that offers evented endpoints to the Stripe API.

````
export STRIPE_KEY=<<stripe api key here>>
npm install
node example/app
````

## How to Use

````javascript
var stripe_api = require('lib/main.js');
var stripe = new stripe_api(process.env.STRIPE_KEY);
````
### Convention for calling api:
stripe.RESOURCE.VERB()

````javascript
stripe.charges.create({...});
````

### Convention for listening for a response:
stripe.on('RESOURCE_VERB', function(data) {....});

````javascript
stripe.on('create_charge', function(data) {....});
````