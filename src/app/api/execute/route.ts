import { NextRequest, NextResponse } from "next/server";


export const POST = async (req: NextRequest) => {

    const { code } = await req.json();

    if (!code) {
        return NextResponse.json({ message: "Code is required." }, { status: 400 });
    }

    try {

        const res = await fetch("https://emkc.org/api/v2/piston/execute", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                language: "python",
                version: "3.10.0",
                files: [
                    {
                        name: "main.py",
                        content: code
                    }
                ]
            })
        });

        const data = await res.json();

        if (data.error) {
            return NextResponse.json({ message: data.error }, { status: 400 });
        }

        return NextResponse.json({ message: "Code executed successfully.", data }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}
