import React from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface ErrorDisplayProps {
  error: Error | null;
  resetErrorBoundary?: () => void;
}

export default function ErrorDisplay({ error, resetErrorBoundary }: ErrorDisplayProps) {
  let message = "An unexpected error occurred.";
  let details = "";

  if (error) {
    try {
      const parsed = JSON.parse(error.message);
      if (parsed.error) {
        message = "Firebase Permission Error";
        details = `Operation: ${parsed.operationType} on ${parsed.path}`;
      }
    } catch {
      message = error.message;
    }
  }

  return (
    <div className="p-6 flex flex-col items-center justify-center min-h-[60vh] text-center">
      <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mb-4">
        <AlertTriangle className="w-8 h-8" />
      </div>
      <h2 className="text-xl font-bold text-slate-900 mb-2">{message}</h2>
      <p className="text-slate-500 text-sm mb-6 max-w-xs">{details || "Please check your internet connection or try again later."}</p>
      
      {resetErrorBoundary && (
        <button 
          onClick={resetErrorBoundary}
          className="flex items-center gap-2 bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold"
        >
          <RefreshCcw className="w-4 h-4" /> Try Again
        </button>
      )}
    </div>
  );
}
