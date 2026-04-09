import React, { useState, useEffect } from 'react';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useNavigate 
} from 'react-router-dom';
import { 
  onAuthStateChanged, 
  auth, 
  db, 
  doc, 
  getDoc, 
  setDoc, 
  signInWithPopup, 
  googleProvider,
  FirebaseUser,
  handleFirestoreError,
  OperationType
} from './firebase';
import { UserProfile } from './types';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import Study from './components/Study';
import DoubtSolver from './components/DoubtSolver';
import Quiz from './components/Quiz';
import Timer from './components/Timer';
import Notes from './components/Notes';
import Tasks from './components/Tasks';
import { Loader2 } from 'lucide-react';

import { ErrorBoundary } from 'react-error-boundary';
import ErrorDisplay from './components/ErrorDisplay';

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const newProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName || 'Student',
              email: firebaseUser.email || '',
              class: '10',
              board: 'CBSE',
              streak: 0,
              totalStudyTime: 0,
              lastActive: new Date().toISOString()
            };
            await setDoc(doc(db, 'users', firebaseUser.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          handleFirestoreError(error, OperationType.GET, `users/${firebaseUser.uid}`);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorDisplay}>
      <Router>
        {!user ? (
          <LoginScreen />
        ) : (
          <Layout profile={profile}>
            <Routes>
              <Route path="/" element={<Dashboard profile={profile} />} />
              <Route path="/study" element={<Study profile={profile} />} />
              <Route path="/ai" element={<DoubtSolver profile={profile} />} />
              <Route path="/quiz/:chapterId" element={<Quiz profile={profile} />} />
              <Route path="/timer" element={<Timer profile={profile} />} />
              <Route path="/notes" element={<Notes profile={profile} />} />
              <Route path="/tasks" element={<Tasks profile={profile} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </Layout>
        )}
      </Router>
    </ErrorBoundary>
  );
}

function LoginScreen() {
  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Login failed', error);
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-slate-900">
      <div className="w-32 h-32 mb-8">
        <img 
          src="https://picsum.photos/seed/ncert-logo/400/400" 
          alt="NCERT AI HUB Logo" 
          className="w-full h-full object-contain"
          referrerPolicy="no-referrer"
        />
      </div>
      
      <div className="text-center space-y-2 mb-12">
        <h1 className="text-4xl font-black tracking-tighter text-slate-900">
          NCERT <span className="text-blue-600">AI</span> HUB
        </h1>
        <p className="text-slate-500 font-medium">
          AI Guru for CBSE & Bihar Board
        </p>
      </div>
      
      <button 
        onClick={handleLogin}
        className="w-full max-w-xs bg-white border-2 border-slate-100 text-slate-700 font-bold py-4 px-6 rounded-3xl shadow-sm flex items-center justify-center gap-3 hover:bg-slate-50 transition-all active:scale-95"
      >
        <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="Google" />
        Continue with Google
      </button>
      
      <div className="mt-12 flex flex-col items-center gap-4 opacity-40">
        <div className="flex gap-4">
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
          <div className="w-8 h-8 bg-slate-100 rounded-lg" />
        </div>
        <p className="text-xs font-bold uppercase tracking-widest">
          Class 6 to 12 • NCERT Based
        </p>
      </div>
    </div>
  );
}
