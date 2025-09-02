import { GoogleGenAI, Type } from "@google/genai";
import type { AnalysisResult } from "../types";

const GITHUB_URL_REGEX = /^(?:https?:\/\/)?(?:www\.)?github\.com\/([a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+)(?:\/)?$/;

// Define the file tree schema with a limited depth to prevent the "Maximum call stack size exceeded"
// error caused by a circular object reference in the original recursive schema.
// This schema allows a directory structure up to 3 levels deep from the root.
const fileTreeNodeSchema = {
    type: Type.OBJECT,
    properties: {
        name: { type: Type.STRING },
        type: { type: Type.STRING, enum: ['file', 'directory'] },
        children: {
            type: Type.ARRAY,
            items: { // Depth 1
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    type: { type: Type.STRING, enum: ['file', 'directory'] },
                    children: { // Depth 2
                        type: Type.ARRAY,
                        items: { // Depth 3 (files only to terminate recursion)
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                type: { type: Type.STRING, enum: ['file'] },
                            },
                            required: ['name', 'type'],
                        },
                    },
                },
                required: ['name', 'type'],
            },
        },
    },
    required: ['name', 'type']
};


const codeAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        analysis: {
            type: Type.STRING,
            description: "A brief, one-paragraph analysis of this part of the codebase (frontend or backend).",
        },
        technologies: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "A list of key technologies, frameworks, or libraries identified.",
        },
        fileTree: {
            type: Type.ARRAY,
            items: fileTreeNodeSchema,
            description: "A plausible file and directory structure for this part of the codebase. For nodes of type 'file', do not include a 'children' property.",
        },
    },
    required: ['analysis', 'technologies', 'fileTree']
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    frontend: codeAnalysisSchema,
    backend: codeAnalysisSchema,
  },
  required: ['frontend', 'backend'],
};

export const generateRepoAnalysis = async (repoUrl: string): Promise<AnalysisResult> => {
  const match = repoUrl.match(GITHUB_URL_REGEX);
  if (!match) {
    throw new Error("Invalid GitHub repository URL format. Please use format like 'github.com/user/repo'.");
  }
  const repoName = match[1];

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert software architect. A user has provided the following GitHub repository URL: ${repoUrl}.
    Your task is to simulate cloning and analyzing this repository. DO NOT access the actual URL.
    Instead, based on the repository name "${repoName}", generate a plausible and representative analysis for a modern full-stack web application.
    
    Create a detailed breakdown for both the frontend and backend, including a summary, key technologies, and a typical file structure.
    For example, if the name is 'my-ecommerce-app', generate a structure for a React frontend and a Node.js/Express backend. If it's 'data-viz-dashboard', maybe use Next.js and a Python/Flask backend. Use your best judgment to create a realistic and insightful simulation.
    For file tree nodes of type 'file', you must not include a 'children' property.

    Your response MUST be a JSON object that strictly adheres to the provided schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText) as AnalysisResult;
    return result;

  } catch (error) {
    console.error("Error generating analysis from Gemini API:", error);
    throw new Error("Failed to generate repository analysis. The AI model may be temporarily unavailable.");
  }
};
