import { lazy, Suspense, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LockKeyhole } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';

const Login = lazy(() => import('./pages/Login'));
const CoordinatorDashboard = lazy(() => import('./pages/CoordinatorDashboard'));
const SuperAdminDashboard = lazy(() => import('./pages/SuperAdminDashboard'));
const LeaderDashboard = lazy(() => import('./pages/LeaderDashboard'));

const LeaderAccess = () => {
  const { user, loading, loginWithClientPasscode } = useAuth();
  const [passcode, setPasscode] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async event => {
    event.preventDefault();
    if (submitting) return;
    setError('');
    setSubmitting(true);
    try {
      await loginWithClientPasscode(passcode);
    } catch (requestError) {
      setError(requestError.response?.data?.error || 'Unable to verify the passcode.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading...</div>;
  if (user && ['party_leader', 'client_viewer'].includes(user.role)) return <LeaderDashboard />;
  if (user) return <Navigate to="/" replace />;

  return <main className="flex min-h-screen items-center justify-center bg-[#f3f7f5] p-4">
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-xl border border-[#dce8e2] bg-white p-6 shadow-sm">
      <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-[#eef6f2] text-[#1d6b5d]"><LockKeyhole size={20} /></div>
      <h1 className="text-xl font-bold text-[#173b35]">Leader dashboard access</h1>
      <p className="mt-1 text-sm text-[#64736f]">Enter your client passcode to continue.</p>
      <label htmlFor="client-passcode" className="mt-5 block text-xs font-semibold text-[#52736a]">Passcode</label>
      <input id="client-passcode" type="password" autoComplete="one-time-code" required value={passcode} onChange={event => setPasscode(event.target.value)} className="mt-1 w-full rounded-md border border-[#b5c9c1] px-3 py-2.5 text-sm text-[#173b35] focus:border-[#1d6b5d] focus:outline-none focus:ring-2 focus:ring-[#1d6b5d]/20" />
      {error && <p className="mt-3 text-sm text-red-700" role="alert">{error}</p>}
      <button type="submit" disabled={submitting} className="mt-5 w-full rounded-md bg-[#173b35] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#28584e] disabled:cursor-not-allowed disabled:opacity-60">{submitting ? 'Verifying...' : 'Continue'}</button>
    </form>
  </main>;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  
  return children;
};

const NotFound = () => <div className="flex min-h-screen items-center justify-center p-6 text-center"><div><h1 className="text-3xl font-bold text-slate-900">Page not found</h1><p className="mt-2 text-sm text-slate-500">The requested page does not exist.</p><a className="mt-5 inline-block text-sm font-semibold text-teal-700" href="/">Return to workspace</a></div></div>;

const DefaultRedirect = () => {
  const { user, loading } = useAuth();
  
  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === 'super_admin') return <Navigate to="/admin/analytics" replace />;
  if (user.role === 'party_leader') return <Navigate to="/leader" replace />;
  if (user.role === 'client_viewer') return <Navigate to="/leader" replace />;
  if (user.role === 'constituency_coordinator') return <Navigate to="/coordinator" replace />;
  
  return <Navigate to="/login" replace />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading workspace...</div>}>
          <Routes>
            <Route path="/" element={<DefaultRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<Navigate to="/admin/analytics" replace />} />
            <Route
              path="/coordinator/*"
              element={
                <ProtectedRoute allowedRoles={['constituency_coordinator']}>
                  <CoordinatorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/*"
              element={
                <ProtectedRoute allowedRoles={['super_admin']}>
                  <SuperAdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leader/*"
              element={<LeaderAccess />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
