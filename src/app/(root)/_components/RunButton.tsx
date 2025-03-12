'use client';
import {  Loader2, Play } from 'lucide-react'
import { motion } from 'framer-motion'
import React from 'react'
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore';
import { useUser } from '@clerk/nextjs';
import { useMutation } from 'convex/react';
import { api } from '../../../../convex/_generated/api';

const RunButton = () => {
    const { user } = useUser();
    const saveExecution = useMutation(api.codeExecutions.saveExecution);
    const { language, isRunning, executionResult, runCode } = useCodeEditorStore();

    const handleRunCode = async () => {
        await runCode();

        if (user && executionResult) {
            //save data in database
            saveExecution({
                code: executionResult.code,
                language,
                output: executionResult.output || undefined,
                error: executionResult.error || undefined
            })
        }
    }
    return (
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={isRunning} onClick={handleRunCode} className='border px-2 py-1 bg-[#2369ff] rounded-md border-[#3686ff] flex gap-1 items-center hover:bg-[#437fda] transition duration-200 text-sm font-[Roboto]'>{isRunning ? <Loader2 size={16} className='animate-spin' /> : <Play size={16} />}{isRunning ? "Running" : "RunCode"}</motion.button>
    )
}

export default RunButton