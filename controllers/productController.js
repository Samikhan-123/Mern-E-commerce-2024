import productModel from "../models/productModel.js";
import fs from "fs";
import slugify from "slugify";
import categoryModel from "../models/categoryModel.js";
import braintree from "braintree";
import dotenv from 'dotenv';
import orderModel from "../models/orderModel.js";
dotenv.config()


export const createProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } =
      req.fields;
    const { photo } = req.files;
    // Validation
    switch (true) {
      case !name:
        return res.status(500).send({ error: "Name is Required" });
      case !description:
        return res.status(500).send({ error: "Description is Required" });
      case !price:
        return res.status(500).send({ error: "Price is Required" });
      case !category:
        return res.status(500).send({ error: "Category is Required" });
      case !quantity:
        return res.status(500).send({ error: "Quantity is Required" });
      case photo && photo.size >= 6000000:
        return res
          .status(500)
          .send({ error: "Photo is Required and should be less than 6mb" });
    }

    const products = new productModel({ ...req.fields, slug: slugify(name) });
    if (photo) {
      products.photo.data = fs.readFileSync(photo.path);
      products.photo.contentType = photo.type;
    }
    await products.save();
    res.status(201).send({
      success: true,
      message: "Product Created Successfully",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in creating product",
    });
  }
};

// Get all products
export const getProductController = async (req, res) => {
  try {
    const products = await productModel
      .find({})
      .populate("category")
      .select("-photo")
      .limit(12)
      .sort({ createdAt: -1 });
    res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting products",
      error: error.message,
    });
  }
};

// Route to get a single product by ID
export const getProductIdController = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).send({
        success: false,
        message: "Invalid Product ID",
      });
    }

    // Fetch the product from the database
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).send({
        success: false,
        message: "Product not found",
      });
    }

    // If product found, send it in the response
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.error("Error while getting single product:", error);
    res.status(500).send({
      success: false,
      message: "Error while getting single product",
      error: error.message, 
    });
  }
};

/// get single product using slug
export const getSingleProductController = async (req, res) => {
  try {
    const product = await productModel
      .findOne({ slug: req.params.slug })
      .select("-photo")
      .populate("category");
    res.status(200).send({
      success: true,
      message: "Single Product Fetched",
      product,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Eror while getitng single product",
      error,
    });
  }
};

// Get category products
export const getCategoryProductsController = async (req, res) => {
  try {
    const category = await categoryModel.findOne({ slug: req.params.slug });
    const products = await productModel.find({ category }).populate("category");
    return res.status(200).send({
      success: true,
      countTotal: products.length,
      message: "All Products",
      category,
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(400).send({
      success: false,
      message: "Error while getting category products",
      error,
    });
  }
};

// Get photo
export const productPhotoController = async (req, res) => {
  try {
    const product = await productModel.findById(req.params.pid).select("photo");
    if (product.photo.data) {
      res.set("Content-type", product.photo.contentType);
      return res.status(200).send(product.photo.data);
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while getting photo",
      error,
    });
  }
};

// Delete controller
export const deleteProductController = async (req, res) => {
  try {
    await productModel.findByIdAndDelete(req.params.pid).select("-photo");
    res.status(200).send({
      success: true,
      message: "Product Deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error while deleting product",
      error,
    });
  }
};

//update product
export const updateProductController = async (req, res) => {
  try {
    const { name, description, price, category, quantity, shipping } = req.fields;
    const { photo } = req.files;

    // Validation
    if (!name || !description || !price || !category || !quantity) {
      return res.status(400).send({ error: "All fields are required" });
    }

    // Check photo size
    if (photo && photo.size >= 6000000) {
      return res.status(400).send({ error: "Photo should be less than 6mb" });
    }

    const updatedFields = {
      name,
      description,
      price,
      category,
      quantity,
      shipping,
      slug: slugify(name), // Assuming slugify is properly defined
    };

    const product = await productModel.findByIdAndUpdate(req.params.pid, updatedFields, { new: true });

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    if (photo) {
      product.photo.data = fs.readFileSync(photo.path);
      product.photo.contentType = photo.type;
      await product.save();
    }

    res.status(200).send({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    console.error("Error in updateProductController:", error);
    res.status(500).send({
      success: false,
      error: error.message || "Internal server error",
      message: "Error in updating product",
    });
  }
};

// payment gateway
var gateway = new braintree.BraintreeGateway({
  environment: braintree.Environment.Sandbox,
  merchantId: process.env.BRAINTREE_Merchant_ID,
  publicKey: process.env.BRAINTREE_Public_key,
  privateKey: process.env.BRAINTREE_Private_Key,
});
// braintree TokenController
export const braintreeTokenController = async (req, res) => {
  try {
    gateway.clientToken.generate({}, function (err, response) {
      if (err) {
        console.log(err); // Log the error for debugging
        res.status(500).send(err);
      } else {
        res.send(response);
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal Server Error" });
  }
};


// brainTreePaymentController
export const brainTreePaymentController = async (req, res) => {
  try {
    const { nonce, cart } = req.body;
    let total = 0;
    cart.forEach((item) => {
      total += item.price;
    });

    // Get device details from request headers
    const userAgent = req.headers['user-agent'] || '';
    const deviceType = userAgent.toLowerCase().includes('mobile') ? 'Mobile' : 'Desktop';
    console.log('Device Type:', deviceType);

    // Make the payment using Braintree gateway
    gateway.transaction.sale(
      {
        amount: total,
        paymentMethodNonce: nonce,
        options: {
          submitForSettlement: true,
        },
      },
      async function (error, result) {
        if (error) {
          console.log(error); // Log the error for debugging
          res.status(500).json({
            success: false,
            message: "Payment failed",
            error: error.message, 
          });
        } else {
          try {
            // Payment successful, save order details including device info
            const order = new orderModel({
              products: cart,
              payment: {
                amount: total, 
                currency: 'PKR', 
                paymentMethodNonce: nonce, 
                success: true, 
              },
              buyer: req.user._id,
              deviceType: deviceType, 
            });
            await order.save(); // Await the save operation

            res.status(200).json({
              success: true,
              message: "Payment completed successfully",
              order: order, // Include the order details in the response
            });
          } catch (saveError) {
            console.log(saveError);
            res.status(500).json({ success: false, message: "Error saving order" });
          }
        }
      }
    );
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
