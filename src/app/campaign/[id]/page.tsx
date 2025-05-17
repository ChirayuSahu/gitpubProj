'use client';

import React, { useState, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import LoadingPage from '@/components/custom/loadingPage';
import { useRouter } from 'next/navigation';
import Squares from '@/components/Squares/Squares';

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

type PageProps = {
  params: {
    id: string;
  };
}

export default function SpecificCampaignPage({ params }: PageProps) {

  const monaco = useMonaco();

  useEffect(() => {
    if (monaco) {
      // Define and set your theme if needed
      monaco.editor.defineTheme('my-dark-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#020c2b',
          'editor.foreground': '#ffffff',
          'editorLineNumber.foreground': '#F2B72D',
          'editorCursor.foreground': '#F2B72D',
        },
      });
      monaco.editor.setTheme('my-dark-theme');

      // Inject CSS to make editor font bold
      const style = document.createElement('style');
      style.innerHTML = `
        .monaco-editor .mtk1 {
          font-weight: bold !important;
        }
        .monaco-editor .view-lines {
          font-weight: bold !important;
        }
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [monaco]);

  const { id } = params;

  const [question, setQuestion] = useState<Challenge | null>(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<Output | null>();
  const [hintShown, setHintShown] = useState(false);
  const [checkingData, setCheckingData] = useState<any>(null);
  const [correct, setCorrect] = useState(false);

  const router = useRouter();


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
          router.back();
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
    setOutput(null);
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
      });

      setProgress(50);

      const data = await res.json();

      setProgress(70);

      if (!res.ok) {
        setProgress(100);
        setLoading(false);
        toast.error(data.message);
        return;
      }

      console.log("Checking Data", data);
      setCheckingData(data);

      const allPassed = data.results.every((result: any) => result.passed);
      if (allPassed) {
        setCorrect(true);
      } else {
        setCorrect(false);
      }

    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setProgress(100);
      setLoading(false);
    }
  };


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

  if (loading) {
    return <LoadingPage text="Loading..." progress={progress} />
  }

  return (
    <>
      <div className='absolute bg-[#051D5B] top-0 left-0 w-full min-h-screen overflow-hidden'>
      </div>
      <div className='absolute opacity-10 top-0 z-10 left-0 w-full min-h-screen overflow-hidden'>
        <Squares
          speed={0.1}

        />
      </div>
      <div className="absolute z-20 text-white p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-4">
          <div className='flex items-center gap-4'>
            <Link href="/courses" className="text-cyan-400 text-xl font-bold">
              <Image
                src="/back.png"
                alt="Back"
                width={28}
                height={28}
                className="cursor-pointer"
              />
            </Link>
            <h1 className="text-cyan-400 text-4xl font-bold">CAMPAIGN MODE</h1>
          </div>
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

        <div className="grid grid-cols-4 gap-6 overflow-auto">
          <div className={`col-span-1 border-2 border-blue-500 p-4 bg-[#000928] rounded-lg relative overflow-auto ${output || checkingData ? 'h-full' : 'h-[80vh]'}`}>
            <h2 className="text-2xl font-bold mb-2">{question?.name}</h2>
            <p className="text-xl mb-4 whitespace-pre-wrap">{question?.description}</p>
            <p className="text-xl mb-4 whitespace-pre-wrap">Test Cases</p>
            {question?.testCases.map((testCase, index) => (
              <div key={index} className="mb-2">
                <p className="text-xl">Input: {JSON.stringify(testCase.input)}</p>
                <p className="text-xl">Output: {testCase.output}</p>
              </div>
            ))}
          </div>

          <div className="col-span-3 border-2 border-blue-500 rounded-lg bg-[#020c2b] p-2">
            <div className="relative">
              <Editor
                height="320px"
                defaultLanguage="python"
                value={code}
                theme="my-dark-theme"
                onChange={(value) => setCode(value || '')}
                options={{
                  scrollBeyondLastLine: false,
                  fontSize: 20,
                  minimap: { enabled: false },

                }}
              />
            </div>

          </div>

          <div className='flex items-center justify-center'>
            <button
              onClick={() => setHintShown(prev => !prev)}
              disabled={!correct}
              className={`px-4 text-2xl font-black py-1 border-4 bg-[#000928] border-yellow-400 text-yellow-500 rounded transition ${correct ? 'cursor-pointer hover:text-black text-yellow-300' : 'cursor-not-allowed hover:bg-[#000928]'}`}
            >
              Submit
            </button>
          </div>

          <div className="flex justify-center items-center col-span-3 gap-4">
            <button
              className="px-4 py-1 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-2xl transition"
              onClick={handleExecuteCode}
            >
              RUN
            </button>
            <button
              className="px-4 py-1 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-2xl transition"
              onClick={handleCheckCode}
            >
              Check Answer
            </button>
          </div>
        </div>

        {checkingData && !output && (
          <div className="mt-6 flex flex-col gap-5 border-2 border-blue-500 p-6 rounded-lg bg-[#020c2b] overflow-auto max-h-[33vh]">
            <h3 className="text-4xl font-bold mb-2 text-white">Test Results</h3>
            {Array.isArray(checkingData.results) ? (
              checkingData.results.map((res: any, index: number) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 border m-2 ${res.passed
                      ? 'bg-green-900/30 border-green-500'
                      : 'bg-red-900/30 border-red-500'
                    }`}
                  style={{
                    boxShadow: res.passed
                      ? '0 0 10px 3px rgba(34,197,94, 0.5)'
                      : '0 0 10px 3px rgba(239,68,68, 0.5)'
                  }}
                >

                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-semibold text-xl text-white">Test Case {index + 1}</h4>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${res.passed ? 'bg-white text-green-700' : 'bg-white text-red-500'
                        }`}
                    >
                      {res.passed ? 'Passed' : 'Failed'}
                    </span>
                  </div>
                  <p className="text-lg text-gray-300"><strong className="text-white">Input:</strong> {res.input}</p>
                  <p className="text-lg text-gray-300"><strong className="text-white">Expected:</strong> {res.expectedOutput}</p>
                  <p className="text-lg text-gray-300"><strong className="text-white">Received:</strong> {res.actualOutput}</p>
                </div>

              ))
            ) : (
              <p>No results to display</p>
            )}
          </div>
        )}

        {output && (
          <div className="mt-6 border-2 border-blue-500 p-4 rounded-lg bg-[#020c2b] max-h-[40vh]">
            <h3 className="text-lg font-bold mb-2 text-white">Output</h3>
            <pre className="text-white whitespace-pre-wrap">{output.message}</pre>
            <pre className="text-white whitespace-pre-wrap">{output.output}</pre>
            <pre className="text-white whitespace-pre-wrap">{output.stderr}</pre>
          </div>
        )}
      </div>
    </>
  );
}