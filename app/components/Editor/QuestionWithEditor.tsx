'use client';

import React, { useState } from 'react';
import MonacoEditor from '@monaco-editor/react';
import Question from '@/app/lib/models/Question';
import Select from 'react-select';

type QuestionWithEditorProps = {
    question: Question | null;
};

const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'java', label: 'Java' },
    // Add more languages as needed
];

const QuestionWithEditor: React.FC<QuestionWithEditorProps> = ({ question }) => {
    const [code, setCode] = useState('');
    const [language, setLanguage] = useState(languages[0]);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState(null);

    const handleSubmit = async () => {
        setLoading(true);
        const response = await fetch('/api/verify-answer', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                questionId: question?.id,
                answer: code,
                language: language.value
            })
        });
        const data = await response.json();
        setResults(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-full">
            <div className="flex items-center justify-between mb-4">
                <Select
                    value={language}
                    onChange={setLanguage}
                    options={languages}
                    className="w-1/3"
                />
                <button
                    className="btn btn-success"
                    onClick={handleSubmit}
                    disabled={!question || !code}
                >
                    Submit
                </button>
            </div>
            <MonacoEditor
                height="70%"
                language={language.value}
                value={code}
                onChange={(value) => setCode(value || '')}
            />
            <div className="h-1/4 mt-4 p-4 bg-gray-100 rounded">
                {loading ? (
                    <div className="flex items-center justify-center">
                        <span className="loading loading-dots loading-lg"></span>
                    </div>
                ) : results ? (
                    <div>
                        <h2 className="text-lg font-bold">Results</h2>
                        {results.allPassed ? (
                            <p className="text-green-600">All test cases passed!</p>
                        ) : (
                            results.results.map((result, index) => (
                                <div key={index} className="p-2 my-2 border rounded">
                                    <p><strong>Input:</strong> {JSON.stringify(result.input)}</p>
                                    <p><strong>Expected Output:</strong> {result.expectedOutput}</p>
                                    <p><strong>Actual Output:</strong> {result.actualOutput}</p>
                                    <p><strong>Passed:</strong> {result.passed ? 'Yes' : 'No'}</p>
                                    {result.errorMessage && <p><strong>Error:</strong> {result.errorMessage}</p>}
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    <p className="text-gray-600">Results will be shown here after you submit your code.</p>
                )}
            </div>
        </div>
    );
};

export default QuestionWithEditor;
