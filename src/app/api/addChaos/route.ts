import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  const prompt = `
Rewrite the following Python function by:
- Slightly changing variable and function names to simple, different ones,
- Adding at most one unnecessary intermediate variable,
- Keeping the original order mostly the same,
- Adding minimal or no comments,
- Ensuring the logic and output remain unchanged,
- Keeping the code length close to the original.
- remember to keep the function name and function inputs same, change anything inside the function.

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