"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripeWebhook = exports.updateSubscription = exports.cancelSubscription = exports.getSubscriptionStatus = exports.createCheckoutSession = void 0;
const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripe_1 = require("stripe");
admin.initializeApp();
const stripe = new stripe_1.default(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2023-10-16',
});
exports.createCheckoutSession = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to create a checkout session');
    }
    const { priceId } = data;
    const userId = context.auth.uid;
    try {
        // Get user's data from Firestore
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        // Create or retrieve customer
        let customerId = userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId;
        if (!customerId) {
            const customer = await stripe.customers.create({
                email: context.auth.token.email,
                metadata: {
                    firebaseUID: userId,
                },
            });
            customerId = customer.id;
            await admin.firestore().collection('users').doc(userId).update({
                stripeCustomerId: customerId,
            });
        }
        // Create checkout session
        const session = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ['card'],
            line_items: [
                {
                    price: priceId,
                    quantity: 1,
                },
            ],
            mode: 'subscription',
            success_url: `${process.env.FRONTEND_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${process.env.FRONTEND_URL}/pricing`,
            metadata: {
                firebaseUID: userId,
            },
        });
        return { sessionId: session.id };
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
exports.getSubscriptionStatus = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to check subscription status');
    }
    try {
        const userId = context.auth.uid;
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId)) {
            return { status: 'no-subscription' };
        }
        const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripeCustomerId,
            limit: 1,
        });
        if (subscriptions.data.length === 0) {
            return { status: 'no-subscription' };
        }
        const subscription = subscriptions.data[0];
        return {
            status: subscription.status,
            currentPeriodEnd: subscription.current_period_end,
            plan: subscription.items.data[0].price.id,
        };
    }
    catch (error) {
        console.error('Error getting subscription status:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
exports.cancelSubscription = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to cancel subscription');
    }
    const userId = context.auth.uid;
    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId)) {
            throw new Error('No Stripe customer found');
        }
        const customer = await stripe.customers.retrieve(userData.stripeCustomerId);
        if (!customer || customer.deleted) {
            throw new Error('No Stripe customer found');
        }
        const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripeCustomerId,
            status: 'active',
            limit: 1,
        });
        if (subscriptions.data.length === 0) {
            throw new Error('No active subscription found');
        }
        // Cancel the subscription at period end
        await stripe.subscriptions.update(subscriptions.data[0].id, {
            cancel_at_period_end: true,
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error canceling subscription:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
exports.updateSubscription = functions.https.onCall(async (data, context) => {
    if (!context.auth) {
        throw new functions.https.HttpsError('unauthenticated', 'User must be logged in to update subscription');
    }
    const { newPriceId } = data;
    const userId = context.auth.uid;
    try {
        const userDoc = await admin.firestore().collection('users').doc(userId).get();
        const userData = userDoc.data();
        if (!(userData === null || userData === void 0 ? void 0 : userData.stripeCustomerId)) {
            throw new Error('No Stripe customer found');
        }
        const subscriptions = await stripe.subscriptions.list({
            customer: userData.stripeCustomerId,
            status: 'active',
            limit: 1,
        });
        if (subscriptions.data.length === 0) {
            throw new Error('No active subscription found');
        }
        const subscription = subscriptions.data[0];
        // Update the subscription with the new price
        await stripe.subscriptions.update(subscription.id, {
            items: [{
                    id: subscription.items.data[0].id,
                    price: newPriceId,
                }],
            proration_behavior: 'create_prorations',
        });
        return { success: true };
    }
    catch (error) {
        console.error('Error updating subscription:', error);
        throw new functions.https.HttpsError('internal', error.message);
    }
});
// Webhook handler for Stripe events
exports.stripeWebhook = functions.https.onRequest(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    try {
        const event = stripe.webhooks.constructEvent(req.rawBody, sig, webhookSecret);
        // Handle the event
        switch (event.type) {
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
                const subscription = event.data.object;
                await handleSubscriptionChange(subscription);
                break;
            case 'customer.subscription.deleted':
                const deletedSubscription = event.data.object;
                await handleSubscriptionDeletion(deletedSubscription);
                break;
        }
        res.json({ received: true });
    }
    catch (err) {
        console.error('Error processing webhook:', err);
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
});
async function handleSubscriptionChange(subscription) {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const firebaseUID = customer.metadata.firebaseUID;
    if (!firebaseUID) {
        console.error('No Firebase UID found in customer metadata');
        return;
    }
    await admin.firestore().collection('users').doc(firebaseUID).update({
        subscriptionStatus: subscription.status,
        subscriptionPriceId: subscription.items.data[0].price.id,
        subscriptionCurrentPeriodEnd: subscription.current_period_end,
    });
}
async function handleSubscriptionDeletion(subscription) {
    const customer = await stripe.customers.retrieve(subscription.customer);
    const firebaseUID = customer.metadata.firebaseUID;
    if (!firebaseUID) {
        console.error('No Firebase UID found in customer metadata');
        return;
    }
    await admin.firestore().collection('users').doc(firebaseUID).update({
        subscriptionStatus: 'canceled',
        subscriptionPriceId: null,
        subscriptionCurrentPeriodEnd: null,
    });
}
//# sourceMappingURL=index.js.map