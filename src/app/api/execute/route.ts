import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

function extractFunctionName(starterCode: string): string | null {
    const match = starterCode.match(/def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(/);
    return match ? match[1] : null;
}

export const POST = async (req: NextRequest) => {

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

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

            let fullCode: string;

            if (functionName === "count_occurrences") {
                fullCode = `
import ast
${code}
input_value = ast.literal_eval(${JSON.stringify(JSON.stringify(input))})
numbers = input_value[:-1]
target = input_value[-1]
print(${functionName}(numbers, target))
`.trim();
            } else if (functionName === "max_in_tuple") {
                fullCode = `
import ast
${code}
input_value = ast.literal_eval(${JSON.stringify(input)})
print(${functionName}(input_value))
`.trim();

            } else if (functionName === "are_anagrams") {
                fullCode = `
import ast
${code}
input_value = ast.literal_eval(${JSON.stringify(JSON.stringify(input))})

def call_func(fn, args):
    if isinstance(args, list):
        return fn(*args)
    elif isinstance(args, str):
        parts = args.split()
        if len(parts) == 1:
            return fn(parts[0])
        elif len(parts) >= 2:
            mid = len(parts) // 2
            s1 = " ".join(parts[:mid])
            s2 = " ".join(parts[mid:])
            return fn(s1, s2)
        else:
            return fn(args)
    else:
        return fn(args)

print(call_func(${functionName}, input_value))
`.trim();

            } else if (functionName === "intersection_of_lists") {
                fullCode = `
${code}
lines = ${JSON.stringify(input)}.split("\\n")
list1 = list(map(int, lines[0].split()))
list2 = list(map(int, lines[1].split()))
result = ${functionName}(list1, list2)
print(" ".join(map(str, result)))
`.trim();


            } else if (functionName === "most_frequent_element") {
                fullCode = `
${code}
input_value = list(map(int, ${JSON.stringify(input)}.split()))
print(${functionName}(input_value))
`.trim();

            } else if (functionName === "merge_dictionaries") {
                fullCode = `
from typing import Dict

${code}

def parse_input(input_str: str) -> tuple[Dict[str, int], Dict[str, int]]:
    parts = input_str.strip().split()
    mid = len(parts) // 2
    dict1 = {}
    dict2 = {}

    for pair in parts[:mid]:
        k, v = pair.split(':')
        dict1[k] = int(v)

    for pair in parts[mid:]:
        k, v = pair.split(':')
        dict2[k] = int(v)

    return dict1, dict2

input_value = ${JSON.stringify(input)}
dict1, dict2 = parse_input(input_value)
merged = ${functionName}(dict1, dict2)
print(' '.join(f'{k}:{merged[k]}' for k in sorted(merged)))
`.trim();

            }


            else {
                fullCode = `
import ast
${code}
input_value = ${JSON.stringify(input)}
print(${functionName}(input_value))
`.trim();
            }

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
