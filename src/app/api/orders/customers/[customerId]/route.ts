import Order from "@/lib/models/Order";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: { customerId: string } }
) => {
  try {
    await connectToDB();

    // console.log("[params]:", params)

    const orders = await Order.find({
      customerClerkId: params.customerId,
    }).populate({ path: "items.id", model: Product });

    // console.log("[orders]:", orders)

    return NextResponse.json(orders, { status: 200 })

  } catch (error) {
    console.log("[customerId_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};

export const dynamic = "force-dynamic"