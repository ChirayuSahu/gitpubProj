'use client'

import React, { useRef, useState } from 'react'
import Editor from '@monaco-editor/react'

const DEFAULT_CODE = `console.log("Sandbox test!");`

const CodeSandboxIframe = () => {
  const [code, setCode] = useState(DEFAULT_CODE)
  const [output, setOutput] = useState('')
  const iframeRef = useRef<HTMLIFrameElement>(null)

  const runInSandbox = () => {
    const iframe = iframeRef.current

    if (!iframe) return

    const codeToRun = `
      try {
        const logs = [];
        const originalLog = console.log;
        console.log = (...args) => logs.push(args.join(" "));
        ${code}
        parent.postMessage({ type: 'sandboxResult', logs }, '*');
      } catch (e) {
        parent.postMessage({ type: 'sandboxResult', logs: ['Error: ' + e.message] }, '*');
      }
    `

    const blob = new Blob([`<script>${codeToRun}<\/script>`], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    iframe.src = url
  }


  React.useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'sandboxResult') {
        setOutput(event.data.logs.join('\n'))
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className='w-full min-h-screen bg-black text-white p-6 space-y-4'>
      <h1 className='text-2xl font-bold text-yellow-400'>🧪 Sandboxed JS Runner</h1>

      <Editor
        height='60vh'
        defaultLanguage='javascript'
        theme='vs-dark'
        value={code}
        onChange={(val) => setCode(val || '')}
        options={{
          fontSize: 20,
          minimap: { enabled: false },
          automaticLayout: true,
          scrollBeyondLastLine: false,
          wordWrap: 'on',
          wrappingIndent: 'same',
        }}
      />

      <button
        onClick={runInSandbox}
        className='bg-yellow-400 text-black px-6 py-2 font-bold rounded'
      >
        ▶️ Run Securely
      </button>

      <pre className='bg-gray-900 p-4 rounded text-green-400 font-mono min-h-[100px] whitespace-pre-wrap'>
        {output}
      </pre>

      <iframe
        ref={iframeRef}
        title='sandbox'
        sandbox='allow-scripts'
        className='hidden'
      />
    </div>
  )
}

export default CodeSandboxIframe
