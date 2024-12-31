import { currentUser } from '@clerk/nextjs/server'
import { ConvexHttpClient } from 'convex/browser';
import React from 'react'
import { api } from '../../../../convex/_generated/api';
import Link from 'next/link';
import { CodeXml, Sparkles } from 'lucide-react';
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import { SignedIn } from '@clerk/nextjs';
import RunButton from './RunButton';
import UserProfile from './UserProfile';

const Header = async () => {
    const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
    const user = await currentUser();

    const convexUser = await convex.query(api.users.getUser, { userId: user?.id || "" });
    // console.log(convexUser);

    return (
        <div className='w-full bg-[#2c180f] rounded-t-lg px-3 py-2 h-20 flex items-center justify-between'>
            <div className='flex gap-5 items-center'>
                <h1 className='text-2xl'>LightCode</h1>
                <Link href="/snippets" className='py-1 px-3 rounded-md text-sm bg-[#441f16] hover:bg-amber-950 transition-all duration-300 flex items-center gap-2 text-amber-200'><CodeXml size={15} />Snippets</Link>
            </div>
            <div className='flex items-center gap-3'>
                <ThemeSelector />
                <LanguageSelector hasAccess={convexUser?.isPro || false} />
                {!convexUser?.isPro && <Link href="/pricing" className='border flex gap-1 items-center border-green-500 text-green-500 px-3 rounded-md bg-[#47db6031] hover:bg-[#319731b9] text-[Roboto] transition duration-200'><Sparkles size={14} />Pro</Link>}
                {/* <SignedIn>
                    <RunButton />
                </SignedIn> */}
                <UserProfile />
            </div>
        </div >
    )
}

export default Header