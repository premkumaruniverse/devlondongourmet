const Subscription = require("../../models/Subscription");
const SubscriptionPlan = require("../../models/SubscriptionPlan");
const SubscriptionEvent = require("../../models/SubscriptionEvent");
const Order = require("../../models/Order");
const Product = require("../../models/Product");

const createSubscription = async (req, res) => {
    try {
        const { productId, variantId, frequency, price, shippingAddress, paymentMethodId, metadata } = req.body;
        const userId = req.user.id;

        // Map address fields correctly
        const addressInfo = {
            addressId: shippingAddress?._id || shippingAddress?.addressId,
            address: shippingAddress?.address,
            city: shippingAddress?.city,
            pincode: shippingAddress?.pincode,
            phone: shippingAddress?.phone,
            notes: shippingAddress?.notes
        };

        // Create subscription
        const subscription = new Subscription({
            userId,
            productId,
            variantId,
            frequency,
            price,
            addressInfo,
            paymentMethodId,
            status: frequency === "one-time" ? "expired" : "active",
            nextBillingDate: calculateNextDate(new Date(), frequency, metadata?.startDate),
            metadata,
        });

        await subscription.save();

        // Log event
        const event = new SubscriptionEvent({
            subscriptionId: subscription._id,
            userId,
            eventType: "created",
            newState: subscription,
        });
        await event.save();

        // Create initial order
        const order = new Order({
            userId,
            cartItems: [{ 
                productId, 
                quantity: 1, 
                price: price.toString(), 
                title: metadata?.ritual || "Ayu Bite Ritual" 
            }],
            addressInfo,
            orderStatus: "confirmed",
            paymentMethod: "card",
            paymentStatus: "paid",
            totalAmount: price,
            orderDate: new Date(),
            subscriptionId: subscription._id,
            isSubscriptionOrder: true,
        });
        await order.save();

        res.status(201).json({
            success: true,
            data: subscription,
        });
    } catch (e) {
        console.error("Subscription Creation Error:", e);
        res.status(500).json({
            success: false,
            message: e.message || "Some error occurred!",
        });
    }
};

const getSubscriptions = async (req, res) => {
    try {
        const userId = req.user.id;
        const subscriptions = await Subscription.find({ userId }).populate("productId");

        res.status(200).json({
            success: true,
            data: subscriptions,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const updateSubscriptionStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, cancellationReason } = req.body;
        const userId = req.user.id;

        const subscription = await Subscription.findOne({ _id: id, userId });
        if (!subscription) {
            return res.status(404).json({ success: false, message: "Subscription not found" });
        }

        const previousState = { ...subscription.toObject() };
        subscription.status = status;
        if (status === "cancelled") {
            subscription.cancelledAt = new Date();
            subscription.cancellationReason = cancellationReason;
        } else if (status === "paused") {
            subscription.pausedAt = new Date();
        }

        await subscription.save();

        // Log event
        const event = new SubscriptionEvent({
            subscriptionId: subscription._id,
            userId,
            eventType: status,
            previousState,
            newState: subscription,
            note: cancellationReason,
        });
        await event.save();

        res.status(200).json({
            success: true,
            data: subscription,
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some error occurred!",
        });
    }
};

const calculateNextDate = (date, frequency, startDate = null) => {
    const d = startDate ? new Date(startDate) : new Date(date);
    
    if (frequency === "weekly") d.setDate(d.getDate() + 7);
    else if (frequency === "monthly") d.setMonth(d.getMonth() + 1);
    else if (frequency === "bi-monthly") d.setMonth(d.getMonth() + 2);
    else if (frequency === "quarterly") d.setMonth(d.getMonth() + 3);
    else if (frequency === "one-time") {
        // For one-time, the next billing date is effectively the event date itself
        return d;
    }
    return d;
};

module.exports = {
    createSubscription,
    getSubscriptions,
    updateSubscriptionStatus,
};
