const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require('dotenv').config(); // Load environment variables from .env file
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminRecipesRouter = require("./routes/admin/recipes-routes");
const adminChefsRouter = require("./routes/admin/chefs-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopRecipesRouter = require("./routes/shop/recipes-routes");
const shopChefsRouter = require("./routes/shop/chefs-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

const gourmetClubRouter = require("./routes/gourmet-club-routes");
const gourmetEventRouter = require("./routes/gourmet-event-routes");
const bookingRouter = require("./routes/booking-routes");
const couponRouter = require("./routes/coupon-routes");
const paymentRouter = require("./routes/payment-routes");
const reviewRouter = require("./routes/review-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect("mongodb+srv://SethiNagendra:SethiNagendra@cluster0.navdqbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  // .connect("mongodb+srv://SethiNagendra:SethiNagendra@cluster0.3bmnq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use("/api/auth", authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/admin/recipes", adminRecipesRouter);
app.use("/api/admin/chefs", adminChefsRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/recipes", shopRecipesRouter);
app.use("/api/shop/chefs", shopChefsRouter);

app.use("/api/gourmet-clubs", gourmetClubRouter);
app.use("/api/gourmet-events", gourmetEventRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/payments", paymentRouter);
app.use("/api/reviews", reviewRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
