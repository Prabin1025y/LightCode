'use client';
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore';
import React, { useEffect, useRef, useState } from 'react'
import { THEMES } from '../_constants';
import { Cloud, Github, Laptop, Moon, Palette, Sun } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import UseMounted from '@/app/hooks/useMounted';

const THEME_ICONS: Record<string, React.ReactNode> = {
  "vs-dark": <Moon size={16} />,
  "vs-light": <Sun size={16} />,
  "github-dark": <Github size={16} />,
  "monokai": <Laptop size={16} />,
  "solarized-dark": <Cloud size={16} />
}

const ThemeSelector = () => {
  const isMounted = UseMounted();

  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useCodeEditorStore();
  const currentTheme = THEMES.find(item => theme === item.id);
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

  if (!isMounted)
    return null;

  return (
    <div className='relative' ref={dropDownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setIsOpen(!isOpen)}
        className=' border border-amber-900 bg-amber-900/20 hover:bg-amber-900 transition-colors duration-300 rounded-md text-sm px-2 py-1 w-48 font-[Roboto] text-amber-100 flex gap-4 items-center'
      >
        <Palette size={16} />
        <p>{currentTheme?.label}</p>
        <div className={`size-3 rounded-full border ml-auto`} style={{ backgroundColor: currentTheme?.color }} />
      </motion.button>

      <AnimatePresence>
        {isOpen &&
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9, x: "50%" }}
            animate={{ opacity: 1, y: 0, scale: 1, x: "50%" }}
            exit={{ opacity: 0, y: 8, scale: 0.9, x: "50%" }}
            transition={{ duration: 0.2 }}
            className='absolute border border-amber-900 bg-amber-950 flex w-48 overflow-hidden flex-col top-10 right-1/2 translate-x-1/2 rounded-lg'
          >
            <p className='bg-[#200f08] px-4 py-2 text-amber-600 text-xs'>Select a theme</p>

            {THEMES.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => { setTheme(item.id); setIsOpen(false) }}
                className={`px-4 rounded-md py-1 text-sm flex gap-4 items-center text-amber-200 cursor-pointer hover:bg-amber-900 transition-colors duration-200 ${index === 0 && "pt-2"} ${index === (THEMES.length - 1) && "pb-2"} ${currentTheme?.id === item.id && "bg-amber-900/40 border border-amber-600 text-amber-600"}`}
              >
                {THEME_ICONS[item.id]}
                <p>{item.label}</p>
                <div className={`size-3 rounded-full border ml-auto ${currentTheme?.id === item.id && "border-amber-600"}`} style={{ backgroundColor: item.color }} />
              </motion.div>
            ))}
          </motion.div>}
      </AnimatePresence>

    </div>
  )
}

export default ThemeSelector