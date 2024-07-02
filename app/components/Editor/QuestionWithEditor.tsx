'use client';

import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Question from '@/app/lib/models/Question';

type QuestionWithEditorProps = {
    question: Question | null;
};

const languages = [
    { value: 'python', label: 'Python' },
    { value: 'javascript', label: 'JavaScript' },
    { value: 'java', label: 'Java' },
];

const QuestionWithEditor: React.FC<QuestionWithEditorProps> = ({ question }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(languages[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    type ResponseData = {
        allPassed: boolean;
        results: {
            input: any;
            expectedOutput: string;
            actualOutput: string;
            passed: boolean;
            errorMessage?: string;
        }[];
    };

    const [results, setResults] = useState<ResponseData | null>(null);

    const handleSubmit = async () => {
        if (!question) return;
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/verify-answer', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    questionId: question.id,
                    answer: code,
                    language: language.value
                })
            });
            if (!response.ok) {
                throw new Error(await response.text());
            }
            const data = await response.json();
            setResults(data);
        } catch (error: any) {
            setError(error.message || 'Failed to verify answer');
        }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full bg-neutral p-4 rounded-lg relative">
            <div className="flex items-center justify-between mb-4">
                <select
                    className="select select-bordered max-w-xs cursor-pointer text-white text-sm"
                    value={language.value}
                    onChange={(e) => setLanguage(languages.find(lang => lang.value === e.target.value) || languages[0])}
                >
                    {languages.map((language, index) => (
                        <option key={index} value={language.value}>
                            {language.label}
                        </option>
                    ))}
                </select>
                <button
                    className="btn btn-primary btn-sm"
                    onClick={handleSubmit}
                    disabled={!question || !code}
                >
                    Submit
                </button>
            </div>
            <MonacoEditor
                height="calc(100% - 180px)"
                width="100%"
                language={language.value}
                value={code}
                onChange={(value) => setCode(value || '')}
                className="border border-gray-700"
                theme="vs-dark"
            />
            <div className="h-1/4 mt-4 p-4 bg-base-200 rounded overflow-auto text-sm">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full">
                        <p className="mt-2 text-white">Verifying answer...</p>
                        <span className="loading loading-dots loading-md"></span>
                    </div>
                ) : error ? (
                    <div className="text-red-500">{error}</div>
                ) : results ? (
                    <div>
                        <h2 className="text-lg font-bold mb-2">Results</h2>
                        {results.allPassed ? (
                            <div className="bg-green-100 text-green-700 p-2 rounded mb-2">
                                <p>All test cases passed!</p>
                            </div>
                        ) : null}
                        {results.results.map((result, index) => (
                            <div key={index} className="bg-white p-2 mb-2 border border-gray-300 rounded">
                                <p><strong>Input:</strong> {JSON.stringify(result.input)}</p>
                                <p><strong>Expected Output:</strong> {result.expectedOutput}</p>
                                <p><strong>Actual Output:</strong> {result.actualOutput}</p>
                                <p><strong>Passed:</strong> {result.passed ? 'Yes' : 'No'}</p>
                                {result.errorMessage && <p><strong>Error:</strong> {result.errorMessage}</p>}
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-400">Results will be shown here after you submit your code.</p>
                )}
            </div>
            {!question && !loading && (
                <div className="absolute inset-0 flex items-center justify-center z-10 bg-neutral bg-opacity-75">
                    <p>Press "Generate Question" to start...</p>
                </div>
            )}
        </div>
    );
};

export default QuestionWithEditor;
