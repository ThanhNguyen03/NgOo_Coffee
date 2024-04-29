import { MenuItem } from "@/models/MenuItem";
import mongoose from "mongoose";
import { isAdmin } from '@/libs/isAdmin';

export async function POST(req) {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    if (await isAdmin()) {
        const menuItemDocument = await MenuItem.create(data);
        return Response.json(menuItemDocument);
    }

    return Response.json({});
}

export async function PUT(req) {
    mongoose.connect(process.env.MONGO_URL);
    const data = await req.json();
    if (await isAdmin()) {
        const {_id, ...otherData} = data;
        await MenuItem.findByIdAndUpdate(_id, otherData);
    }
    
    return Response.json(true);
}

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);
    return Response.json(await MenuItem.find());
}

export async function DELETE(req) {
    mongoose.connect(process.env.MONGO_URL);
    const _id = new URL(req.url).searchParams.get('_id');
    if (await isAdmin()) {
        await MenuItem.deleteOne({_id});
    }
    return Response.json(true);
}