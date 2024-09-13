import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { Post } from '../types'

interface PostDetailModalProps {
  selectedPost: Post | null
  setSelectedPost: (post: Post | null) => void
  isLoggedIn: boolean
}

export default function PostDetailModal({ selectedPost, setSelectedPost, isLoggedIn }: PostDetailModalProps) {
  if (!selectedPost) return null

  return (
    <AnimatePresence>
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
          <button onClick={() => setSelectedPost(null)} className="float-right text-[#FF3333]">
            <X size={24} />
          </button>
          <div className="flex justify-between text-sm text-gray-500 mb-4">
            <span>{selectedPost.where}</span>
            <span>{selectedPost.when}</span>
          </div>
          <div className="mb-4">
            <p className="text-[#FF3333] font-bold inline">You: </p>
            <p className="inline">{selectedPost.you}</p>
          </div>
          <div className="mb-4">
            <p className="text-[#FF3333] font-bold inline">Me: </p>
            <p className="inline">{selectedPost.me}</p>
          </div>
          {isLoggedIn ? (
            <div>
              <textarea
                placeholder="Write your reply..."
                className="w-full p-2 border-2 border-black mb-2"
                rows={3}
              />
              <button className="w-full bg-[#FF3333] text-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Send Reply
              </button>
            </div>
          ) : (
            <p className="text-[#FF3333]">Log in to reply to this post.</p>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}