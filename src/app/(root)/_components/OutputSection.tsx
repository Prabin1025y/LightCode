import { Editor } from '@monaco-editor/react'
import { SquareTerminal } from 'lucide-react'
import React from 'react'
import { LANGUAGE_CONFIG } from '../_constants'

const OutputSection = () => {
  return (
    <div className='flex-1 flex flex-col bg-[#442617] rounded-xl p-5 font-[Roboto]'>
      <p className='text-sm text-amber-300 flex items-center gap-2'><SquareTerminal size={20} />Output</p>
      <div className='flex-1 border mt-3 rounded-lg border-amber-900'>
        output
      </div>
    </div>
  )
}

export default OutputSection