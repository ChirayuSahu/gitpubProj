import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import Challenge from "@/models/challenges";

export const POST = async (req: NextRequest) => {

    const { name, description, difficulty, winXP, loseXP, timeLimit, testCases } = await req.json();

    if (!name || !description || !difficulty || !winXP || !loseXP || !timeLimit || !testCases) {
        return NextResponse.json({ message: "All fields are required." }, { status: 400 });
    }

    try {
        await connectMongo();

        const challenge = await Challenge.create({
            name,
            description,
            difficulty,
            winXP,
            loseXP,
            timeLimit,
            testCases,
        });

        challenge.save();

        return NextResponse.json({ message: "Challenge created successfully." }, { status: 201 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }

}