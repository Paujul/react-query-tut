# 🚀 React Query Posts Explorer (Vibe Coded 🗿)

> A modern, production-ready React application showcasing best practices for data fetching with TanStack Query (React Query) and JSONPlaceholder API.

[![React](https://img.shields.io/badge/React-18+-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5+-blue.svg)](https://www.typescriptlang.org/)
[![TanStack Query](https://img.shields.io/badge/TanStack_Query-5+-red.svg)](https://tanstack.com/query/latest)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-green.svg)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5+-purple.svg)](https://vitejs.dev/)

![Demo Screenshot](![image](https://github.com/user-attachments/assets/ee70345e-246f-42a1-b7fb-4cfb016d5d2e))

## ✨ Features

### 🎨 **Beautiful UI/UX**

- 🌟 Modern, responsive design with Tailwind CSS
- 🎪 Smooth animations and hover effects
- 📱 Mobile-first responsive layout
- 🎯 Intuitive user interface with Lucide icons

### 🔍 **Smart Data Management**

- ⚡ Lightning-fast data fetching with TanStack Query
- 🧠 Intelligent caching and background updates
- 🔄 Automatic retry logic and error handling
- 📊 Real-time search and filtering

### 🎛️ **Interactive Features**

- 🔍 **Live Search** - Filter posts in real-time
- 📊 **View Toggle** - Switch between grid and list layouts
- 🎪 **Smart Post Details**:
  - **Grid View**: Elegant modal overlay
  - **List View**: Inline expansion above selected post
- ⌨️ **Keyboard Accessible** - ESC to close, click outside to dismiss
- 🔄 **Toggle Selection** - Click same post to close details

### 🏗️ **Production-Ready Architecture**

- 📁 Organized file structure and separation of concerns
- 🎯 Custom hooks for reusable query logic
- 🔑 Centralized query key management
- 🛡️ Full TypeScript support with strict typing
- 🧪 Scalable patterns for enterprise applications

## 🛠️ Tech Stack

- **⚛️ React 18** - UI library with hooks
- **📘 TypeScript** - Type-safe development
- **⚡ Vite** - Fast build tool and dev server
- **🔄 TanStack Query v5** - Powerful data synchronization
- **🎨 Tailwind CSS** - Utility-first CSS framework
- **🎯 Lucide React** - Beautiful, customizable icons
- **🌐 JSONPlaceholder** - Fake REST API for testing

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Basic knowledge of React and TypeScript

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/Paujul/react-query-tut.git
   cd react-query-tut
   ```

2. **Install dependencies**

   ```bash
   yarn install
   ```

3. **Start the development server**

   ```bash
   yarn dev
   ```

4. **Open your browser**
   ```
   http://localhost:5173
   ```

## 📁 Project Structure

```
src/
├── components/              # React components
│   ├── PostsList.tsx       # Main posts listing with search & filters
│   ├── PostCard.tsx        # Individual post card component
│   └── LoadingSpinner.tsx  # Reusable loading indicator
├── hooks/                  # Custom React hooks
│   ├── queries/            # TanStack Query hooks
│   │   ├── queryKeys.ts    # Centralized query key management
│   │   ├── usePosts.ts     # Posts-related query hooks
│   │   └── index.ts        # Barrel exports
│   └── index.ts            # Main hooks export
├── services/               # API layer
│   ├── api.ts             # API functions and error handling
│   └── types.ts           # TypeScript type definitions
├── utils/                 # Utility functions
│   └── queryClient.ts     # TanStack Query client configuration
├── App.tsx                # Main application component
└── main.tsx              # Application entry point
```

## 🧠 Key Concepts & Patterns

### 🔑 **Centralized Query Keys**

```typescript
export const queryKeys = {
  posts: {
    all: ['posts'] as const,
    lists: () => [...queryKeys.posts.all, 'list'] as const,
    detail: (id: number) => [...queryKeys.posts.details(), id] as const,
    comments: (postId: number) =>
      [...queryKeys.posts.detail(postId), 'comments'] as const,
  },
}
```

**Benefits:**

- 🎯 Consistent cache keys across the application
- 🔄 Hierarchical invalidation (invalidate all posts vs specific post)
- 🛡️ Type-safe with autocomplete support
- 🔧 Easy refactoring and maintenance

### 🎣 **Custom Query Hooks**

```typescript
export function usePosts() {
  return useQuery({
    queryKey: queryKeys.posts.lists(),
    queryFn: postsAPI.getPosts,
  })
}

export function usePost(id: number) {
  return useQuery({
    queryKey: queryKeys.posts.detail(id),
    queryFn: () => postsAPI.getPost(id),
    enabled: !!id, // Only fetch when ID exists
  })
}
```

**Benefits:**

- ♻️ Reusable query logic
- 🧪 Easy to test and mock
- 🎯 Encapsulated error handling
- 📦 Cleaner components

### 🌐 **API Service Layer**

```typescript
// Generic fetch with error handling
async function fetchFromAPI<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }
  return response.json()
}

export const postsAPI = {
  getPosts: (): Promise<Post[]> => fetchFromAPI('/posts'),
  getPost: (id: number): Promise<Post> => fetchFromAPI(`/posts/${id}`),
}
```

**Benefits:**

- 🛡️ Centralized error handling
- 🔄 Consistent API interface
- 🧪 Easy to mock for testing
- 🔧 Single place for API changes

## 🎯 Usage Examples

### Basic Post Fetching

```typescript
function MyComponent() {
  const { data: posts, isLoading, error } = usePosts()

  if (isLoading) return <LoadingSpinner />
  if (error) return <div>Error: {error.message}</div>

  return (
    <div>
      {posts?.map(post => (
        <div key={post.id}>{post.title}</div>
      ))}
    </div>
  )
}
```

### Single Post with Details

```typescript
function PostDetail({ postId }: { postId: number }) {
  const { data: post, isLoading } = usePost(postId)

  if (isLoading) return <LoadingSpinner />

  return (
    <article>
      <h1>{post?.title}</h1>
      <p>{post?.body}</p>
    </article>
  )
}
```

### Cache Invalidation

```typescript
const createPost = useMutation({
  mutationFn: postsAPI.createPost,
  onSuccess: () => {
    // Surgical cache invalidation
    queryClient.invalidateQueries({
      queryKey: queryKeys.posts.lists(),
    })
  },
})
```

## 🎮 Demo Features

Try these features in the live demo:

1. **🔍 Search Posts**: Type in the search bar to filter posts instantly
2. **📊 Toggle Views**: Switch between grid and list layouts
3. **🎪 Post Details**:
   - Grid view: Click for modal overlay
   - List view: Click for inline expansion
4. **⌨️ Keyboard Navigation**: Use ESC to close modals
5. **🔄 Error Handling**: Disconnect your internet to see error states
6. **⚡ Caching**: Click the same post twice to see instant loading

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Development Workflow

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📚 Learning Resources

- [TanStack Query Documentation](https://tanstack.com/query/latest/docs/framework/react/overview)
- [React TypeScript Best Practices](https://react-typescript-cheatsheet.netlify.app/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [JSONPlaceholder API](https://jsonplaceholder.typicode.com/)

## 🎯 What You'll Learn

This project demonstrates:

- ✅ **TanStack Query Patterns** - Custom hooks, query keys, caching strategies
- ✅ **TypeScript Best Practices** - Strict typing, interfaces, generic functions
- ✅ **React Architecture** - Component composition, custom hooks, state management
- ✅ **Modern UI Development** - Responsive design, animations, accessibility
- ✅ **Production Patterns** - Error boundaries, loading states, code organization

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [TanStack Query](https://tanstack.com/query) - For the amazing data synchronization library
- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) - For the free REST API
- [Tailwind CSS](https://tailwindcss.com/) - For the utility-first CSS framework
- [Lucide](https://lucide.dev/) - For the beautiful icons
- [Vite](https://vitejs.dev/) - For the lightning-fast build tool

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

[🐛 Report Bug](https://github.com/paujul/react-query-tut/issues) · [✨ Request Feature](https://github.com/paujul/react-query-tut/issues)

Made with Claude Sonnet 4

</div>
