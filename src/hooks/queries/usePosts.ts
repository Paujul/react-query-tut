import { useQuery } from '@tanstack/react-query'
import type { UseQueryOptions } from '@tanstack/react-query'
import { postsAPI } from '../../services/api'
import type { Post } from '../../services/types'
import { queryKeys } from './queryKeys'

// Get all posts
export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: postsAPI.getPosts,
  })
}

// Get single post
export function usePost(
  id: number,
  options?: Omit<UseQueryOptions<Post>, 'queryKey' | 'queryFn'>
) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postsAPI.getPost(id),
    enabled: !!id, // Only run if ID exists
    ...options,
  })
}

// Get post comments
export function usePostComments(postId: number) {
  return useQuery({
    queryKey: queryKeys.posts.comments(postId),
    queryFn: () => postsAPI.getPostComments(postId),
    enabled: !!postId,
  })
}
