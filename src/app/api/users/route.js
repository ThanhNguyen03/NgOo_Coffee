import { User } from "@/models/User";
import mongoose from "mongoose";
import { isAdmin } from '@/libs/isAdmin';

export async function GET() {
    mongoose.connect(process.env.MONGO_URL);

    if (await isAdmin()) {
        const users = await User.find();
        return Response.json(users);
    }

    return Response.json([]);
}