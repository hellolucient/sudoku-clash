"use client"

import { useState } from 'react'
import { deletePlayerProfile } from '@/lib/player-storage'
import { useRouter } from 'next/navigation'

export default function ResetProfile() {
  const router = useRouter()
  const [isDeleted, setIsDeleted] = useState(false)

  const handleReset = () => {
    deletePlayerProfile()
    setIsDeleted(true)
    // Redirect after a short delay
    setTimeout(() => {
      router.push('/')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#8B8074] flex flex-col items-center justify-center p-4">
      <div className="bg-[#F4E6CC] p-8 rounded-xl shadow-2xl max-w-md w-full">
        <h1 className="text-2xl font-bold text-[#4A2F1F] mb-6 text-center">
          Reset Player Profile
        </h1>

        {!isDeleted ? (
          <>
            <p className="text-[#4A2F1F] mb-6 text-center">
              This will delete your current profile and all progress. You will need to create a new profile.
            </p>
            <button
              onClick={handleReset}
              className="w-full px-5 py-3 bg-[#CC4B37] text-white rounded-lg cursor-pointer text-lg hover:bg-[#BC3B27] transition-colors"
            >
              Reset Profile
            </button>
          </>
        ) : (
          <p className="text-[#4A2F1F] text-center">
            Profile deleted! Redirecting to home page...
          </p>
        )}
      </div>
    </div>
  )
} 