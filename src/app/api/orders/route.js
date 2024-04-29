import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { isAdmin } from '@/libs/isAdmin';
import { authOptions } from '@/libs/authOptions';
import { Order } from "@/models/Order";

export async function GET(req) {
    mongoose.connect(process.env.MONGO_URL);
    const session = await getServerSession(authOptions);
    const userEmail = session?.user?.email;
    const admin = await isAdmin();
    const _id = new URL(req.url).searchParams.get('_id');

    if (_id) {
        return Response.json(await Order.findById(_id));
    }

    if (admin) {
        return Response.json(await Order.find());
    }

    if (userEmail) {
        return Response.json(await Order.find({email:userEmail}));
    }
}