import { Category } from "@/models/Category";
import mongoose from "mongoose";
import { isAdmin } from "../auth/[...nextauth]/route";

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {name} = await req.json();
    if (await isAdmin()) {
        const categoryDocument = await Category.create({name});
        return Response.json(categoryDocument);
    }

    return Response.json({});
}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    return Response.json(await Category.find())
}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const {_id, name} = await req.json();
    if (await isAdmin()) {
        await Category.updateOne({_id}, {name});
    }

    return Response.json(true);
}

export async function DELETE(req) {
    mongoose.connect(process.env.MONGO_URL);
    const _id = new URL(req.url).searchParams.get('_id');
    if (await isAdmin()) {
        await Category.deleteOne({_id});
    }
    return Response.json(true);
}