import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, BookOpen, MessageSquare, Timer, BarChart3, User } from 'lucide-react';
import { cn } from '../lib/utils';
import { UserProfile } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  profile: UserProfile | null;
}

export default function Layout({ children, profile }: LayoutProps) {
  const location = useLocation();

  const navItems = [
    { icon: Home, label: 'Home', path: '/' },
    { icon: BookOpen, label: 'More', path: '/study' },
    { icon: MessageSquare, label: 'Share', path: '/ai' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <div>
            <h1 className="font-bold text-slate-900 leading-none">NCERT AI HUB</h1>
            <p className="text-xs text-slate-500 mt-1">Class {profile?.class} • {profile?.board}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-sm font-bold border border-orange-100">
            🔥 {profile?.streak || 0}
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full overflow-hidden border-2 border-white shadow-sm">
            <User className="w-full h-full p-2 text-slate-400" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-md mx-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center z-20 shadow-[0_-4px_10px_rgba(0,0,0,0.03)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path}
              to={item.path}
              className={cn(
                "flex flex-col items-center gap-1 transition-all duration-200",
                isActive ? "text-blue-600 scale-110" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <item.icon className={cn("w-6 h-6", isActive && "fill-blue-50")} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
