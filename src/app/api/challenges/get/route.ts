import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import Challenges from "@/models/challenges";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const limitParam = searchParams.get("limit");

    if (!difficulty) {
      return NextResponse.json({ message: "Difficulty is required." }, { status: 400 });
    }

    await connectMongo();

    // Convert limit to a number if provided
    const limit = limitParam ? parseInt(limitParam, 10) : null;

    // Use aggregation if limit is provided to get random results
    let challenges;
    if (limit) {
      challenges = await Challenges.aggregate([
        { $match: { difficulty } },
        { $sample: { size: limit } }
      ]);
    } else {
      challenges = await Challenges.find({ difficulty });
    }

    if (challenges.length === 0) {
      return NextResponse.json({ message: "No challenges found for the given difficulty." }, { status: 404 });
    }

    return NextResponse.json({ challenges }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
