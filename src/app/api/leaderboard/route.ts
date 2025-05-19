import { NextRequest, NextResponse } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import User from "@/models/user";

export const GET = async (req: NextRequest) => {
    try {

        const {searchParams} = new URL(req.url);
        const limitParam = searchParams.get("limit");

        const limit = parseInt(limitParam as string, 10);

        await connectMongo();

        const leaderboard = await User.find({}).sort({ xpPoints: -1 }).limit(limit);

        if (leaderboard.length === 0) {
            return NextResponse.json({ message: "No users found." }, { status: 404 });
        }

        const formattedLeaderboard = leaderboard.map((user) => ({
            username: user.username,
            xpPoints: user.xpPoints,
            rank: leaderboard.indexOf(user) + 1,
        }));

        return NextResponse.json({ leaderboard: formattedLeaderboard }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}