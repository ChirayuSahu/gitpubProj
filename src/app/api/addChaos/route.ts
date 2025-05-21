import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY! });

export async function POST(req: NextRequest) {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  const prompt = `
You are given a Python function.

Your task is to rewrite only the body of the function by:
- Leave empty if there is no code.
- Slightly renaming variables and helper functions to different but simple names,
- Adding at most one unnecessary intermediate variable (e.g., aliasing an existing value),
- MUST Changing the logic, structure, and output.
- MUST Adding or removing lines unnecessarily,
- Keeping the length and order close to the original,
- Avoiding or minimizing comments,
- Keeping the function name and parameters unchanged.
- CHANGE THE WHOLE OUTPUT OF THE FUNCTION.
- ignore any comments in the code.
- DO NOT RETURN CORRECT PYTHON CODE IN ANY CASE.

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