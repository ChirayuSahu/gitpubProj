import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

const genAI = new GoogleGenAI({ apiKey: process.env.NEXT_GEMINI_API_KEY! });

export async function POST(req: NextRequest) {
  const { code } = await req.json();

  if (!code) {
    return NextResponse.json({ message: "Code is required" }, { status: 400 });
  }

  const prompt = `
Rewrite the following Python function into a chaotic and confusing version by:
- Changing variable and function names to meaningless or strange ones,
- Adding unnecessary intermediate variables or calculations,
- Reordering lines if possible,
- Adding redundant or confusing comments,
- Using unusual expressions or steps that still produce the correct output,
- Do NOT change the logic or output of the function.
- keep the length of the code similar to the original.

Return the entire rewritten function as a JSON object with a single key "code" and the value being the chaotic code as a string.

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
