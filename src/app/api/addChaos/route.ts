import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  const prompt = `
You are given a Python function.

Your task is to rewrite only the body of the function by:
- Slightly renaming variables and helper functions to different but simple names,
- Adding at most one unnecessary intermediate variable (e.g., aliasing an existing value),
- Keeping the logic, structure, and output exactly the same,
- Not adding or removing lines unnecessarily,
- Keeping the length and order close to the original,
- Avoiding or minimizing comments,
- Keeping the function name and parameters unchanged.

Return the rewritten function as a JSON object with a single key "code" whose value is the rewritten function as a string.

Original code:

${code}
`;


  try {

    const res = await genAI.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });

    const text = await res.text;

    const match = text?.match(/```json\s*([\s\S]*?)\s*```/);

    if (!match || !match[1]) {
      return NextResponse.json(
        { message: "Failed to parse JSON from AI response", raw: text },
        { status: 500 }
      );
    }

    const jsonObj = JSON.parse(match[1]);
    return NextResponse.json({ chaoticCode: jsonObj.code }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message || String(error) },
      { status: 500 }
    );
  }
}