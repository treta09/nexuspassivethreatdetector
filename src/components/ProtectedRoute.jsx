import { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';

const DefaultFallback = () => (
  <div className="fixed inset-0 flex items-center justify-center">
    <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-800 rounded-full animate-spin"></div>
  </div>
);

const AdminOnlyNotice = () => (
  <div className="fixed inset-0 flex items-center justify-center bg-[#090B0E] p-6">
    <div className="max-w-md text-center">
      <div className="font-mono text-[12px] tracking-[0.1em] text-[#FF3B5C] uppercase mb-2">Access Denied</div>
      <div className="font-mono text-[11px] text-[#627290] leading-relaxed">
        This threat monitor is restricted to administrators. Your account does not have admin access.
      </div>
    </div>
  </div>
);

export default function ProtectedRoute({ fallback = <DefaultFallback />, unauthenticatedElement }) {
  const { isAuthenticated, isLoadingAuth, authChecked, authError, user, checkUserAuth } = useAuth();

  useEffect(() => {
    if (!authChecked && !isLoadingAuth) {
      checkUserAuth();
    }
  }, [authChecked, isLoadingAuth, checkUserAuth]);

  if (isLoadingAuth || !authChecked) {
    return fallback;
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    }
    return unauthenticatedElement;
  }

  if (!isAuthenticated) {
    return unauthenticatedElement;
  }

  if (!user || user.role !== 'admin') {
    return <AdminOnlyNotice />;
  }

  return <Outlet />;
}