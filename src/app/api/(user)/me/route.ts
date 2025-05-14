import { connectMongo } from "@/utils/connectMongo";
import User from "@/models/user";
import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export const GET = async (req: NextRequest) => {
    
    const secret = process.env.NEXT_AUTH_SECRET;
    const token = await getToken({ req, secret });

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {

        await connectMongo();

        const user = await User.findById(token.id).select("-password");

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user, { status: 200 });
        
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

}