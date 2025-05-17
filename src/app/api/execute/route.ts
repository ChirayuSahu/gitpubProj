import { NextRequest, NextResponse } from "next/server";

function extractFunctionName(starterCode: string): string | null {
    const match = starterCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : null;
}

export const POST = async (req: NextRequest) => {
    const { language, starterCode, code, testCases } = await req.json();

    if (!code || !language || !Array.isArray(testCases) || !starterCode) {
        return NextResponse.json(
            { message: "Code, language, starterCode, and testCases are required." },
            { status: 400 }
        );
    }

    const functionName = extractFunctionName(starterCode);
    if (!functionName) {
        return NextResponse.json(
            { message: "Could not extract function name from starterCode." },
            { status: 400 }
        );
    }

    try {
        const results = [];

        for (const testCase of testCases) {
            const { input, output: expectedOutput } = testCase;

            const fullCode = `
import ast
${code}
input_value = ast.literal_eval(${JSON.stringify(input)})
print(${functionName}(input_value))
`.trim();

            const res = await fetch("https://emkc.org/api/v2/piston/execute", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    language,
                    version: "3.10.0",
                    files: [
                        {
                            name: "main.py",
                            content: fullCode,
                        },
                    ],
                }),
            });

            const data = await res.json();
            const actualOutput = (data?.run?.output || "").trim();

            results.push({
                input,
                expectedOutput,
                actualOutput,
                passed: actualOutput === expectedOutput,
                stdout: data?.run?.output || "",
                stderr: data?.run?.stderr || "",
            });
        }

        return NextResponse.json(
            { message: "Code tested successfully.", results },
            { status: 200 }
        );
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
};
