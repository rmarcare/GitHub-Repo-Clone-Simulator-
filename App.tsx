
import React, { useState, useCallback } from 'react';
import type { AnalysisResult } from './types';
import { AppStatus } from './types';
import { generateRepoAnalysis } from './services/geminiService';
import { GitHubIcon } from './components/icons';
import { LoadingIndicator } from './components/LoadingIndicator';
import { AnalysisDisplay } from './components/AnalysisDisplay';

const App: React.FC = () => {
  const [repoUrl, setRepoUrl] = useState<string>('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.Idle);
  const [error, setError] = useState<string | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const handleAnalyzeClick = useCallback(async () => {
    if (!repoUrl) {
      setError("Please enter a GitHub repository URL.");
      setStatus(AppStatus.Error);
      return;
    }

    setStatus(AppStatus.Loading);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await generateRepoAnalysis(repoUrl);
      setAnalysisResult(result);
      setStatus(AppStatus.Success);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
      setStatus(AppStatus.Error);
    }
  }, [repoUrl]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-sans">
      <div className="w-full max-w-4xl mx-auto flex flex-col items-center">
        <header className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-sky-500 to-cyan-400 p-3 rounded-full mb-4 shadow-lg">
                <GitHubIcon className="w-10 h-10 text-white"/>
            </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-50">
            GitHub Repo Clone Simulator
          </h1>
          <p className="mt-3 text-lg text-gray-400 max-w-2xl mx-auto">
            Enter a public GitHub repo URL to simulate cloning and receive an AI-powered analysis of its structure and technology stack.
          </p>
        </header>

        <main className="w-full max-w-xl p-6 bg-gray-900 border border-gray-800 rounded-xl shadow-2xl shadow-sky-900/20">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative w-full">
              <GitHubIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                value={repoUrl}
                onChange={(e) => setRepoUrl(e.target.value)}
                placeholder="e.g., github.com/facebook/react"
                className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-md text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all duration-200"
                disabled={status === AppStatus.Loading}
              />
            </div>
            <button
              onClick={handleAnalyzeClick}
              disabled={status === AppStatus.Loading}
              className="w-full sm:w-auto flex-shrink-0 px-6 py-3 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-sky-500 transition-all duration-200"
            >
              {status === AppStatus.Loading ? 'Analyzing...' : 'Analyze'}
            </button>
          </div>
          {status === AppStatus.Error && error && (
            <p className="mt-4 text-center text-red-400 bg-red-900/30 border border-red-700 p-3 rounded-md animate-fade-in">{error}</p>
          )}
        </main>
        
        {status === AppStatus.Loading && <LoadingIndicator />}
        {status === AppStatus.Success && analysisResult && <AnalysisDisplay result={analysisResult} />}

      </div>
       <footer className="text-center mt-12 text-gray-600 text-sm">
          <p>&copy; {new Date().getFullYear()} AI Repo Analyzer. All rights reserved.</p>
          <p>This is a simulation and does not actually access your code.</p>
      </footer>
    </div>
  );
};

export default App;
