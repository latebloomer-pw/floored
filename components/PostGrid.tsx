import { useState, useEffect } from 'react'
import PostCard from './PostCard'
import { Post } from '../types'

interface PostGridProps {
  setSelectedPost: (post: Post) => void
}

export default function PostGrid({ setSelectedPost }: PostGridProps) {
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    // Mock data generation (replace with actual API call in production)
    const mockPosts: Post[] = Array(20).fill(null).map((_, index) => ({
      id: index + 1,
      you: "were facing the front left speakers. we danced next to each other from like 3-6am. you were wearing a marine serre mesh shirt. blue eyes i think",
      me: "cutoff sleeveless shirt, big baggy cargo pants. bleached blonde hair.",
      where: "Nowies",
      when: "last night",
      createdAt: new Date(Date.now() - index * 86400000)
    })).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())

    setPosts(mockPosts)
  }, [])

  return (
    <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map(post => (
        <PostCard key={post.id} post={post} setSelectedPost={setSelectedPost} />
      ))}
    </div>
  )
}