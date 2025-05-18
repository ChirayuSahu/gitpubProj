import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import { getToken } from "next-auth/jwt";
import User from "@/models/user";
import Challenges from "@/models/challenges";
import { i } from "framer-motion/client";


export async function POST (req: NextRequest) {
    const headers = req.headers;
    const token = headers.get("Authorization")?.split(" ")[1];
    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const decodedToken = await getToken({ req, secret: process.env.NEXT_AUTH_SECRET });
    if (!decodedToken) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    
    const { id } = decodedToken;
    
    if (!id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { challengeId } = await req.json();

    try {
        
        await connectMongo();
        
        const user = await User.findOne({ _id: id });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        const challenge = await Challenges.findOne({ _id: challengeId });

        if (!challenge) {
            return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
        }

        if (user.challenges.includes(challengeId)) {
            user.xpPoints += 10;
            const xpPoints = user.xpPoints;
            await user.save();
            return NextResponse.json({ message: "Challenge already completed, 10 XP Points added.", xpPoints }, { status: 200 });
        }

        user.challenges.push(challengeId);
        user.xpPoints += challenge.winXP;
        const xpPoints = user.xpPoints;
        await user.save();

        return NextResponse.json({ message: "Challenge Completed successfully", challenge, xpPoints }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: "Internal server error", error }, { status: 500 });
    }
}
