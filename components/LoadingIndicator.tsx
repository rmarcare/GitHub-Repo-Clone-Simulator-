
import React, { useState, useEffect } from 'react';
import { SpinnerIcon } from './icons';

const loadingSteps = [
    "Connecting to GitHub...",
    "Authorizing access...",
    "Cloning repository (simulated)...",
    "Analyzing file structure...",
    "Parsing frontend code...",
    "Inspecting backend dependencies...",
    "Generating AI analysis report...",
    "Finalizing..."
];

export const LoadingIndicator: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % loadingSteps.length);
        }, 1500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="mt-8 w-full max-w-md text-center p-6 bg-gray-900 border border-gray-800 rounded-lg shadow-lg animate-fade-in">
            <div className="flex justify-center items-center gap-4">
                <SpinnerIcon className="w-8 h-8 text-sky-400" />
                <h2 className="text-xl font-semibold text-gray-200">Analyzing Repository</h2>
            </div>
            <p className="text-gray-400 mt-4 min-h-[2.5rem]">{loadingSteps[currentStep]}</p>
            <div className="w-full bg-gray-700 rounded-full h-2.5 mt-6">
                <div 
                    className="bg-sky-500 h-2.5 rounded-full transition-all duration-1000 ease-out" 
                    style={{ width: `${((currentStep + 1) / loadingSteps.length) * 100}%` }}>
                </div>
            </div>
        </div>
    );
};
