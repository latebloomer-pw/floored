import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface AuthModalProps {
  showModal: boolean
  setShowModal: (show: boolean) => void
  isLoggedIn: boolean
  phoneDigits: string[]
  setPhoneDigits: (digits: string[]) => void
  verificationId: string
  verificationCode: string
  setVerificationCode: (code: string) => void
  handleVerifyCode: () => void
  error: string
}

export default function AuthModal({
  showModal,
  setShowModal,
  isLoggedIn,
  phoneDigits,
  setPhoneDigits,
  verificationId,
  verificationCode,
  setVerificationCode,
  handleVerifyCode,
  error
}: AuthModalProps) {
  const handleDigitChange = (index: number, value: string) => {
    if (value.length > 1) return
    const newDigits = [...phoneDigits]
    newDigits[index] = value
    setPhoneDigits(newDigits)

    if (value !== '' && index < 9) {
      document.getElementById(`digit-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && phoneDigits[index] === '' && index > 0) {
      document.getElementById(`digit-${index - 1}`)?.focus()
    }
  }

  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="bg-white p-6 max-w-md w-full border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <button onClick={() => setShowModal(false)} className="float-right text-[#FF3333]">
              <X size={24} />
            </button>
            {isLoggedIn ? (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#FF3333]">Your Profile</h2>
                <p>Welcome back! This is where your profile information would go.</p>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#FF3333]">Can we have your number?</h2>
                <div className="flex justify-center space-x-2 mb-4">
                  {phoneDigits.map((digit, index) => (
                    <input
                      key={index}
                      id={`digit-${index}`}
                      type="text"
                      inputMode="numeric"
                      pattern="\d*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleDigitChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-8 h-12 text-center text-2xl text-[#FF3333] bg-transparent border-b border-[#FF3333] focus:outline-none focus:border-[#FF3333] ink-bleed-input"
                      style={{ boxShadow: 'none' }}
                    />
                  ))}
                </div>
                {verificationId && (
                  <div className="mb-4">
                    <p className="text-[#FF3333] mb-2">Enter verification code:</p>
                    <input
                      type="text"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                      className="w-full p-2 text-[#FF3333] border border-[#FF3333]"
                    />
                    <button onClick={handleVerifyCode} className="mt-2 w-full bg-[#FF3333] text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                      Verify
                    </button>
                  </div>
                )}
                {error && <p className="text-red-500">{error}</p>}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}