import UserProfile from '@/app/(root)/_components/UserProfile'
import { SignedIn } from '@clerk/nextjs'
import { SquareDashedBottomCode } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const NavBar = () => {
    return (
        <div className='fixed top-0 left-0 right-0 bg-[#2c180f]  px-3 py-2 h-20 flex items-center justify-between'>
            <div className='flex gap-5 items-center'>
                <h1 className='text-2xl'>LightCode</h1>
                <Link href="/" className='py-1 px-3 rounded-md text-sm bg-[#441f16] hover:bg-amber-950 transition-all duration-300 flex items-center gap-2 text-amber-200'><SquareDashedBottomCode size={15} />Code Editor</Link>
            </div>
            <SignedIn>
                <UserProfile />
            </SignedIn>
        </div >
    )
}

export default NavBar