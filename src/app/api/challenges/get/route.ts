import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import Challenges from "@/models/challenges";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");

    if (!difficulty) {
      return NextResponse.json({ message: "Difficulty is required." }, { status: 400 });
    }

    await connectMongo();

    const randomChallenge = await Challenges.aggregate([
      { $match: { difficulty } },
      { $sample: { size: 1 } }
    ]);

    if (randomChallenge.length === 0) {
      return NextResponse.json({ message: "No challenges found for the given difficulty." }, { status: 404 });
    }

    return NextResponse.json({ challenge: randomChallenge[0] }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
