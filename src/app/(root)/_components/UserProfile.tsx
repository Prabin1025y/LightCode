'use client'
import { SignedOut, SignInButton, UserButton } from '@clerk/nextjs'
import { ArrowRight, Users } from 'lucide-react'
import React from 'react'

const UserProfile = () => {
  return (
    <div className='flex'>
      <div className='w-[1px] bg-amber-500/20 h-6 mx-2' />
      <UserButton>
        <UserButton.MenuItems>
          <UserButton.Link label='Profile' labelIcon={<Users size={15} />} href='/profile' />
        </UserButton.MenuItems>
      </UserButton>

      <SignedOut>
        <SignInButton>
          <div className='border rounded-full border-amber-500 bg-gradient-to-r from-amber-500 to bg-amber-700 px-2 py-1 flex items-center gap-1 cursor-pointer hover:bg-amber-500 transition duration-200'>Sign In <ArrowRight size={20} /></div>
        </SignInButton>
      </SignedOut>
    </div>
  )
}

export default UserProfile