export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  class: string;
  board: string;
  streak: number;
  totalStudyTime: number;
  lastActive: string;
}

export interface Chapter {
  id: string;
  subject: string;
  title: string;
  summary: string;
  keyPoints: string[];
  importantQuestions: string[];
}

export interface Progress {
  userId: string;
  chapterId: string;
  status: 'not-started' | 'in-progress' | 'completed';
  lastStudied: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export interface QuizResult {
  userId: string;
  chapterId: string;
  score: number;
  totalQuestions: number;
  accuracy: number;
  timestamp: string;
}

export interface Doubt {
  id?: string;
  userId: string;
  question: string;
  imageUrl?: string;
  answer: string;
  timestamp: string;
}
