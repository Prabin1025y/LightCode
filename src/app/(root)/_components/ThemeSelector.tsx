'use client';
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore';
import React, { useEffect, useRef, useState } from 'react'
import { THEMES } from '../_constants';

const ThemeSelector = () => {
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


  return (
    <div>ThemeSelector</div>
  )
}

export default ThemeSelector