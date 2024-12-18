import { currentUser } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import Link from 'next/link';
import { CodeXml, Play, Sparkles } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import UserProfile from './UserProfile';
import { SignedIn } from '@clerk/nextjs';

const Header = async () => {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await currentUser();

    const convexUser = await convex.query(api.users.getUser, { userId: user?.id || "" });
    console.log(convexUser);

    return (
        <div className='w-full bg-[#2c180f] rounded-t-lg px-3 py-2 h-20 flex items-center justify-between'>
            <div className='flex gap-5 items-center'>
                <h1 className='text-2xl'>LightCode</h1>
                <Link href="/snippets" className='py-1 px-3 rounded-md text-sm bg-[#441f16] hover:bg-amber-950 transition-all duration-300 flex items-center gap-2 text-amber-200'><CodeXml size={15} />Snippets</Link>
            </div>
            <div className='flex items-center gap-3'>
                <ThemeSelector />
                <LanguageSelector />
                <Link href="/pricing" className='border flex gap-1 items-center border-green-500 text-green-500 px-3 rounded-md bg-[#47db6031] hover:bg-[#319731b9] text-[Roboto] transition duration-200'><Sparkles size={14} />Pro</Link>
                <SignedIn>
                    <button className='border px-2 py-1 bg-[#2369ff] rounded-md border-[#3686ff] flex gap-1 items-center hover:bg-[#5f9fff] transition duration-200'><Play size={16} />RunCode</button>
                </SignedIn>
                <UserProfile />
            </div>
        </div >
    )
}

export default Header