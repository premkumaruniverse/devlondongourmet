import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";
import adminRecipesSlice from "./admin/recipes-slice";
import adminChefsSlice from "./admin/chefs-slice";
import adminClubsSlice from "./admin/clubs-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shoppingRecipesSlice from "./shop/recipes-slice";
import shoppingChefsSlice from "./shop/chefs-slice";
import shoppingClubsSlice from "./shop/clubs-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,
    adminRecipes: adminRecipesSlice,
    adminChefs: adminChefsSlice,
    adminClubs: adminClubsSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopRecipes: shoppingRecipesSlice,
    shopChefs: shoppingChefsSlice,
    shopClubs: shoppingClubsSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;
