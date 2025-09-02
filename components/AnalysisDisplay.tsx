
import React, { useState } from 'react';
import type { AnalysisResult, CodeAnalysis, FileTreeNode } from '../types';
import { FolderIcon, FileIcon } from './icons';

interface FileTreeProps {
  nodes: FileTreeNode[];
}

const FileTree: React.FC<FileTreeProps> = ({ nodes }) => {
  return (
    <ul className="space-y-1">
      {nodes.map((node, index) => (
        <FileTreeNodeComponent key={index} node={node} />
      ))}
    </ul>
  );
};

const FileTreeNodeComponent: React.FC<{ node: FileTreeNode }> = ({ node }) => {
  const [isOpen, setIsOpen] = useState(true);

  if (node.type === 'directory') {
    return (
      <li>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center w-full text-left text-gray-300 hover:bg-gray-800 rounded-md p-1 transition-colors duration-150"
        >
          <FolderIcon className="w-5 h-5 mr-2 text-sky-400 flex-shrink-0" />
          <span className="font-medium">{node.name}</span>
          <svg className={`w-4 h-4 ml-auto transform transition-transform duration-200 ${isOpen ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {isOpen && node.children && (
          <div className="pl-6 border-l-2 border-gray-700 mt-1">
            <FileTree nodes={node.children} />
          </div>
        )}
      </li>
    );
  }

  return (
    <li className="flex items-center text-gray-400 p-1">
      <FileIcon className="w-5 h-5 mr-2 text-gray-500 flex-shrink-0" />
      <span>{node.name}</span>
    </li>
  );
};

const AnalysisCard: React.FC<{ title: string; data: CodeAnalysis }> = ({ title, data }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
    <h3 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-cyan-300 mb-4">{title}</h3>
    <div className="space-y-6">
      <div>
        <h4 className="font-semibold text-gray-200 mb-2">AI Analysis</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{data.analysis}</p>
      </div>
      <div>
        <h4 className="font-semibold text-gray-200 mb-3">Key Technologies</h4>
        <div className="flex flex-wrap gap-2">
          {data.technologies.map((tech) => (
            <span key={tech} className="bg-gray-800 text-cyan-300 text-xs font-medium px-2.5 py-1 rounded-full">{tech}</span>
          ))}
        </div>
      </div>
      <div>
        <h4 className="font-semibold text-gray-200 mb-2">Simulated File Structure</h4>
        <div className="bg-gray-950 p-4 rounded-md border border-gray-800 max-h-80 overflow-y-auto">
          <FileTree nodes={data.fileTree} />
        </div>
      </div>
    </div>
  </div>
);


export const AnalysisDisplay: React.FC<{ result: AnalysisResult }> = ({ result }) => {
  return (
    <div className="mt-8 w-full animate-fade-in">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnalysisCard title="Frontend Analysis" data={result.frontend} />
        <AnalysisCard title="Backend Analysis" data={result.backend} />
      </div>
    </div>
  );
};
