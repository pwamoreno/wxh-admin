import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { connectToDB } from "@/lib/mongoDB";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req: NextRequest, { params }: { params: {collectionsid: string}}) => {
    try {
        await connectToDB()

        const collection = await Collection.findById(params.collectionsid).populate({ path: "products", model: "Product"})

        if(!collection){
            return new NextResponse(JSON.stringify({ message: "Collection not found" }), { status: 404 })
        }

        return NextResponse.json(collection, { status: 200 })

    } catch (error) {
        console.log("[collectionsid_GET", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const POST = async(req: NextRequest, { params }: { params: {collectionsid: string}}) => {
    try {
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthorized!", { status: 401 })
        }

        await connectToDB()

        let collection = await Collection.findById(params.collectionsid)

        if(!collection){
            return new NextResponse("Collection not found!", { status: 404 })
        }

        const { title, description, image } = await req.json()

        if(!title || !image){
            return new NextResponse("Title and image are required", { status: 400 })
        }

        collection = await Collection.findByIdAndUpdate(params.collectionsid, { title, description, image }, { new: true})

        await collection.save()

        return NextResponse.json(collection, {status: 200, headers: { "Cache-Control": "no-store" }, })

    } catch (error) {
        console.log("[collectionsid_POST]", error)
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const DELETE = async(req: NextRequest, { params }: { params: {collectionsid: string}}) => {
    try {
        const { userId } = auth()

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401})
        }
        
        await connectToDB()

        await Collection.findByIdAndDelete(params.collectionsid)

        await Product.updateMany({ collections: params.collectionsid}, { $pull: {collections: params.collectionsid}})
        
        return new NextResponse("Collection deleted!", { status: 200})

    } catch (error) {
        console.log("[collectionsid_DELETE]", error)
        return new NextResponse("Internal Server Error", { status: 500})
    }
}

export const dynamic = "force-dynamic"