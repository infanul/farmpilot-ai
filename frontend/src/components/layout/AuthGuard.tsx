'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isPublicRoute = !pathname || pathname === '/' || pathname === '/login' || pathname === '/register';

  useEffect(() => {
    if (!loading && !user && !isPublicRoute) {
      router.push('/login');
    }
  }, [user, loading, pathname, isPublicRoute, router]);

  if (!loading && !user && !isPublicRoute) {
    return null;
  }

  return <>{children}</>;
};
