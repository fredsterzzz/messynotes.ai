const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { db } = require('./firebase');

// Create a Stripe Checkout session
router.post('/create-checkout-session', async (req, res) => {
  try {
    const { priceId, userId, email } = req.body;

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/pricing`,
      customer_email: email,
      metadata: {
        userId,
      },
    });

    res.json({ sessionId: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Handle Stripe webhook events
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object;
      const userId = session.metadata.userId;
      const subscriptionId = session.subscription;

      // Get subscription details
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      const planId = subscription.items.data[0].price.id;

      // Update user's subscription in Firestore
      await db.collection('users').doc(userId).set({
        subscriptionId,
        planId,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }, { merge: true });

      break;
    }

    case 'customer.subscription.updated':
    case 'customer.subscription.deleted': {
      const subscription = event.data.object;
      const userId = subscription.metadata.userId;

      await db.collection('users').doc(userId).set({
        subscriptionId: subscription.id,
        planId: subscription.items.data[0].price.id,
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      }, { merge: true });

      break;
    }
  }

  res.json({ received: true });
});

// Get subscription status
router.get('/subscription-status/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.subscriptionId) {
      return res.json({ status: 'no_subscription' });
    }

    const subscription = await stripe.subscriptions.retrieve(userData.subscriptionId);
    res.json({
      status: subscription.status,
      planId: subscription.items.data[0].price.id,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (error) {
    console.error('Error getting subscription status:', error);
    res.status(500).json({ error: error.message });
  }
});

// Cancel subscription
router.post('/cancel-subscription', async (req, res) => {
  try {
    const { userId } = req.body;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const subscription = await stripe.subscriptions.del(userData.subscriptionId);
    res.json({ status: subscription.status });
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update subscription
router.post('/update-subscription', async (req, res) => {
  try {
    const { userId, newPriceId } = req.body;
    const userDoc = await db.collection('users').doc(userId).get();
    const userData = userDoc.data();

    if (!userData || !userData.subscriptionId) {
      return res.status(400).json({ error: 'No active subscription found' });
    }

    const subscription = await stripe.subscriptions.retrieve(userData.subscriptionId);
    await stripe.subscriptions.update(userData.subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
    });

    res.json({ status: 'updated' });
  } catch (error) {
    console.error('Error updating subscription:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
