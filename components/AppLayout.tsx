'use client'

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useScroll } from 'framer-motion'
import { auth } from '../lib/firebase'
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'
import Header from './Header'
import Footer from './Footer'
import PostGrid from './PostGrid'
import AuthModal from './AuthModal'
import PostDetailModal from './PostDetailModal'
import { Post } from '../types'
import Image from 'next/image'

export default function AppLayout() {
  const [phoneDigits, setPhoneDigits] = useState(Array(10).fill(''))
  const [verificationCode, setVerificationCode] = useState('')
  const [verificationId, setVerificationId] = useState('')
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [introAnimationComplete, setIntroAnimationComplete] = useState(false)

  const scrollRef = useRef(null)
  const { scrollY } = useScroll({ target: scrollRef })

  useEffect(() => {
    if (phoneDigits.every(digit => digit !== '')) {
      handleSendCode()
    }
  }, [phoneDigits])

  useEffect(() => {
    const timer = setTimeout(() => {
      setIntroAnimationComplete(true)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
        }
      })
    }
  }

  const handleSendCode = async () => {
    setError('')
    setupRecaptcha()
    try {
      const phoneNumber = `+1${phoneDigits.join('')}` // Assuming US numbers, adjust as needed
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier)
      setVerificationId(confirmation.verificationId)
    } catch (err) {
      setError('Error sending verification code. Please try again.')
      console.error('Error sending verification code:', err)
    }
  }

  const handleVerifyCode = async () => {
    setError('')
    try {
      await confirmation.confirm(verificationCode)
      setIsLoggedIn(true)
      setShowModal(false)
    } catch (err) {
      setError('Invalid verification code. Please try again.')
      console.error('Error verifying code:', err)
    }
  }

  return (
    <div className="relative min-h-screen bg-[#FF3333] overflow-hidden font-mono" ref={scrollRef}>
      {/* Intro Animation */}
      <AnimatePresence>
        {!introAnimationComplete && (
          <motion.div
            className="fixed inset-0 bg-[#FF3333] z-50 flex items-center justify-center"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              initial={{ scale: 5 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            >
              <Image
                src="/logo.png"
                alt="Floored Logo"
                width={200}
                height={200}
                className="object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Header scrollY={scrollY} setShowModal={setShowModal} />

      <main className="relative z-10 flex flex-col items-center justify-start min-h-screen p-4 pt-32 pb-20">
        <PostGrid setSelectedPost={setSelectedPost} />
      </main>

      <div id="recaptcha-container"></div>

      <Footer />

      <AuthModal
        showModal={showModal}
        setShowModal={setShowModal}
        isLoggedIn={isLoggedIn}
        phoneDigits={phoneDigits}
        setPhoneDigits={setPhoneDigits}
        verificationId={verificationId}
        verificationCode={verificationCode}
        setVerificationCode={setVerificationCode}
        handleVerifyCode={handleVerifyCode}
        error={error}
      />

      <PostDetailModal
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        isLoggedIn={isLoggedIn}
      />
    </div>
  )
}