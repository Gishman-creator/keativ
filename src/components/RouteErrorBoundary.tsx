import React, { useState } from 'react';
import { useRouteError, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home, ArrowLeft, ChevronDown, ChevronUp, Terminal } from 'lucide-react';

export default function RouteErrorBoundary() {
  const error = useRouteError() as any;
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  // Extract error message and stack trace
  let errorMessage = "An unexpected error occurred.";
  let errorStack = "";

  if (error instanceof Error) {
    errorMessage = error.message;
    errorStack = error.stack || "";
  } else if (typeof error === 'object' && error !== null) {
    errorMessage = error.statusText || error.message || JSON.stringify(error);
    if (error.stack) {
      errorStack = error.stack;
    }
  } else if (typeof error === 'string') {
    errorMessage = error;
  }

  const handleReload = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/dashboard');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-slate-950 text-slate-100 p-6 relative overflow-hidden font-sans">
      {/* Background Decorative Glowing Blurs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/20 rounded-full filter blur-[100px] animate-pulse pointer-events-none animate-duration-5000" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full filter blur-[100px] animate-pulse pointer-events-none animate-duration-5000" style={{ animationDelay: '2s' }} />

      <div className="relative z-10 max-w-2xl w-full">
        {/* Logo/Branding */}
        <div className="flex justify-center mb-6">
          <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur border border-slate-800 px-4 py-2 rounded-full">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
            <span className="text-sm font-semibold tracking-wider text-slate-200">KEATIV RECOVERY</span>
          </div>
        </div>

        {/* Glassmorphism Error Card */}
        <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
          {/* Top colored accent line */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-purple-500 to-red-500" />

          <div className="flex flex-col items-center text-center">
            {/* Warning Icon Container with Pulsing Glow */}
            <div className="w-16 h-16 bg-red-500/10 border border-red-500/20 rounded-full flex items-center justify-center mb-6 shadow-inner relative">
              <div className="absolute inset-0 rounded-full bg-red-500/5 animate-ping pointer-events-none" />
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mb-3">
              Application Error
            </h1>
            <p className="text-slate-400 text-sm sm:text-base max-w-md mb-8">
              Something went wrong while rendering this page. The system caught the exception and isolated it to prevent data loss.
            </p>

            {/* Error Message Box */}
            <div className="w-full bg-slate-950/80 border border-slate-800/60 rounded-xl p-4 mb-6 text-left flex items-start space-x-3 shadow-inner">
              <Terminal className="h-5 w-5 text-slate-500 shrink-0 mt-0.5" />
              <div className="flex-1 overflow-hidden">
                <span className="text-xs font-semibold text-red-400 uppercase tracking-wider block mb-1">
                  Exception Captured
                </span>
                <span className="text-sm font-mono text-slate-300 break-words block">
                  {errorMessage}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
              <Button
                variant="outline"
                onClick={handleGoBack}
                type="button"
                className="border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Go Back
              </Button>
              <Button
                onClick={handleReload}
                type="button"
                className="bg-red-500 hover:bg-red-600 text-white font-medium shadow-lg shadow-red-500/20"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reload Page
              </Button>
              <Button
                variant="outline"
                onClick={handleGoHome}
                type="button"
                className="border-slate-800 hover:bg-slate-800 hover:text-white text-slate-300"
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </div>

            {/* Expandable Stack Trace Panel */}
            {errorStack && (
              <div className="w-full text-left border-t border-slate-800/60 pt-4 mt-2">
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  type="button"
                  className="flex items-center justify-between w-full text-xs text-slate-500 hover:text-slate-300 transition-colors uppercase font-semibold tracking-wider focus:outline-none"
                >
                  <span>{showDetails ? "Hide Stack Trace" : "Show Stack Trace"}</span>
                  {showDetails ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </button>

                {showDetails && (
                  <div className="mt-3 bg-slate-950 border border-slate-800/80 rounded-xl p-4 max-h-60 overflow-y-auto shadow-inner">
                    <pre className="text-xs font-mono text-red-400/90 leading-relaxed overflow-x-auto whitespace-pre-wrap break-all text-left">
                      {errorStack}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
