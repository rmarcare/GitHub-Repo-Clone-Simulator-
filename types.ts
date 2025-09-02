
export interface FileTreeNode {
  name: string;
  type: 'file' | 'directory';
  children?: FileTreeNode[];
}

export interface CodeAnalysis {
  analysis: string;
  technologies: string[];
  fileTree: FileTreeNode[];
}

export interface AnalysisResult {
  frontend: CodeAnalysis;
  backend: CodeAnalysis;
}

export enum AppStatus {
  Idle,
  Loading,
  Success,
  Error,
}
