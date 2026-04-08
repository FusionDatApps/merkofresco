const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/auth.routes");
const testRoutes = require("./routes/test.routes");
const categoryRoutes = require("./routes/category.routes");
const productRoutes = require("./routes/product.routes");
const orderRoutes = require("./routes/order.routes");
const cartRoutes = require("./routes/cart.routes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", testRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/cart", cartRoutes);

module.exports = app;