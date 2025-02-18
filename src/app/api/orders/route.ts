/* eslint-disable @typescript-eslint/no-unused-vars */

import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async(req: NextRequest) => {
    try {
        await connectToDB()

        const orders = await Order.find().sort({ createdAt: "desc" })

        // console.log(orders)

        const orderDetails = await Promise.all(orders.map(async(order) => {
            const customer = await Customer.findOne({ clerkId: order.customerClerkId })

            // console.log("[customer]", customer)
            return {
                _id: order._id,
                customer: customer?.name,
                products: order.items.length,
                totalAmount: order.totalAmount,
                createdAt: format(order.createdAt, "MMM do, yyyy")
            }
        }))

        // console.log("[orderDetails]", orderDetails)

        return NextResponse.json(orderDetails, { status: 200 })

    } catch (error) {
        console.log("[orders_GET]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"