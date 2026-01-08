const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const paypal = require("paypal-rest-sdk");
const Booking = require("../models/Booking");

// Configure PayPal
paypal.configure({
  mode: process.env.PAYPAL_MODE || "sandbox", // sandbox or live
  client_id: process.env.PAYPAL_CLIENT_ID,
  client_secret: process.env.PAYPAL_CLIENT_SECRET,
});

// Create Stripe payment intent
router.post("/create-intent", async (req, res) => {
  try {
    const { amount, currency = "eur", metadata } = req.body;

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      metadata,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    res.status(500).json({ message: "Failed to create payment intent" });
  }
});

// Confirm Stripe payment
router.post("/confirm", async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      // Update booking status
      await Booking.findOneAndUpdate(
        { _id: paymentIntent.metadata.bookingId },
        {
          paymentStatus: "paid",
          status: "confirmed",
          paymentDetails: {
            transactionId: paymentIntent.id,
            paymentIntentId: paymentIntent.id,
            last4: paymentIntent.charges.data[0].payment_method_details.card.last4,
            brand: paymentIntent.charges.data[0].payment_method_details.card.brand,
          },
        }
      );

      res.json({ status: "succeeded", paymentIntent });
    } else {
      res.json({ status: paymentIntent.status, paymentIntent });
    }
  } catch (error) {
    console.error("Error confirming payment:", error);
    res.status(500).json({ message: "Failed to confirm payment" });
  }
});

// Create PayPal payment
router.post("/paypal/create", async (req, res) => {
  try {
    const { amount, currency = "EUR", description, returnUrl, cancelUrl, metadata } = req.body;

    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: returnUrl,
        cancel_url: cancelUrl,
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: description,
                price: amount.toFixed(2),
                currency,
                quantity: 1,
              },
            ],
          },
          amount: {
            currency,
            total: amount.toFixed(2),
          },
          description,
        },
      ],
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.error("PayPal payment creation error:", error);
        res.status(500).json({ message: "Failed to create PayPal payment" });
      } else {
        const approvalUrl = payment.links.find(link => link.rel === "approval_url");
        res.json({
          paymentId: payment.id,
          approvalUrl: approvalUrl.href,
        });
      }
    });
  } catch (error) {
    console.error("Error creating PayPal payment:", error);
    res.status(500).json({ message: "Failed to create PayPal payment" });
  }
});

// Execute PayPal payment
router.post("/paypal/execute", async (req, res) => {
  try {
    const { paymentId, payerId, bookingId } = req.body;

    const execute_payment_json = {
      payer_id: payerId,
      transactions: [
        {
          amount: {
            currency: "EUR",
            total: req.body.amount,
          },
        },
      ],
    };

    paypal.payment.execute(paymentId, execute_payment_json, async function (error, payment) {
      if (error) {
        console.error("PayPal payment execution error:", error);
        res.status(500).json({ message: "Failed to execute PayPal payment" });
      } else {
        // Update booking status
        await Booking.findOneAndUpdate(
          { _id: bookingId },
          {
            paymentStatus: "paid",
            status: "confirmed",
            paymentDetails: {
              transactionId: payment.id,
              paymentIntentId: paymentId,
              brand: "paypal",
            },
          }
        );

        res.json({ status: "succeeded", payment });
      }
    });
  } catch (error) {
    console.error("Error executing PayPal payment:", error);
    res.status(500).json({ message: "Failed to execute PayPal payment" });
  }
});

