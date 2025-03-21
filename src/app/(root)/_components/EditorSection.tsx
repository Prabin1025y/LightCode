'use client';
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore'
import { Share, TypeOutline } from 'lucide-react';
import { motion } from 'framer-motion'
import Image from 'next/image'
import React, { useState } from 'react'
import { Editor } from '@monaco-editor/react';
import { defineMonacoThemes, LANGUAGE_CONFIG } from '../_constants';
import UseMounted from '@/app/hooks/useMounted';
import RunButton from './RunButton';
import { SignedIn } from '@clerk/nextjs';
import ShareSnippetPopup from './ShareSnippetPopup';

const EditorSection = () => {
  const [isSharePopupOpen, setIsSharePopupOpen] = useState(false);

  const { fontSize, language, setFontSize, theme, setEditor } = useCodeEditorStore();
  const isMounted = UseMounted();

  const handleEditorChange = (value: string | undefined) => {
    if (value) localStorage.setItem(`editor-code-${language}`, value);
  }
  const handleFontSizeChange = (value: number) => {
    const font_size = Math.max(12, Math.min(value, 24));
    setFontSize(font_size);
  }


  return (
    <div className='flex-1 flex flex-col bg-[#442617] rounded-xl p-5 font-[Roboto]'>

      {/* header */}
      <div className='flex justify-between items-center'>
        <div className='flex gap-2'>
          <div className='grid place-items-center'>
            <Image className='aspect-square object-cover w-auto h-auto' width={25} height={25} src={`/icons/${language}.png`} alt='language logo' />
          </div>
          <div>
            <p className='text-sm text-amber-200'>Code Editor</p>
            <p className='text-xs text-[#b4663f]'>Write and execute your code here</p>
          </div>
        </div>

        <div className='flex gap-3'>
          <div className='flex gap-2 border border-amber-900 bg-amber-800/40 hover:bg-amber-900 transition-colors duration-200 px-3 py-1 rounded-lg items-center text-amber-300'>
            <TypeOutline size={16} />
            <input onChange={(e) => handleFontSizeChange(parseInt(e.target.value))} value={fontSize} className='h-1' type="range" min={12} max={24} />
            {isMounted && <p className='text-sm'>{fontSize}</p>}
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSharePopupOpen(true)} title='Share this Snippet' className='border border-amber-900 bg-amber-800/40 hover:bg-amber-900 transition-colors duration-200 p-2 rounded-md h-[34px] aspect-square grid place-items-center text-amber-300'><Share size={15} /></motion.button>
          <SignedIn>
            <RunButton />
          </SignedIn>
          {/* <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setIsSharePopupOpen(true)} className='border px-2 py-1 bg-[#2369ff] rounded-md border-[#3686ff] flex gap-1 items-center hover:bg-[#5f9fff] transition duration-200'><Share size={16} />Share</motion.button> */}
        </div>
      </div>

      <div className='flex-1 border mt-5 rounded-lg border-amber-900 bg-[#2c140e] overflow-hidden'>
        <Editor
          height={"550px"}
          language={LANGUAGE_CONFIG[language].monacoLanguage}
          onChange={handleEditorChange}
          theme={theme}
          beforeMount={defineMonacoThemes}
          onMount={(editor) => setEditor(editor)}

          options={{
            minimap: { enabled: false },
            fontSize,
            automaticLayout: true,
            // scrollBeyondLastLine: false,
            padding: { top: 30, bottom: 16 },
            renderWhitespace: "selection",
            fontFamily: '"Fire Code","Cascadia Code", Consolas, monospace',
            fontLigatures: true,
            cursorBlinking: "smooth",
            smoothScrolling: true,
            contextmenu: true,
            renderLineHighlight: "all",
            lineHeight: 1.6,
            letterSpacing: 0.5,
            roundedSelection: true,
            scrollbar: {
              verticalScrollbarSize: 8,
              horizontalScrollbarSize: 8
            }
          }}
        />
        {/* <OutputSection /> */}
      </div>
      {isSharePopupOpen && <ShareSnippetPopup onClose={() => setIsSharePopupOpen(false)} />}
    </div>
  )
}

export default EditorSection