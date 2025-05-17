import { NextResponse, NextRequest } from "next/server";
import { connectMongo } from "@/utils/connectMongo";
import Challenges from "@/models/challenges";

export const GET = async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    const difficulty = searchParams.get("difficulty");
    const limitParam = searchParams.get("limit");
    const questionId = searchParams.get("id");

    if (questionId) {
      
      await connectMongo();


      const challenge = await Challenges.findById(questionId);
      if (!challenge) {
        return NextResponse.json({ message: "Challenge not found." }, { status: 404 });
      }
      return NextResponse.json({ challenge }, { status: 200 });
    }

    if (!difficulty) {
      return NextResponse.json({ message: "Difficulty is required." }, { status: 400 });
    }

    await connectMongo();

    const limit = limitParam ? parseInt(limitParam, 10) : null;

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
