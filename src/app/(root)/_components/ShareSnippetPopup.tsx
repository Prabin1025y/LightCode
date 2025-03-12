'use client';
import { useCodeEditorStore } from '@/Store/UseCodeEditorStore';
import { useMutation } from 'convex/react';
import { Loader2 } from 'lucide-react';
import React, { FormEvent, useState } from 'react'
import { api } from '../../../../convex/_generated/api';
import toast from 'react-hot-toast';

const ShareSnippetPopup = ({ onClose }: { onClose: () => void }) => {
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { getCode, language } = useCodeEditorStore();
  const saveSnippet = useMutation(api.snippets.saveSnippet);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const code = getCode();
      await saveSnippet({ language, code, title });
      onClose();
      toast.success("Snippet shared.");
    } catch (error) {
      console.log("error in sharesnippetpopup", error);
      toast.error(String(error));
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <div className='fixed inset-0 bg-black/50 animate-in fade-in-0 duration-300 grid place-items-center font-[Roboto]'>
      <div className='w-full max-w-md h-fit bg-amber-950 flex flex-col gap-3 px-8 py-4 rounded-lg border border-amber-800'>
        <h2 className='text-2xl text-amber-200'>Share Snippet</h2>
        <form onSubmit={handleSubmit}>
          <div className='flex flex-col gap-1'>
            <label htmlFor="title" className=''>Snippet Title</label>
            <input className='bg-[#24140c] border outline-none border-amber-800 px-2 rounded-md py-1' type="text" id='title' required onChange={(e) => setTitle(e.target.value)} value={title} />
          </div>
          <div className='w-full justify-end flex pt-4 gap-3'>
            <button disabled={isLoading} onClick={onClose} className='px-2 py-1 text-amber-200 border border-amber-800 rounded-md w-20 text-sm hover:bg-amber-900/50 transition duration-200 disabled:cursor-not-allowed'>Cancel</button>
            <button disabled={isLoading} className='border px-2 py-1 bg-[#2369ff] rounded-md border-[#3686ff] w-20 hover:bg-[#437fda] transition duration-200 text-sm font-[Roboto] disabled:cursor-not-allowed'>{isLoading ? <Loader2 size={16} className='animate-spin mx-auto' /> : "Share"}</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ShareSnippetPopup;