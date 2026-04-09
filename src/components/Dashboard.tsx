import React from 'react';
import { UserProfile } from '../types';
import { 
  CheckSquare, 
  FileText, 
  BookOpen, 
  Calendar, 
  Bell, 
  Layers, 
  Timer, 
  Sparkles, 
  Activity, 
  Trophy, 
  ClipboardList, 
  FolderOpen,
  ArrowRight,
  TrendingUp,
  Clock
} from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

interface DashboardProps {
  profile: UserProfile | null;
}

const menuItems = [
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, color: 'bg-blue-50 text-blue-600', path: '/tasks' },
  { id: 'notes', label: 'Notes', icon: FileText, color: 'bg-orange-50 text-orange-600', path: '/notes' },
  { id: 'study-plan', label: 'Study Plan Subjectwise', icon: BookOpen, color: 'bg-indigo-50 text-indigo-600', path: '/study' },
  { id: 'timetable', label: 'Timetable', icon: Calendar, color: 'bg-yellow-50 text-yellow-600', path: '/timetable' },
  { id: 'reminder', label: 'Reminder', icon: Bell, color: 'bg-red-50 text-red-600', path: '/reminder' },
  { id: 'flashcards', label: 'Flashcards', icon: Layers, color: 'bg-orange-50 text-orange-600', path: '/flashcards' },
  { id: 'pomodoro', label: 'Pomodoro Focus', icon: Timer, color: 'bg-blue-50 text-blue-600', path: '/timer' },
  { id: 'ai-revision', label: 'AI Revision Assistant', icon: Sparkles, color: 'bg-yellow-50 text-yellow-600', path: '/ai' },
  { id: 'brain-health', label: 'Brain Health', icon: Activity, color: 'bg-blue-50 text-blue-600', path: '/health' },
  { id: 'gamification', label: 'Gamification', icon: Trophy, color: 'bg-yellow-50 text-yellow-600', path: '/gamification' },
  { id: 'syllabus', label: 'Exam Syllabus', icon: ClipboardList, color: 'bg-blue-50 text-blue-600', path: '/syllabus' },
  { id: 'portfolio', label: 'Academic Portfolio', icon: FolderOpen, color: 'bg-orange-50 text-orange-600', path: '/portfolio' },
];

export default function Dashboard({ profile }: DashboardProps) {
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-8 pb-24">
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Smart Study</h1>
        <div className="flex items-center justify-center gap-2 text-slate-500">
          <span>Welcome</span>
          <span className="font-bold text-slate-900">{profile?.displayName || 'Student'}</span>
          <span>👋</span>
        </div>
      </div>

      {/* Grid Menu */}
      <div className="grid grid-cols-3 gap-4">
        {menuItems.map((item, idx) => (
          <motion.button
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            onClick={() => navigate(item.path)}
            className="flex flex-col items-center gap-3 p-4 bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all active:scale-95"
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="text-[10px] font-bold text-slate-700 text-center leading-tight">
              {item.label}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Banner */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500 text-white p-4 rounded-full flex items-center justify-between shadow-lg shadow-green-100 cursor-pointer overflow-hidden relative"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
            <TrendingUp size={18} />
          </div>
          <span className="font-bold text-sm">Part-Time Jobs – Apply Now</span>
        </div>
        <ArrowRight size={20} />
      </motion.div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Clock size={16} />
            <span className="text-xs font-bold uppercase">Study Time</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {Math.floor((profile?.totalStudyTime || 0) / 60)}h { (profile?.totalStudyTime || 0) % 60}m
          </div>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm">
          <div className="flex items-center gap-2 text-orange-600 mb-2">
            <Trophy size={16} />
            <span className="text-xs font-bold uppercase">Streak</span>
          </div>
          <div className="text-2xl font-black text-slate-900">
            {profile?.streak || 0} Days
          </div>
        </div>
      </div>
    </div>
  );
}
