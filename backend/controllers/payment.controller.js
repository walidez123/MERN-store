// controllers/payment.controller.js
import stripe from '../lib/stripe.js';

export const createPaymentIntent = async (req, res) => {
  const  totalPrice  = req.body;
  
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.ceil(totalPrice.totalPrice * 100), // Stripe needs amounts in cents
      currency: process.env.CURRENCY || 'usd',
      payment_method_types: ['card'],
    });

    // Respond with part of the client secret
    res.status(200).json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    console.error('Stripe Error:', error);
    res.status(400).json({ message: 'Failed to create payment. Please try again later.' });
  }
};
