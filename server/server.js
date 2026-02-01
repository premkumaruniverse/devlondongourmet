const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");
const adminRecipesRouter = require("./routes/admin/recipes-routes");
const adminChefsRouter = require("./routes/admin/chefs-routes");
const adminClubsRouter = require("./routes/admin/clubs-routes");
const adminServicesRouter = require("./routes/admin/service-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopRecipesRouter = require("./routes/shop/recipes-routes");
const shopChefsRouter = require("./routes/shop/chefs-routes");
const shopClubsRouter = require("./routes/shop/clubs-routes");
const shopServicesRouter = require("./routes/shop/service-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

mongoose
  .connect(process.env.MONGODB_URI || "mongodb+srv://SethiNagendra:SethiNagendra@cluster0.navdqbm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("MongoDB connected"))
  .catch((error) => console.log(error));

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      process.env.CLIENT_URL
    ].filter(Boolean),
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
app.use("/api/admin/clubs", adminClubsRouter);
app.use("/api/admin/services", adminServicesRouter);
app.use("/api/common/feature", commonFeatureRouter);

app.use("/api/shop/products", shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order", shopOrderRouter);
app.use("/api/shop/search", shopSearchRouter);
app.use("/api/shop/review", shopReviewRouter);
app.use("/api/shop/recipes", shopRecipesRouter);
app.use("/api/shop/chefs", shopChefsRouter);
app.use("/api/shop/clubs", shopClubsRouter);
app.use("/api/shop/services", shopServicesRouter);

app.use("/api/common/feature", commonFeatureRouter);

// Root route
app.get("/", (req, res) => {
  res.json({ message: "London Gourmet API is running!" });
});

app.listen(PORT, () => console.log(`Server is now running on port ${PORT}`));
