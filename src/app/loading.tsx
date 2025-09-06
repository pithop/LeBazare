// src/app/loading.tsx
export default function Loading() {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-brand-dark"></div>
      </div>
    );
  }