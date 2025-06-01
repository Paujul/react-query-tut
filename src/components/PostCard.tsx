import type { Post } from '../services/types'

interface PostCardProps {
  post: Post
  onClick?: (post: Post) => void
  isSelected?: boolean
}

export function PostCard({ post, onClick }: PostCardProps) {
  return (
    <div
      className="cursor-pointer rounded-lg border p-4 transition-shadow hover:shadow-md"
      onClick={() => onClick?.(post)}
    >
      <h3 className="mb-2 text-lg font-semibold capitalize">{post.title}</h3>
      <p className="line-clamp-3 text-gray-600">{post.body}</p>
      <div className="mt-2 text-sm text-gray-500">
        User ID: {post.userId} | Post ID: {post.id}
      </div>
    </div>
  )
}
