import Credentials from '@/components/auth/Credentials'
import MagicLink from '@/components/auth/MagicLink'
import { Socials } from '@/components/auth/socials'
import LoginForm from '@/components/LoginForm'
import React from 'react'

export default function LoginPage() {
  return (
    <LoginForm>
      {/* <MagicLink /> */}
      <Credentials />
      <Socials />
    </LoginForm>
  )
}

