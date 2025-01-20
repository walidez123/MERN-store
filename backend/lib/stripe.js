// config/stripe.config.js
import Stripe from 'stripe';

// Initialize Stripe with your secret key (you can use an environment variable for the key)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2022-11-15',  // use the latest version at the time
});

export default stripe;
