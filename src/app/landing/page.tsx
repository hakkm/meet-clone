'use client'
import React, {useState, useRef} from 'react'

import { VideoIcon, KeyboardIcon } from '@radix-ui/react-icons'
import { Button} from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
const Landing = () => {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState('');
  return (
    <section className='flex justify-around pt-44  '>
      <div className='w-1/2 '>
        <h2 className='flex  font-medium text-5xl text-black '>
          Video calls and video conferencing for everyone
        </h2>
        <p className='text-gray-500 w-5/6 mt-4'>
          Comunicate, collaborate, and celebrate moments wherever you are with meet clone
        </p>
        <div className='mt-10 flex justify-between gap-8'>
          <Button className='bg-cyan-700 p-6 w-48'>
            <VideoIcon className='mr-4'/> New Meet
          </Button>
          <div className={`flex items-center border-2 border-gray-500 rounded-md ${focused ? 'border-blue-700' : 'border-black'} h-[3rem]`}>
            <label htmlFor="ID">
              <KeyboardIcon width={50} height={50} className={`mr-4 p-2 transition-all ${focused ? 'text-blue-500' : 'text-black'}`} />
            </label>
            <input 
            onChange={(e)=> setText(e.target.value)}
            value={text}
            id='ID' 
            type='text' 
            placeholder='type an ID or Code' 
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            
            className='p-3  border-transparent  shadow-none h-full focus:border-transparent focus:ring-0 text-1xl outline-none' />
          </div>

            <Button 
              className={`${text? 'bg-blue-500 text-white': 'bg-transparent text-black'} transition-all p-6 w-40 h-[3rem] `} 
              disabled={!text}>
              Share
            </Button>
        </div>
        <hr  className='mt-[4rem]'/>
      </div>

      <div className='flex flex-col justify-center ml-[-3rem] items-center'>
        <Image 
          src='/assets/images/meet-one.gif' 
          alt='meet_clone'
          width={300}
          height={300}
        />
      </div>
    </section>
  )
}

export default Landing