// Process refund
router.post("/refund", async (req, res) => {
  try {
    const { paymentIntentId, amount } = req.body;

    // Find the booking to get payment details
    const booking = await Booking.findOne({
      "paymentDetails.transactionId": paymentIntentId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    let refund;

    if (booking.paymentDetails.brand === "paypal") {
      // Process PayPal refund
      const refund_data = {
        amount: amount ? {
          total: (amount / 100).toFixed(2),
          currency: "EUR",
        } : {
          total: (booking.totalPrice).toFixed(2),
          currency: "EUR",
        },
      };

      paypal.sale.refund(booking.paymentDetails.transactionId, refund_data, function (error, refund) {
        if (error) {
          console.error("PayPal refund error:", error);
          res.status(500).json({ message: "Failed to process PayPal refund" });
        } else {
          updateBookingRefund(booking, refund.amount.total);
          res.json({ status: "succeeded", refund });
        }
      });
    } else {
      // Process Stripe refund
      const refundParams = {
        payment_intent: paymentIntentId,
      };

      if (amount) {
        refundParams.amount = amount;
      }

      refund = await stripe.refunds.create(refundParams);

      if (refund.status === "succeeded") {
        await updateBookingRefund(booking, refund.amount / 100);
        res.json({ status: "succeeded", refund });
      } else {
        res.status(500).json({ message: "Refund failed" });
      }
    }
  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({ message: "Failed to process refund" });
  }
});

// Helper function to update booking refund status
async function updateBookingRefund(booking, refundAmount) {
  await Booking.findByIdAndUpdate(booking._id, {
    status: "refunded",
    refundAmount: refundAmount,
    refundDate: new Date(),
  });
}

// Get payment status
router.get("/status/:paymentIntentId", async (req, res) => {
  try {
    const { paymentIntentId } = req.params;

    // Find booking with this payment intent
    const booking = await Booking.findOne({
      "paymentDetails.transactionId": paymentIntentId,
    });

    if (!booking) {
      return res.status(404).json({ message: "Payment not found" });
    }

    let paymentStatus;

    if (booking.paymentDetails.brand === "paypal") {
      // Check PayPal payment status
      paypal.payment.get(booking.paymentDetails.transactionId, function (error, payment) {
        if (error) {
          res.status(500).json({ message: "Failed to get PayPal payment status" });
        } else {
          res.json({
            status: payment.state,
            paymentDetails: booking.paymentDetails,
            bookingStatus: booking.status,
          });
        }
      });
    } else {
      // Check Stripe payment status
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      
      res.json({
        status: paymentIntent.status,
        paymentDetails: booking.paymentDetails,
        bookingStatus: booking.status,
      });
    }
  } catch (error) {
    console.error("Error getting payment status:", error);
    res.status(500).json({ message: "Failed to get payment status" });
  }
});

// Webhook for Stripe events
router.post("/stripe-webhook", express.raw({ type: "application/json" }), (req, res) => {
  const sig = req.headers["stripe-signature"];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.log(`Webhook signature verification failed.`, err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "payment_intent.succeeded":
      const paymentIntent = event.data.object;
      console.log("PaymentIntent was successful!");
      // Update booking status
      Booking.findOneAndUpdate(
        { "paymentDetails.transactionId": paymentIntent.id },
        {
          paymentStatus: "paid",
          status: "confirmed",
        }
      ).catch(console.error);
      break;
    case "payment_intent.payment_failed":
      console.log("PaymentIntent failed!");
      // Update booking status
      Booking.findOneAndUpdate(
        { "paymentDetails.transactionId": event.data.object.id },
        {
          paymentStatus: "failed",
          status: "pending",
        }
      ).catch(console.error);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  // Return a 200 response to acknowledge receipt of the event
  res.send();
});

// Webhook for PayPal events
router.post("/paypal-webhook", (req, res) => {
  // Handle PayPal webhook events
  const event = req.body;
  
  console.log("PayPal webhook received:", event);

  // Process different event types
  switch (event.event_type) {
    case "PAYMENT.SALE.COMPLETED":
      console.log("PayPal payment completed");
      // Update booking status
      Booking.findOneAndUpdate(
        { "paymentDetails.transactionId": event.resource.id },
        {
          paymentStatus: "paid",
          status: "confirmed",
        }
      ).catch(console.error);
      break;
    case "PAYMENT.SALE.DENIED":
      console.log("PayPal payment denied");
      // Update booking status
      Booking.findOneAndUpdate(
        { "paymentDetails.transactionId": event.resource.id },
        {
          paymentStatus: "failed",
          status: "pending",
        }
      ).catch(console.error);
      break;
    default:
      console.log(`Unhandled PayPal event type ${event.event_type}`);
  }

  res.status(200).send("OK");
});

module.exports = router;
