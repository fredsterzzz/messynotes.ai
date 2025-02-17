import Stripe from 'stripe';

// Initialize Stripe with the secret key from environment variable
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16' // Use the latest API version
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { priceId } = req.body;

    if (!priceId) {
      return res.status(400).json({ error: 'Price ID is required' });
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.origin}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.origin}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
    });

    return res.status(200).json({ sessionId: session.id });
  } catch (error) {
    console.error('Stripe API error:', error);
    return res.status(500).json({ 
      error: 'Error creating checkout session',
      details: error.message 
    });
  }
}
