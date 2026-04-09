import React, { useState } from 'react';
import { UserProfile, QuizQuestion } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, XCircle, ChevronRight, Award, Loader2 } from 'lucide-react';
import { generateQuiz } from '../services/geminiService';

interface QuizProps {
  profile: UserProfile | null;
}

export default function Quiz({ profile }: QuizProps) {
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);

  const startQuiz = async () => {
    setLoading(true);
    try {
      const data = await generateQuiz('Chemical Reactions', 'Science', profile?.class || '10');
      setQuestions(data);
      setCurrentIndex(0);
      setScore(0);
      setShowResult(false);
    } catch (error) {
      console.error('Quiz generation failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);
    if (index === questions[currentIndex].correctAnswer) {
      setScore(prev => prev + 1);
    }
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
    }
  };

  if (loading) {
    return (
      <div className="h-[calc(100vh-140px)] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        <h3 className="font-bold text-slate-900 text-lg">Generating AI Quiz...</h3>
        <p className="text-sm text-slate-500">Creating questions based on your chapter content.</p>
      </div>
    );
  }

  if (showResult) {
    const accuracy = (score / questions.length) * 100;
    return (
      <div className="p-6 space-y-8 text-center">
        <div className="w-24 h-24 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600 mx-auto shadow-lg">
          <Award className="w-12 h-12" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Quiz Completed!</h2>
          <p className="text-slate-500">Great effort on Chemical Reactions</p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-3xl font-bold text-blue-600">{score}/{questions.length}</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Score</div>
          </div>
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
            <div className="text-3xl font-bold text-green-600">{accuracy}%</div>
            <div className="text-xs text-slate-500 font-bold uppercase tracking-wider">Accuracy</div>
          </div>
        </div>

        <button 
          onClick={startQuiz}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="p-6 h-[calc(100vh-140px)] flex flex-col items-center justify-center text-center space-y-6">
        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-blue-600">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-bold text-slate-900">Ready for a Quiz?</h3>
          <p className="text-sm text-slate-500">Test your knowledge on Chemical Reactions with AI-generated MCQs.</p>
        </div>
        <button 
          onClick={startQuiz}
          className="w-full max-w-xs bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200"
        >
          Start Quiz
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Question {currentIndex + 1} of {questions.length}</span>
        <div className="h-2 w-24 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-600 transition-all duration-300" 
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} 
          />
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 leading-tight">
        {currentQuestion.question}
      </h3>

      <div className="space-y-3">
        {currentQuestion.options.map((option, i) => {
          const isCorrect = i === currentQuestion.correctAnswer;
          const isSelected = i === selectedOption;
          
          let bgColor = "bg-white";
          let borderColor = "border-slate-100";
          let textColor = "text-slate-700";

          if (isAnswered) {
            if (isCorrect) {
              bgColor = "bg-green-50";
              borderColor = "border-green-200";
              textColor = "text-green-700";
            } else if (isSelected) {
              bgColor = "bg-red-50";
              borderColor = "border-red-200";
              textColor = "text-red-700";
            }
          } else if (isSelected) {
            borderColor = "border-blue-500";
            bgColor = "bg-blue-50/30";
          }

          return (
            <button
              key={i}
              onClick={() => handleOptionSelect(i)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${bgColor} ${borderColor} ${textColor}`}
            >
              <span className="font-medium">{option}</span>
              {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-600" />}
              {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
            </button>
          );
        })}
      </div>

      <AnimatePresence>
        {isAnswered && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Explanation</h4>
              <p className="text-sm text-slate-600 leading-relaxed">{currentQuestion.explanation}</p>
            </div>
            <button 
              onClick={nextQuestion}
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
            >
              {currentIndex === questions.length - 1 ? 'See Results' : 'Next Question'}
              <ChevronRight size={20} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
