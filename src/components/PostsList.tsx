import { useState, useEffect } from 'react'
import {
  Search,
  Grid,
  List,
  X,
  AlertCircle,
  RefreshCw,
  User,
} from 'lucide-react'
import { usePosts, usePost } from '../hooks'
import { PostCard } from './PostCard'
import { LoadingSpinner } from './LoadingSpinner'
import type { Post } from '../services/types'

export function PostsList() {
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const {
    data: posts,
    isLoading,
    error,
    isError,
    refetch,
    isRefetching,
  } = usePosts()

  const { data: selectedPost, isLoading: isLoadingPost } = usePost(
    selectedPostId!,
    {
      enabled: !!selectedPostId,
    }
  )

  // Filter posts based on search term
  const filteredPosts =
    posts?.filter(
      (post) =>
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.body.toLowerCase().includes(searchTerm.toLowerCase())
    ) || []

  // Find selected post index for inline positioning
  const selectedPostIndex = selectedPostId
    ? filteredPosts.findIndex((post) => post.id === selectedPostId)
    : -1

  const handlePostClick = (post: Post) => {
    if (selectedPostId === post.id) {
      setSelectedPostId(null) // Close if same post clicked
    } else {
      setSelectedPostId(post.id)
    }
  }

  // Handle ESC key and body scroll for grid view modal
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedPostId && viewMode === 'grid') {
        setSelectedPostId(null)
      }
    }

    // Prevent body scroll when modal is open in grid view
    if (selectedPostId && viewMode === 'grid') {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [selectedPostId, viewMode])

  // Post Detail Component
  const PostDetail = ({ className = '' }: { className?: string }) => {
    if (!selectedPostId) return null

    return (
      <div
        className={`overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg ${className}`}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Post Details</h2>
            <button
              onClick={() => setSelectedPostId(null)}
              className="text-white transition-colors hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>
        <div className="p-6">
          {isLoadingPost ? (
            <LoadingSpinner />
          ) : selectedPost ? (
            <div>
              <h3 className="mb-4 text-2xl font-bold capitalize text-gray-900">
                {selectedPost.title}
              </h3>
              <p className="text-lg leading-relaxed text-gray-700">
                {selectedPost.body}
              </p>
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <User className="mr-1 h-4 w-4" />
                <span>Author: User {selectedPost.userId}</span>
                <span className="mx-3">•</span>
                <span>Post ID: {selectedPost.id}</span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">Loading amazing posts...</p>
        </div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="mx-auto max-w-md p-6 text-center">
          <AlertCircle className="mx-auto mb-4 h-16 w-16 text-red-500" />
          <h2 className="mb-2 text-2xl font-bold text-gray-900">
            Oops! Something went wrong
          </h2>
          <p className="mb-6 text-gray-600">
            {error instanceof Error ? error.message : 'Failed to load posts'}
          </p>
          <button
            onClick={() => refetch()}
            disabled={isRefetching}
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw
              className={`mr-2 h-4 w-4 ${isRefetching ? 'animate-spin' : ''}`}
            />
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="mb-8 text-center">
              <h1 className="mb-2 text-4xl font-bold text-gray-900">
                Discover Amazing Posts
              </h1>
              <p className="text-lg text-gray-600">
                Explore our collection of {posts?.length || 0} fascinating
                articles
              </p>
            </div>

            {/* Search and Controls */}
            <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
              {/* Search */}
              <div className="relative max-w-md flex-1">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 transform text-gray-400 hover:text-gray-600"
                  >
                    <X className="h-5 w-5" />
                  </button>
                )}
              </div>

              {/* View Toggle */}
              <div className="flex items-center space-x-2 rounded-lg bg-gray-100 p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="Grid View"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`rounded-md p-2 transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                  title="List View"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Search Results Info */}
            {searchTerm && (
              <div className="mt-4 text-sm text-gray-600">
                {filteredPosts.length === 0 ? (
                  <p>No posts found for "{searchTerm}"</p>
                ) : (
                  <p>
                    Found {filteredPosts.length} post
                    {filteredPosts.length !== 1 ? 's' : ''} for "{searchTerm}"
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Posts Grid/List */}
        {filteredPosts.length === 0 && searchTerm ? (
          <div className="py-12 text-center">
            <Search className="mx-auto mb-4 h-16 w-16 text-gray-300" />
            <h3 className="mb-2 text-xl font-semibold text-gray-900">
              No posts found
            </h3>
            <p className="text-gray-600">Try adjusting your search terms</p>
          </div>
        ) : (
          <div
            className={
              viewMode === 'grid'
                ? 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
                : 'space-y-6'
            }
          >
            {filteredPosts.map((post, index) => (
              <div key={post.id}>
                {/* Show inline post detail above selected card in list view */}
                {viewMode === 'list' && selectedPostIndex === index && (
                  <div className="mb-6">
                    <PostDetail />
                  </div>
                )}

                {/* Post Card */}
                <div className={viewMode === 'list' ? 'w-full' : ''}>
                  <PostCard
                    post={post}
                    onClick={handlePostClick}
                    isSelected={selectedPostId === post.id}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Grid View Popover */}
      {viewMode === 'grid' && selectedPostId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
          onClick={() => setSelectedPostId(null)}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <PostDetail />
          </div>
        </div>
      )}
    </div>
  )
}
