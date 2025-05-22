import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import Challenge from "@/models/challenges";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { sanitizeFilter } from "mongoose";

export const POST = async (req: NextRequest) => {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description, difficulty, winXP, loseXP, timeLimit, testCases, starterCode } = await req.json();

    if (!name || !description || !difficulty || !winXP || !loseXP || !timeLimit || !testCases || !starterCode) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        await connectMongo();

        const challenge = await Challenge.create(sanitizeFilter({
            name,
            description,
            difficulty,
            winXP,
            loseXP,
            timeLimit,
            testCases,
            starterCode,
        }));

        challenge.save();

        return NextResponse.json({ message: "Challenge created successfully.", challenge }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

}