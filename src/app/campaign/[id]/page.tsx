'use client';

import React, { useState, useEffect, useRef } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import TopMenu from '@/components/custom/topMenu';
import Image from 'next/image';
import { toast } from 'sonner';
import LoadingPage from '@/components/custom/loadingPage';
import { useRouter } from 'next/navigation';
import Squares from '@/components/Squares/Squares';
import { use } from 'react';
import { useSession } from 'next-auth/react';
import CompletedScreen from '@/components/custom/completedScreen';
import { campaignQuestionIds, chaosQuestions } from '@/lib/campaignQuestionIds';
import CountdownTimer from '@/components/custom/timer';
import { useTimerStore } from '@/providers/timerStore';

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
  params: Promise<{ id: string }>;
};

export default function SpecificCampaignPage({ params }: PageProps) {



  const monaco = useMonaco();
  const { data: session } = useSession();
  const userId = session?.user.id;

  useEffect(() => {
    if (!session) return;
  }, [session]);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('my-dark-theme', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#020c2b',
          'editor.foreground': '#ffffff',
          'editorLineNumber.foreground': '#F2B72D',
          'editorCursor.foreground': '#F2B72D',
          'scrollbarSlider.background': '#EAB206',
        },
      });
      monaco.editor.setTheme('my-dark-theme');

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

  const { id } = use(params);

  const router = useRouter();
  const [chaos, setChaos] = useState(false);

  useEffect(() => {
    if (chaosQuestions.includes(id)) {
      setChaos(true);
    } else if (!campaignQuestionIds.includes(id)) {
      router.push('/campaign');
    }


  }, [id, router]);



  const [question, setQuestion] = useState<Challenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [output, setOutput] = useState<Output | null>();
  const [checkingData, setCheckingData] = useState<any>(null);
  const [correct, setCorrect] = useState(false);
  const [fullscreen, setFullScreen] = useState(false);
  const alreadyCompleted = useRef(false);
  const [timeUp, setTimeUp] = useState(false);

  const userCode = useRef<string | undefined>(undefined);

  const [completed, setCompleted] = useState(false);

  const [isAddingChaos, setIsAddingChaos] = useState(false);
  const timeLeft = useTimerStore((state) => state.timeLeft);
  const lastRunAt = useRef<number | null>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {

    const checkCompleted = async () => {
      try {
        const res = await fetch(`/api/me`, {
          method: 'GET',
        });

        const data = await res.json();

        if (!res.ok) {
          router.back();
          return;
        }

        setUser(data);

        if (data.challenges?.includes(id)) {
          alreadyCompleted.current = true;
        }

      } catch (error: any) {
        toast.error(error?.message || JSON.stringify(error) || 'An unknown error occurred');
      }
    };


    checkCompleted();
  }, [id, router]);

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
        userCode.current = data.challenge.starterCode;

      } catch (error: any) {
        toast.error(error?.message || JSON.stringify(error) || 'An unknown error occurred');
      } finally {
        setProgress(100);
        setLoading(false);
      }
    }


    fetchQuestion();

  }, [id, router])

  const addChaos = async () => {

    setIsAddingChaos(true);
    setProgress(10);

    try {
      const res = await fetch(`/api/addChaos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: userCode.current,
        }),
      });

      setProgress(50);

      const data = await res.json();

      userCode.current = data.chaoticCode;

    } catch (error: any) {
      toast.error(error?.message || JSON.stringify(error) || 'An unknown error occurred');
    } finally {
      setProgress(100);
      setIsAddingChaos(false);
    }
  }

  useEffect(() => {
    const totalTime = question?.timeLimit! * 60 || 300;
    const elapsed = totalTime - timeLeft;

    if (
      elapsed > 0 &&
      elapsed < totalTime &&
      elapsed % 30 === 0
    ) {
      if (lastRunAt.current !== elapsed) {
        addChaos();
        lastRunAt.current = elapsed;
      }
    }
  }, [timeLeft, question?.timeLimit!]);


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
          code: userCode.current,
          testCases: question?.testCases
        }),
      });

      setProgress(50);

      const data = await res.json();

      setProgress(70);

      if (!res.ok) {
        setProgress(100);
        setLoading(false);
        toast.error(data?.message || JSON.stringify(data) || 'An unknown error occurred');
        return;
      }

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
          code: userCode.current,
        }),
      });

      setProgress(50);

      const data = await res.json();

      if (!res.ok) {
        setProgress(100);
        setLoading(false);
        toast.error(data?.message || JSON.stringify(data) || 'An unknown error occurred');
        return;
      }

      setOutput(data);

    } catch (error: any) {
      toast.error(error?.message || JSON.stringify(error) || 'An unknown error occurred');
    } finally {
      setProgress(100);
      setLoading(false);
    }
  }

  const handleSubmit = async () => {
    setLoading(true);
    setProgress(10);
    try {
      const res = await fetch(`/api/completed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          challengeId: question?._id,
          id: userId,
        }),
      })

      setProgress(50);

      const data = await res.json();

      if (!res.ok) {
        toast.error(data?.message || JSON.stringify(data) || 'An unknown error occurred');
        return;
      }

      toast.success(data.message)
      setCompleted(true);

    } catch (error: any) {
      toast.error(error?.message || JSON.stringify(error) || 'An unknown error occurred');
    } finally {
      setProgress(100);
      setLoading(false);
    }
  }

  useEffect(() => {
    function updateScale() {
      const baseHeight = 1050;
      const currentHeight = window.innerHeight;

      const newScale = Math.min(Math.max(currentHeight / baseHeight, 0.8), 1.2);
      setScale(newScale);
    }

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  if (completed) {
    return (
      <div className='absolute z-0 h-screen w-full bg-[#011037]'>
        <CompletedScreen currentXp={user?.xpPoints} nextTierXp={600} xpIncrease={question?.winXP} />
      </div>
    )
  }

  if (isAddingChaos) {
    return <LoadingPage text="Adding Chaos..." progress={progress} />
  }

  if (loading) {
    return <LoadingPage text="Loading..." progress={progress} />
  }

  if (fullscreen) {
    return (
      <div className={`relative col-span-3 bg-[#020c2b] p-2 min-h-screen`}>
        <div className={`py-6 h-[96vh] ${chaos ? `pt-11` : ``}`}>
          {chaos && (
            <div className="absolute top-1 right-5 flex gap-4 z-50 bg-opacity-70 p-2 rounded">
              <CountdownTimer minutes={question?.timeLimit} />
            </div>
          )}

          <Editor
            height="100%"
            defaultLanguage="python"
            value={userCode.current}
            theme="my-dark-theme"
            onChange={(value) => { userCode.current = value || ''; }}
            options={{
              scrollBeyondLastLine: false,
              fontSize: 20,
              minimap: { enabled: false },
            }}
          />
          <div className="absolute bottom-5 right-5 flex gap-4">
            <button onClick={() => setFullScreen(prev => !prev)} className="bg-[#000928] p-2 rounded-full">
              <Image
                src="/minimize.png"
                alt="Minimize"
                style={{ width: '24px', height: '24px' }}
                className="cursor-pointer"
                width={24}
                height={24}
              />
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (timeUp) {

    setTimeout(() => {
      router.push('/menu');
    }, 2000);
    return <LoadingPage text="Time Up. Redirecting to menu.." progress={100} />
  }

  return (
    <>
      <div className="relative w-full min-h-screen">
        <div className='absolute bg-[#051D5B] top-0 left-0 w-full h-full overflow-auto'>
        </div>
        <div className='absolute opacity-10 top-0 z-10 left-0 w-full min-h-screen overflow-auto'>
          <Squares
            speed={0.1}
            squareSize={100}
          />
        </div>
        <div className='absolute z-100 w-full'>
          <TopMenu text={`Campaign - ${question?.name}`} back='/campaign' />
        </div>
        <div className="absolute z-20 mt-25 text-white p-6 pb-0 pt-0 overflow-hidden">

          <div className="grid grid-cols-4 gap-6 overflow-auto custom-scrollbar">
            <div className={`custom-scrollbar --font-outfit font-black col-span-1 border-2 border-blue-500 p-8 bg-[#000928] rounded-lg relative overflow-auto ${output || checkingData ? 'max-h-70 xl:max-h-80 2xl:max-h-100' : 'h-120 xl:h-130 2xl:h-180'}`}>
              <h2 className="text-xl xl:text-2xl 2xl:text-3xl font-bold mb-2 transition-all duration-300">{question?.name} {alreadyCompleted.current && (<span className='text-green-400'>- Completed</span>)}</h2>
              <p className="text-base xl:text-lg 2xl:text-2xl mb-4 whitespace-pre-wrap transition-all duration-300">{question?.description}</p>
              <p className="text-base xl:text-lg 2xl:text-2xl mb-4 whitespace-pre-wrap transition-all duration-300">Test Cases</p>
              {question?.testCases.map((testCase, index) => (
                <div key={index} className="mb-2">
                  <p className="text-base xl:text-lg 2xl:text-2xl transition-all duration-300"><span className='text-yellow-500'>Input:</span> {JSON.stringify(testCase.input)}</p>
                  <p className="text-base xl:text-lg 2xl:text-2xl transition-all duration-300"><span className='text-yellow-500'>Output:</span> {testCase.output}</p>
                </div>
              ))}
            </div>

            <div className="relative col-span-3 border-2 border-blue-500 rounded-lg bg-[#020c2b] p-2">
              <div className={`py-2 ${chaos ? `pt-12` : ``}  ${output || checkingData ? 'h-full' : 'h-110'}`}>
                {chaos && (
                  <div className="absolute top-1 right-5 flex gap-4 z-50 bg-opacity-70 p-2 rounded">
                    <CountdownTimer minutes={question?.timeLimit} onTimeUp={() => setTimeUp(true)} />
                  </div>
                )}
                <Editor
                  height="100%"
                  defaultLanguage="python"
                  value={userCode.current}
                  theme="my-dark-theme"
                  onChange={(value) => { userCode.current = value || ''; }}
                  options={{
                    scrollBeyondLastLine: false,
                    fontSize: 20,
                    minimap: { enabled: false },

                  }}
                />
                <div className="absolute bottom-5 right-5 flex gap-4">
                  <button onClick={() => setFullScreen(!fullscreen)} className="bg-[#000928] p-2 rounded-full">
                    <Image
                      src="/fullscreen.png"
                      alt="Fullscreen"
                      style={{ width: '24px', height: '24px' }}
                      className="cursor-pointer"
                      width={24}
                      height={24}
                    />
                  </button>
                </div>
              </div>
            </div>

            <div className='flex items-center justify-center'>
              {!alreadyCompleted.current && (
                <button
                  disabled={!correct}
                  onClick={handleSubmit}
                  className={`px-4 text-2xl font-black py-1 border-4 bg-[#000928] border-yellow-400 text-yellow-300 rounded transition ${correct ? 'cursor-pointer hover:text-black hover:bg-yellow-400 text-yellow-300' : 'cursor-not-allowed hover:bg-[#000928]'}`}
                >
                  Submit
                </button>
              )}
            </div>

            <div className="flex flex-col sm:flex-row justify-center items-center col-span-3 gap-4 w-full px-4">
              <button
                className="w-full sm:w-auto px-4 py-2 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-xs xl:text-lg 2xl:text-3xl transition-all duration-300"
                onClick={handleExecuteCode}
              >
                RUN
              </button>
              <button
                className="w-full sm:w-auto px-4 py-2 border-4 font-bold bg-[#000928] border-yellow-400 text-yellow-300 rounded hover:bg-yellow-400 hover:text-black text-xs xl:text-lg 2xl:text-3xl transition-all duration-300"
                onClick={handleCheckCode}
              >
                Check Answer
              </button>
            </div>

          </div>

          {checkingData && !output && (
            <div className="mt-6 flex flex-col gap-5 border-2 border-blue-500 p-6 rounded-lg bg-[#020c2b] overflow-auto max-h-40 2xl:max-h-70">
              <h3 className="text-xl 2xl:text-2xl font-bold mb-2 text-white">Test Results</h3>
              {Array.isArray(checkingData.results) ? (
                checkingData.results.map((res: any, index: number) => (
                  <div
                    key={index}
                    className={`rounded-lg p-4 border m-2 ${res.passed
                      ? 'border-[#0DFF00]'
                      : 'border-[#FF0000]'
                      }`}
                    style={{
                      boxShadow: res.passed
                        ? '0 0 10px 3px rgba(34,197,94, 0.25)'
                        : '0 0 10px 3px rgba(239,68,68, 0.25)'
                    }}
                  >

                    <div className="flex justify-between items-center mb-2">
                      <h4 className="font-semibold text-base text-white">Test Case {index + 1}</h4>
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${res.passed ? 'bg-white text-green-700' : 'bg-white text-red-500'
                          }`}
                      >
                        {res.passed ? 'Passed' : 'Failed'}
                      </span>
                    </div>
                    <p className="text-xs 2xl:text-lg text-gray-300"><strong className="text-white">Input:</strong> {res.input}</p>
                    <pre className="text-xs 2xl:text-lg text-gray-300"><strong className="text-white">Expected:</strong> {res.expectedOutput}</pre>
                    <pre className="text-xs 2xl:text-lg text-gray-300"><strong className="text-white">Received:</strong> {res.actualOutput}</pre>
                  </div>

                ))
              ) : (
                <p>No results to display</p>
              )}
            </div>
          )}

          {output && (
            <div className="mt-6 border-2 border-blue-500 p-4 rounded-lg bg-[#020c2b] overflow-auto 2xl:min-h-70">
              <h3 className="text-xl 2xl:text-2xl font-bold mb-2 text-white">Output</h3>
              <h3 className="text-base 2xl:text-lg mb-4 text-green-500">{output.message}</h3>
              <pre className="text-white text-xs 2xl:text-lg whitespace-pre-wrap my-4">stdout: {output.output}</pre>
              <pre className="text-red-500 text-xs 2xl:text-lg whitespace-pre-wrap my-4">stderr: {output.stderr}</pre>
            </div>
          )}
        </div>
      </div>
    </>
  );
}