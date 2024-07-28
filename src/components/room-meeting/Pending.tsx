import React from 'react'
import Loader from '../ui/shared/Loader'

const Pending = ({title, text}: {
    title: string,
    text: string
}) => {
  return (
    <div className='flex flex-col justify-center items-center'>
        <h1 className='text-black text-5xl mb-8'>
            {title}
        </h1>
        <p>
            {text}
        </p>
        <Loader/>
    </div>
  )
}

export default Pending