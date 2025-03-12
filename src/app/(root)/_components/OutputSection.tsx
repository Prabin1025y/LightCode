'use client';
import { CheckCircleIcon,  Clock, CopyCheck, CopyIcon, SquareTerminal, TriangleAlertIcon } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore'
import Image from 'next/image';
import { useUser } from '@clerk/nextjs';

const OutputSection = () => {
  const { user } = useUser();
  const [isCopied, setIsCopied] = useState(false);

  const { output, error, isRunning } = useCodeEditorStore();

  const hasContent = error || output;

  const handleCopy = async () => {
    if (!hasContent) return;

    await navigator.clipboard.writeText(error || output);
    setIsCopied(true);

    setTimeout(() => setIsCopied(false), 4000);
  }
  return (
    <div className='flex-1 flex flex-col bg-[#442617] rounded-b-xl p-5 font-[Roboto]'>
      <div className='flex justify-between'>
        <div className='flex gap-4'>
          <p className='text-sm text-amber-300 flex items-center gap-2'><SquareTerminal size={20} />Output</p>
          {hasContent && <div className={`flex gap-1 text-sm font-[Roboto] items-center ${error ? "bg-red-500/20 text-red-500":"bg-green-500/20 text-green-500"} rounded-md px-3`}>
            {error ? <TriangleAlertIcon size={20} />:<CheckCircleIcon size={20} />}
            {error?<p>Program crashed with some errors</p>:<p>Program compiled successfully.</p>}
          </div>}
        </div>
        {hasContent && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCopy} title='Copy' className='border border-amber-900 bg-amber-800/40 hover:bg-amber-900 transition-colors duration-200 rounded-md h-[34px] aspect-square text-amber-300 flex items-center text-xs px-2 gap-1'>{isCopied ? <CopyCheck size={15} /> : <CopyIcon size={15} />} {isCopied && "Copied"}</motion.button>}
      </div>
      <div className='flex-1 border mt-3 rounded-lg border-amber-900 p-3 bg-[#24140c] overflow-y-auto'>
        {isRunning ? (
          <div className='h-full w-full grid place-items-center' >
            <div className='flex flex-col items-center'>
              <Image src="/gifs/running.gif" alt="running" aria-hidden width={50} height={50} />
              <p className='text-amber-300'>Your Code Is Running...</p>
            </div>
          </div>
        ) : (error ? (
          <pre className='whitespace-pre-wrap text-red-400/80'>{error}</pre>
        ) : (output ? (
          <pre className='whitespace-pre-wrap'>{output}</pre>
        )
          :
          <div className='h-full w-full grid place-items-center' >
            <div className='flex flex-col items-center text-amber-300'>
              <Clock />
              {user? <p>Run your code to see output here</p> : <p>Log in to Run Your code</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutputSection