import type { Post, User, Comment } from './types'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

// Generic fetch function with error handling
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  return response.json()
}

// API functions
export const postsAPI = {
  getPosts: (): Promise<Post[]> => fetchFromAPI('/posts'),
  getPost: (id: number): Promise<Post> => fetchFromAPI(`/posts/${id}`),
  getPostComments: (postId: number): Promise<Comment[]> =>
    fetchFromAPI(`/posts/${postId}/comments`),
}

export const usersAPI = {
  getUsers: (): Promise<User[]> => fetchFromAPI('/users'),
  getUser: (id: number): Promise<User> => fetchFromAPI(`/users/${id}`),
}
