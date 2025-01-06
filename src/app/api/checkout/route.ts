/* eslint-disable  @typescript-eslint/no-explicit-any */


import { connectToDB } from "@/lib/mongoDB";
import Order from "@/lib/models/Order";
import { NextRequest, NextResponse } from "next/server";

// export const secret = process.env.NEXT_PAYSTACK_SECRET_KEY;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(req: NextRequest) {
  await connectToDB();

  try {
    const { cartItems, customer } = await req.json();
    // console.log(cartItems);
    // console.log(customer);

    if (!cartItems || !customer || cartItems.length === 0) {
      return new NextResponse("Cart items and customer are required", {
        status: 400,
      });
    }

    let totalAmount = 0;
    for (const elements of cartItems) {
      const productPrice = elements.item.price;
      if (productPrice === null) {
        return new NextResponse(
          `Product with ID ${elements.item._id} price not found`,
          { status: 400 }
        );
      }
      totalAmount += productPrice * elements.quantity;
    }

    const orderItems = cartItems.map((item: any) => {
      return{
        id: item.item._id,
        quantity: item.quantity,
        color: item.color,
        size: item.size
      }
    })

    // console.log(orderItems)

    const newOrder = new Order({
      customerClerkId: customer.clerkId,
      email: customer.email,
      items: orderItems,
      totalAmount,
      status: "pending",
    });
    const savedOrder = await newOrder.save();
    // console.log(savedOrder)

    const amountInKobo = totalAmount * 100;

    const session = await fetch(
      "https://api.paystack.co/transaction/initialize",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PAYSTACK_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: customer.email,
          amount: amountInKobo,
          channels: ["card", "bank_transfer"],
          callback_url: `${process.env.WXH_ECOMM_STORE}/payment_success`,
          metadata: {
            customer,
            cartItems,
            orderId: savedOrder._id,
            cancel_action: `${process.env.WXH_ECOMM_STORE}/cart`,
          },
        }),
      }
    );

    const data = await session.json();
    // console.log(data);

    if (!session.ok) {
      return new NextResponse("Checkout failed", { status: session.status });
    }

    return NextResponse.json(data, { headers: corsHeaders });
  } catch (error) {
    console.log("[checkout_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export const dynamic = "force-dynamic"
