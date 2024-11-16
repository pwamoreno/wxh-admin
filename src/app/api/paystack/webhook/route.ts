import Order from "@/lib/models/Order";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import Customer from "@/lib/models/Customer";

export async function POST(req: NextRequest) {
  try {
    await connectToDB();

    const secret = process.env.NEXT_PAYSTACK_SECRET_KEY as string;

    const signature = req.headers.get("x-paystack-signature");
    // console.log("[Signature]:", signature)

    const body = await req.text();

    const hash = crypto.createHmac("sha512", secret).update(body).digest("hex");

    if (!signature || signature !== hash) {
      return NextResponse.json(
        { message: "Invalid signature" },
        { status: 401 }
      );
    }

    const event = await JSON.parse(body);
    // console.log("[Event]:", event);

    const customerInfo = {
      clerkId: event.data.metadata.customer.clerkId,
      name: event.data.metadata.customer.name,
      email: event.data.metadata.customer.email,
    };

    const orderId = event.data.metadata.orderId;

    if (event.event === "charge.success") {
      const orderId = event.data.metadata.orderId;
      await Order.findByIdAndUpdate(orderId, { status: "completed" });
    }

    let customer = await Customer.findOne({ clerkId: customerInfo.clerkId });

    if (customer) {
      customer.orders.push(orderId);
    } else {
      customer = new Customer({
        ...customerInfo,
        orders: [orderId],
      });
    }

    await customer.save();

    return NextResponse.json({ message: "Webhook received" });
  } catch (error) {
    console.log("[webhook_POST]", error);
    return new NextResponse("Webhook receipt failed", { status: 500 });
  }
}

export const dynamic = "force-dynamic"