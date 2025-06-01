/**
 * Centralized query key definitions for React Query.
 *
 * Why use this pattern?
 * - Consistency: All query keys are defined in one place, reducing typos and duplication.
 * - Type safety: Using `as const` ensures keys are strongly typed.
 * - Scalability: Easy to add new keys or change structure as your app grows.
 *
 * How to read the spread operators:
 * - Each function builds on the previous key, adding more specificity.
 *   For example, `detail(id)` is based on `details()`, which is based on `all`.
 * - This creates a nested key structure, which helps React Query cache and invalidate data at different levels (all posts, a list, a single post, etc).
 *
 * Example usage:
 *   - All posts:           queryKeys.posts.all         // ['posts']
 *   - Posts list:          queryKeys.posts.lists()     // ['posts', 'list']
 *   - Filtered posts list: queryKeys.posts.list({userId: 1}) // ['posts', 'list', { filters: { userId: 1 } }]
 *   - Post details:        queryKeys.posts.detail(5)   // ['posts', 'detail', 5]
 *   - Post comments:       queryKeys.posts.comments(5) // ['posts', 'detail', 5, 'comments']
 */

export const queryKeys = {
  posts: {
    /**
     * Base key for all posts-related queries.
     * Example: ['posts']
     */
    all: ['posts'] as const,

    /**
     * Key for lists of posts (unfiltered).
     * Example: ['posts', 'list']
     */
    lists: () => [...queryKeys.posts.all, 'list'] as const,

    /**
     * Key for a filtered list of posts.
     * Example: ['posts', 'list', { filters: { userId: 1 } }]
     */
    list: (filters: Record<string, unknown>) =>
      [...queryKeys.posts.lists(), { filters }] as const,

    /**
     * Key for post details (unfiltered).
     * Example: ['posts', 'detail']
     */
    details: () => [...queryKeys.posts.all, 'detail'] as const,

    /**
     * Key for a specific post's details.
     * Example: ['posts', 'detail', 5]
     */
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,

    /**
     * Key for comments on a specific post.
     * Example: ['posts', 'detail', 5, 'comments']
     */
    comments: (postId: number) =>
      [...queryKeys.posts.detail(postId), 'comments'] as const,
  },

  users: {
    /**
     * Base key for all users-related queries.
     * Example: ['users']
     */
    all: ['users'] as const,

    /**
     * Key for lists of users.
     * Example: ['users', 'list']
     */
    lists: () => [...queryKeys.users.all, 'list'] as const,

    /**
     * Key for user details (unfiltered).
     * Example: ['users', 'detail']
     */
    details: () => [...queryKeys.users.all, 'detail'] as const,

    /**
     * Key for a specific user's details.
     * Example: ['users', 'detail', 2]
     */
    detail: (id: number) => [...queryKeys.users.details(), id] as const,
  },
} as const
