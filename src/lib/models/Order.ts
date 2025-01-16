import mongoose, { Schema, Document, Model } from "mongoose";

interface OrderItems{
    id: string;
    quantity: number;
    color: string;
    size: string
}

interface ShippingInfo {
    fullName: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
    deliveryMode: string;
  }

interface OrderDocument extends Document{
    customerClerkId: string,
    email: string;
    items: OrderItems[];
    totalAmount: number;
    status: string;
    shippingInfo: ShippingInfo;
    createdAt: number
}

const OrderSchema: Schema = new mongoose.Schema({
    customerClerkId: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    items: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
            },
            quantity: {
                type: Number,
                required: true
            },
            color: {
                type: String,
                required: false
            },
            size: {
                type: String,
                required: false
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    },
    shippingInfo: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: false },
        country: { type: String, required: true },
        phone: { type: String, required: true },
        deliveryMode: { type: String, required: true },
      },
}, {
    timestamps: true
})

const Order = (mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema)) as Model<OrderDocument>


export default Order