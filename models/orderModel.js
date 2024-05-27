import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: [
            {
                _id: {
                    type: mongoose.ObjectId,
                    ref: "Products",
                    required: true,
                },
                name: {
                    type: String,
                    required: true,
                },

                price: {
                    type: Number,
                    required: true,
                },
                productQuantity: {
                    type: Number,
                },
            }
        ],
       

        payment: {
            // Define the structure for payment details
            amount: {
                type: Number,
                required: true,
            },
            currency: {
                type: String,
                default: "USD",
            },
            paymentMethodNonce: {
                type: String,
                required: true,
            },
            success: {
                type: Boolean,
                required: true,
            },

        },

        buyer: {
            type: mongoose.ObjectId,
            ref: "users",
            required: true,

        },
        deviceType: {
            type: String,
            required: true,
            enum: ["Mobile", "Desktop"],
        },
        userAgent: {
            type: String,
            required: true,  // Make sure userAgent is required
        },

        status: {
            type: String,
            default: "Not Process",
            enum: ["Not Process", "Processing", "Shipped", "delivered", "cancel"],
        },
      
    },
    { timestamps: true }
);

export default mongoose.model("Order", orderSchema);