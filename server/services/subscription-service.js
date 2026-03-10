const Subscription = require("../models/Subscription");
const SubscriptionPlan = require("../models/SubscriptionPlan");
const SubscriptionEvent = require("../models/SubscriptionEvent");
const Order = require("../models/Order");

const calculateNextBillingDate = (startDate, frequency) => {
    const date = new Date(startDate);
    switch (frequency) {
        case "weekly":
            date.setDate(date.getDate() + 7);
            break;
        case "monthly":
            date.setMonth(date.getMonth() + 1);
            break;
        case "bi-monthly":
            date.setMonth(date.getMonth() + 2);
            break;
        case "quarterly":
            date.setMonth(date.getMonth() + 3);
            break;
        default:
            date.setMonth(date.getMonth() + 1);
    }
    return date;
};

const createSubscriptionOrder = async (subscription) => {
    // Mock order creation logic
    // In a real app, this would integrate with a warehouse/fulfillment system
    const order = new Order({
        userId: subscription.userId,
        cartItems: [
            {
                productId: subscription.productId,
                title: "Ayu Bite Subscription Batch", // Should fetch product title
                price: subscription.price,
                quantity: 1,
            },
        ],
        addressInfo: subscription.shippingAddress, // Assuming it's an object or we fetch it
        orderStatus: "confirmed",
        paymentMethod: "subscription",
        paymentStatus: "paid",
        totalAmount: subscription.price,
        orderDate: new Date(),
        subscriptionId: subscription._id,
        isSubscriptionOrder: true,
    });

    await order.save();
    return order;
};

const logSubscriptionEvent = async (data) => {
    const event = new SubscriptionEvent(data);
    await event.save();
};

module.exports = {
    calculateNextBillingDate,
    createSubscriptionOrder,
    logSubscriptionEvent,
};
