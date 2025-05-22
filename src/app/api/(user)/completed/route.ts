import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import User from "@/models/user";
import Challenges from "@/models/challenges";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/options";
import { sanitizeFilter } from "mongoose";

export async function POST(req: NextRequest) {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id, challengeId } = await req.json();

    if (!id || !challengeId) {
        return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    try {
        await connectMongo();

        const user = await User.findOne(sanitizeFilter({ _id: id }));

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const challenge = await Challenges.findOne(sanitizeFilter({ _id: challengeId }));

        if (!challenge) {
            return NextResponse.json({ message: "Challenge not found" }, { status: 404 });
        }

        if (user.challenges.includes(challengeId)) {
            return NextResponse.json({ message: "Challenge already completed."}, { status: 201 });
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
