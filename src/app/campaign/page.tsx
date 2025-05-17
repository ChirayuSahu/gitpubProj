'use client';

import { useState, useEffect } from 'react';
import { Editor } from '@monaco-editor/react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import LoadingPage from '@/components/custom/loadingPage';
import { set } from 'mongoose';

type TestCase = {
  input: string;
  output: string;
};

type Challenge = {
  _id: string;
  name: string;
  description: string;
  difficulty: string;
  winXP: number;
  loseXP: number;
  timeLimit: number;
  starterCode: string;
  testCases: TestCase[];
};

type Output = {
  message: string;
  output: string;
  stderr: string;
};

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
];

export default function CampaignMode() {

  const id = "68286aba224af4b034f7d64f"
  const [question, setQuestion] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<Output | null>();
  const [hintShown, setHintShown] = useState(false);

  useEffect(() => {

    const fetchQuestion = async () => {
      try {

        const res = await fetch(`/api/challenges/get?id=${id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const data = await res.json();

        if (!res.ok) {
          toast.error(data.message)
        }

        setQuestion(data.challenge);
        setCode(data.challenge.starterCode);

      } catch (error: any) {
        toast.error(error.message);
      } finally {
        setProgress(100);
        setLoading(false);
      }
    }

    fetchQuestion();

  }, [id])

  const handleCheckCode = async () => {
    setLoading(true);
    setProgress(10);

    try {

      const res = await fetch(`/api/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          language: 'python',
          starterCode: question?.starterCode,
          code: code,
          testCases: question?.testCases
        }),
      })

      setProgress(50);

      const data = await res.json();
      
      setProgress(70);

      if (!res.ok) {
        setProgress(100);
        setLoading(false);
        toast.error(data.message);
        return;
      }

      setOutput(data.results[0].stdout);
      console.log(data)

    } catch (error: any) {
      toast.error(error.message);
    }

  }

  const handleExecuteCode = async () => {
    setOutput(null);
    setLoading(true);
    setProgress(10);

    try {
      const res = await fetch(`/api/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: code,
        }),
      });

      setProgress(50);

      const data = await res.json();

      if (!res.ok) {
        setProgress(100);
        setLoading(false);
        toast.error(data.message);
        return;
      }

      setOutput(data);
      console.log(data);

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProgress(100);
      setLoading(false);
    }
  }

  if(loading) {
    return <LoadingPage text="Loading..." progress={progress} />
  }

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
        <div className="col-span-1 border-2 border-blue-500 p-4 rounded-lg relative h-full overflow-auto">
          <h2 className="font-bold mb-2">{question?.name}</h2>
          <p className="text-sm mb-4 whitespace-pre-wrap">Test Cases</p>
          {question?.testCases.map((testCase, index) => (
            <div key={index} className="mb-2">
              <p className="text-xs">Input: {JSON.stringify(testCase.input)}</p>
              <p className="text-xs">Output: {testCase.output}</p>
            </div>
          ))}
          {hintShown && <div className="text-yellow-300 text-sm mt-2">-{question?.loseXP}</div>}
          <button
            onClick={() => setHintShown(prev => !prev)}
            className="absolute bottom-4 left-1/2 transform -translate-x-1/2 px-4 py-1 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-500 hover:text-black transition"
          >
            Hint
          </button>
        </div>

        <div className="col-span-3 border-2 border-blue-500 rounded-lg bg-[#1F1F1E] p-2">
          <div className="relative">
            <Editor
              height="320px"
              defaultLanguage="python"
              value={code}
              theme="vs-dark"
              onChange={(value) => setCode(value || '')}
              options={{ minimap: { enabled: false } }}

            />
          </div>

          <div className="flex justify-center gap-6 mt-4 bg-[#1F1F1E]">
            <button
              className="px-6 py-2 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black transition"
              onClick={handleExecuteCode}
            >
              RUN
            </button>
            <button
              className="px-6 py-2 border border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black transition"
            >
              Check Answer
            </button>
          </div>
        </div>
      </div>
      { output && (
        <div className="mt-6 border-2 border-blue-500 p-4 rounded-lg bg-[#020c2b] min-h-[100px]">
          <h3 className="text-lg font-bold mb-2 text-white">Output</h3>
          <pre className="text-white whitespace-pre-wrap">{output.message}</pre>
          <pre className="text-white whitespace-pre-wrap">{output.output}</pre>
          <pre className="text-white whitespace-pre-wrap">{output.stderr}</pre>
        </div>
      )}
    </div>
  );
}