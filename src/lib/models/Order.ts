import mongoose, { Schema, Document, Model } from "mongoose";

interface OrderItems{
    id: string;
    quantity: number;
    color: string;
    size: string
}

interface OrderDocument extends Document{
    customerClerkId: string,
    email: string;
    items: OrderItems[];
    totalAmount: number;
    status: string
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
    }
}, {
    timestamps: true
})

const Order = (mongoose.models.Order || mongoose.model<OrderDocument>("Order", OrderSchema)) as Model<OrderDocument>


export default Order