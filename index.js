const express = require("express");
const { initializeDatabase } = require("./db/db.connect");
const List = require("./models/products.models");

const app = express();
const cors = require("cors");

const corsOpt = {
  origin: "*",
  credentials: true,
};

app.use(express.json());
app.use(cors(corsOpt));

// Initialize the database
initializeDatabase();

// Base route
app.get("/", (req, res) => {
  res.send("Server is live.");
});

// Function to fetch products from the database
const obtainProducts = async () => {
  try {
    const products = await List.find();
    return products;
  } catch (error) {
    throw error;
  }
};

// GET /products - Fetch all products
app.get("/products", async (req, res) => {
  try {
    const products = await obtainProducts();

    if (products.length > 0) {
      return res.status(200).json(products);
    }

    res.status(404).json({ message: "Products not found." });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

// POST /products - Add a new product
app.post("/products", async (req, res) => {
  try {
    const productData = req.body;

    // Check if the request body is empty or invalid
    if (!productData || Object.keys(productData).length === 0) {
      return res
        .status(400)
        .json({ error: "Invalid product data. Please provide valid inputs." });
    }

    const product = new List(productData);
    const savedProduct = await product.save();

    if (!savedProduct) {
      return res
        .status(400)
        .json({ error: "Failed to add product. Check input data." });
    }

    res.status(201).json({ message: "Data added successfully!", data: savedProduct });
  } catch (error) {
    res.status(500).json({ error: `Failed to add product: ${error.message}` });
  }
});

app.put("/products", async (req, res) => {
  try {
    const newProducts = req.body;

    // Input validation
    if (!Array.isArray(newProducts) || newProducts.length === 0) {
      return res.status(400).json({ error: "Please provide an array of product objects." });
    }

    // Remove all existing products
    await List.deleteMany({});

    // Insert new products
    const insertedProducts = await List.insertMany(newProducts);

    res.status(200).json({ 
      message: "Products replaced successfully!",
      count: insertedProducts.length,
      data: insertedProducts
    });
  } catch (error) {
    res.status(500).json({ error: `Failed to replace products: ${error.message}` });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
