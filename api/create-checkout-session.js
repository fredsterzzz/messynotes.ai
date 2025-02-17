import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    console.log('Creating checkout session with:', {
      priceId,
      successUrl,
      cancelUrl,
      stripeKey: process.env.STRIPE_SECRET_KEY ? 'Set' : 'Not Set'
    });

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl,
      cancel_url: cancelUrl,
    });

    console.log('Checkout session created:', session.id);
    res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ 
      error: 'Error creating checkout session',
      details: error.message 
    });
  }
}
