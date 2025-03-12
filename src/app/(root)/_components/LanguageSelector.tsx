'use client';
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore';
import React, { useEffect, useRef, useState } from 'react'
import { LANGUAGE_CONFIG } from '../_constants';
import { ChevronDown, LockIcon,  Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UseMounted from '@/app/hooks/useMounted';
import Image from 'next/image';

// const THEME_ICONS: Record<string, React.ReactNode> = {
//   "vs-dark": <Moon size={16} />,
//   "vs-light": <Sun size={16} />,
//   "github-dark": <Github size={16} />,
//   "monokai": <Laptop size={16} />,
//   "solarized-dark": <Cloud size={16} />
// }

const LanguageSelector = ({ hasAccess }: { hasAccess: boolean }) => {
  const isMounted = UseMounted();

  const [isOpen, setIsOpen] = useState(false);
  const { language, setLanguage } = useCodeEditorStore();
  const currentLanguage = LANGUAGE_CONFIG[language];
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropDownRef.current && !dropDownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [])

  const handleLanguageSelect = (languageId: string) => {
    if (!hasAccess && languageId !== "javascript") return;

    setLanguage(languageId);
    setIsOpen(false);
  }


  if (!isMounted)
    return null;

  return (
    <div className='relative' ref={dropDownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className=' border border-amber-900 bg-amber-900/20 hover:bg-amber-900 transition-colors duration-300 rounded-md text-sm px-2 py-1 w-44 font-[Roboto] text-amber-100 flex gap-4 items-center'
      >
        <Image src={`/icons${currentLanguage?.logoPath}`} alt='Programming language logo' width={20} height={16} />
        <p>{currentLanguage?.label}</p>
        <ChevronDown size={16} className={`${isOpen && "rotate-180"} transition duration-300 ml-auto`} />
        {/* <div className={`size-3 rounded-full border ml-auto`} style={{ backgroundColor: curren?.color }} /> */}
      </motion.button>

      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9, x: "50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.9, x: "50%" }}
            transition={{ duration: 0.2 }}
            className='absolute border h-48 overflow-y-auto border-amber-900 bg-amber-950 flex w-44 overflow-hidden flex-col top-10 right-1/2 translate-x-1/2 rounded-lg'
          >
            <p className='bg-[#200f08] px-4 py-2 text-amber-600 text-xs'>Select a Language</p>

            {Object.values(LANGUAGE_CONFIG).map((item, index) => {
              const isLocked = !hasAccess && item.id !== "javascript";
              return <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => handleLanguageSelect(item.id)}
                className={`px-4 rounded-md py-1 text-sm flex gap-4 items-center text-amber-200 hover:bg-amber-900 transition-colors duration-200 && "pb-2"} ${currentLanguage?.id === item.id && "bg-amber-900/40 border border-amber-600 text-amber-600"} ${isLocked ? "cursor-not-allowed text-gray-300" : "cursor-pointer"}`}
              >
                <Image className={`p-[2px] rounded-md ${currentLanguage.id === item.id && "bg-amber-500/40"} ${isLocked && "saturate-0"}`} src={`/icons${item.logoPath}`} alt='Programming language logo' width={20} height={16} />
                <p>{item.label}</p>
                {isLocked
                  ? <LockIcon className='ml-auto' size={14} />
                  : <Sparkles className='ml-auto' size={14} />}
              </motion.div>
            })}
          </motion.div>}
      </AnimatePresence>

    </div>
  )
}

export default LanguageSelector