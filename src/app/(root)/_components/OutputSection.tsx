'use client';
import { CheckSquare2Icon, Clock, CopyCheck, CopyIcon, SquareTerminal } from 'lucide-react'
import { motion } from 'framer-motion'
import React, { useState } from 'react'
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore'
import Image from 'next/image';

const OutputSection = () => {
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
    <div className='flex-1 flex flex-col bg-[#442617] rounded-xl p-5 font-[Roboto]'>
      <div className='flex justify-between'>
        <p className='text-sm text-amber-300 flex items-center gap-2'><SquareTerminal size={20} />Output</p>
        {hasContent && <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleCopy} className='border border-amber-900 bg-amber-800/40 hover:bg-amber-900 transition-colors duration-200 rounded-md h-[34px] aspect-square text-amber-300 flex items-center text-xs px-2 gap-1'>{isCopied ? <CopyCheck size={15} /> : <CopyIcon size={15} />} {isCopied && "Copied"}</motion.button>}
      </div>
      <div className='flex-1 border mt-3 rounded-lg border-amber-900 p-3'>
        {isRunning ? (
          <div className='h-full w-full grid place-items-center' >
            <div className='flex flex-col items-center'>
              <Image src="/gifs/running.gif" alt="running" aria-hidden width={50} height={50} />
              <p className='text-amber-300'>Your Code Is Running...</p>
            </div>
          </div>
        ) : (hasContent ? (output || error) : (
          <div className='h-full w-full grid place-items-center' >
            <div className='flex flex-col items-center text-amber-300'>
              <Clock />
              <p>Run your code to see output here</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OutputSection