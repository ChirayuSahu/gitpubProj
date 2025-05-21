import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

export const POST = async (req: NextRequest) => {

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { code, language = "python" } = await req.json();

  if (!code) {
    return NextResponse.json({ message: "Code is required." }, { status: 400 });
  }

  try {
    const res = await fetch("https://emkc.org/api/v2/piston/execute", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        language,
        version: "3.10.0",
        files: [
          {
            name: "main.py",
            content: code,
          },
        ],
      }),
    });

    const data = await res.json();

    const output = (data?.run?.output || "").trim();
    const stderr = (data?.run?.stderr || "").trim();

    return NextResponse.json(
      {
        message: "Code executed successfully.",
        output,
        stderr,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
};
