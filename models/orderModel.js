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
                description: {
                    type: String,
                    required: true,
                },
                price: {
                    type: Number,
                    required: true,
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
        // success: {
        //     type: Boolean,
        //     default: false,
        // },
        buyer: {
            type: mongoose.ObjectId,
            ref: "users",
        },
        deviceType: {
            type: String,
            required: true,
            enum: ["Mobile", "Desktop"], // Specify possible device types
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