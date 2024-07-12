import { auth } from '@/auth'
import React from 'react'

export default async function SettingsPage() {
  const session = await auth()
  console.log("settings.ts session: ", session);
  return (
    <div>
      <h1>Settings Page</h1>
      <p>Settings Page</p>
    </div>
  )
}

