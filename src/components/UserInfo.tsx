'use client'

import { useUser, useIsAuthenticated, useStore } from '@/store/useStore'

export default function UserInfo() {
  const user = useUser()
  const isAuthenticated = useIsAuthenticated()
  const { logout } = useStore()

  if (!isAuthenticated || !user) {
    return (
      <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
        <div className="text-center">
          <div className="w-16 h-16 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-2xl text-muted-foreground">👤</span>
          </div>
          <h3 className="text-lg font-medium text-card-foreground mb-2">
            User not authenticated
          </h3>
          <p className="text-sm text-muted-foreground">
            Please register to see user information
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
          <span className="text-2xl">👋</span>
        </div>
        
        <h3 className="text-lg font-semibold text-card-foreground mb-2">
          Welcome!
        </h3>
        
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Name:</span>
            <span className="font-medium text-card-foreground">{user.name}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-medium text-card-foreground">{user.email}</span>
          </div>
          <div className="flex justify-between items-center py-1">
            <span className="text-muted-foreground">Age:</span>
            <span className="font-medium text-card-foreground">{user.age}</span>
          </div>
        </div>
        
        <button
          onClick={logout}
          className="mt-4 w-full px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </div>
  );
}