'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Link from 'next/link';
import Image from 'next/image';

const questions = [
  {
    prompt: 'Return the sum of two integers',
    constraints: 'Input: 1, 3\nOutput: 4',
    testCases: [
      { input: [1, 3], expected: 4 },
      { input: [5, 6], expected: 11 },
      { input: [-2, 9], expected: 7 },
      { input: [0, 0], expected: 0 },
      { input: [-4, -1], expected: -5 },
      { input: [100, 23], expected: 123 },
    ],
  },
  // Add more questions as needed
];

export default function CampaignMode() {
  const [question, setQuestion] = useState(questions[0]);
  const [code, setCode] = useState('def solve(a, b):\n    return a + b');
  const [output, setOutput] = useState('');
  const [hintShown, setHintShown] = useState(false);

  const runCode = () => {
    let passed = 0;
    try {
      // eslint-disable-next-line no-new-func
      const userFunc = new Function('a', 'b', code + '\nreturn solve(a, b);');

      question.testCases.forEach(({ input, expected }) => {
        const result = userFunc(...input);
        if (result === expected) passed++;
      });

      setOutput(
        passed === question.testCases.length
          ? 'All test cases passed 🎉'
          : `${passed}/${question.testCases.length} test cases passed`
      );
    } catch (err: any) {
      setOutput(`error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#020c2b] text-white p-6 font-mono">
      <div className="flex justify-between items-center mb-4">
        <Link href="/courses" className="text-cyan-400 text-xl font-bold">
        <Image
          src="/back.png"
          alt="Back"
          width={28}
          height={28}
          className="cursor-pointer"
        />
        </Link>
        <h1 className="text-cyan-400 text-2xl font-bold">CAMPAIGN MODE</h1>
        <div className="flex gap-4 text-cyan-400 text-xl">
        <Image
          src="/gear.png"
          alt="Settings"
          width={28}
          height={28}
          className="cursor-pointer"
        />
        <Link href="/">
          <Image
            src="/home.png"
            alt="Home"
            width={28}
            height={28}
            className="cursor-pointer"
          />
        </Link>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-6">
        {/* Question Panel */}
        <div className="col-span-1 border-2 border-blue-500 p-4 rounded-lg relative h-[400px] overflow-auto">
          <h2 className="font-bold mb-2">{question.prompt}</h2>
          <p className="text-sm mb-4 whitespace-pre-wrap">{question.constraints}</p>
          {hintShown && <div className="text-yellow-300 text-sm mt-2">Hint: Use return a + b</div>}
          <button
            onClick={() => setHintShown(true)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            Hint
          </button>
        </div>

        {/* Code Editor */}
        <div className="col-span-3 border-2 border-blue-500 rounded-lg">
          <div className="relative">
            <Editor
              height="400px"
              defaultLanguage="python"
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false } }}
            />
          </div>

          <div className="flex justify-center gap-6 mt-4">
            <button
              onClick={runCode}
              className="px-6 py-2 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              RUN
            </button>
            <button
              onClick={runCode}
              className="px-6 py-2 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              Check Answer
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="mt-6 border-2 border-blue-500 p-4 rounded-lg bg-[#020c2b] min-h-[100px]">
        <h3 className="text-lg font-bold mb-2 text-white">Terminal</h3>
        <pre className="text-white whitespace-pre-wrap">{output}</pre>
      </div>
    </div>
  );
}