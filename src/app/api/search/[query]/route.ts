import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(eq: NextRequest, { params }: { params: { query: string}}) => {
    try {
        await connectToDB()

        const searchedProducts = await Product.find({
            $or: [
                { title: { $regex: params.query, $options: "i"}},
                { category: { $regex: params.query, $options: "i"}},
                { tags: { $in: [new RegExp(params.query, "i")]}}
            ]
        })

        return NextResponse.json(searchedProducts, { status: 200 })

    } catch (error) {
        console.log("[search_GET]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"