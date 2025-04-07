const express = require("express");
const Shopify = require("shopify-api-node");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const shopify = new Shopify({
  shopName: process.env.SHOPIFY_SHOP_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_API_PASSWORD,
  apiVersion: "2023-10",
});

app.get("/order", async (req, res) => {
  const phone = req.query.phone;
  if (!phone) {
    return res.status(400).json({ error: "Phone number is required." });
  }

  try {
    const orders = await shopify.order.list({ limit: 250 });
    const matched = orders.filter(order =>
      (order.phone && order.phone.includes(phone)) ||
      (order.customer && order.customer.phone && order.customer.phone.includes(phone))
    );

    if (matched.length === 0) {
      return res.status(404).json({ message: "No orders found." });
    }

    res.json(matched);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/", (req, res) => {
  res.send("✅ Backend is working!");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

