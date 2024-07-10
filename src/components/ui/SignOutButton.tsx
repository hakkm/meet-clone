"use client"

import { signOut } from '@/auth'
import { Button } from './button'

export default function SignOutButton() {
  return (
      <Button onClick={() => signOut()} size="sm">Sign out</Button>
  )
}

