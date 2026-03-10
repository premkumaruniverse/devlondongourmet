const cron = require("node-cron");
const Subscription = require("../models/Subscription");
const Order = require("../models/Order");
const { calculateNextBillingDate, logSubscriptionEvent } = require("./subscription-service");

// Run every day at mid-night
const startBillingScheduler = () => {
    console.log("Subscription billing scheduler started");

    cron.schedule("0 0 * * *", async () => {
        console.log("Running daily subscription billing check...");
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const dueSubscriptions = await Subscription.find({
                status: "active",
                nextBillingDate: { $lte: today },
            });

            console.log(`Found ${dueSubscriptions.length} subscriptions due for billing`);

            for (const sub of dueSubscriptions) {
                try {
                    // MOCK PAYMENT
                    // sub.paymentMethodId ...
                    const paymentSuccess = true; // Simulating success

                    if (paymentSuccess) {
                        // Create order
                        const order = new Order({
                            userId: sub.userId,
                            cartItems: [{ productId: sub.productId, quantity: 1, price: sub.price, title: "Ayu Bite Recurring Order" }],
                            addressInfo: sub.shippingAddress, // This should be populated or fetched correctly
                            orderStatus: "confirmed",
                            paymentMethod: "subscription",
                            paymentStatus: "paid",
                            totalAmount: sub.price,
                            orderDate: new Date(),
                            subscriptionId: sub._id,
                            isSubscriptionOrder: true,
                        });
                        await order.save();

                        // Update subscription
                        const previousDate = sub.nextBillingDate;
                        sub.nextBillingDate = calculateNextBillingDate(sub.nextBillingDate, sub.frequency);
                        await sub.save();

                        await logSubscriptionEvent({
                            subscriptionId: sub._id,
                            userId: sub.userId,
                            eventType: "payment_succeeded",
                            previousState: { nextBillingDate: previousDate },
                            newState: { nextBillingDate: sub.nextBillingDate },
                            note: `Order ${order._id} created.`,
                        });
                    } else {
                        // Handle failure
                        sub.status = "payment_failed";
                        await sub.save();

                        await logSubscriptionEvent({
                            subscriptionId: sub._id,
                            userId: sub.userId,
                            eventType: "payment_failed",
                            newState: { status: "payment_failed" },
                        });
                    }
                } catch (err) {
                    console.error(`Error processing subscription ${sub._id}:`, err);
                }
            }
        } catch (e) {
            console.error("Critical error in billing scheduler:", e);
        }
    });
};

module.exports = { startBillingScheduler };
