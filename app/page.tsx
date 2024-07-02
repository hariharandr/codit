'use client';

import React, { useState } from 'react';
import GenerateQuestionButton from './components/generate/GenerateQuestionButton';
import QuestionWithEditor from './components/Editor/QuestionWithEditor';
import Question from '@/app/lib/models/Question';

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestion = async (topic: string) => {
    setLoading(true);
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });
    const data = await response.json();
    setQuestion(data);
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-screen  text-white">
      <header className="divide-y divide-slate-700 border-b-2">
        <div className="navbar bg-base-100">
          <div className="flex-1">
            <a className="btn btn-ghost text-xl">Codit</a>
          </div>
          <div className="flex-none">
            <button className="btn btn-square btn-ghost">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                className="inline-block h-5 w-5 stroke-current"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a 1 1 0 11-2 0 1 1 0 012 0zm7 0a 1 1 0 11-2 0 1 1 0 012 0z"
                ></path>
              </svg>

            </button>
          </div>
        </div>
      </header>
      <div className="flex flex-grow">
        <div className="w-1/2 p-4 overflow-auto relative">
          {loading && (
            <div className="absolute inset-0 flex items-center justify-center bg-base-200 bg-opacity-50 z-10">
              <p className="mt-2 text-center">Generating question </p>
              <span className="loading loading-dots loading-md mt-3 ml-2"></span>
            </div>
          )}
          {question ? (
            <div className="text-sm"> {/* Small text */}
              <h1 className="text-xl font-bold mb-4">{question.title}</h1>
              <p dangerouslySetInnerHTML={{ __html: question.description }}></p>
              <div className="mb-4 mt-4">
                <h2 className="font-bold">Examples:</h2>
                {question.examples.map((example, index) => (
                  <div key={index} className="p-2 my-2 border rounded">
                    <p><strong>Input:</strong> {JSON.stringify(example.input)}</p>
                    <p><strong>Output:</strong> {JSON.stringify(example.output)}</p>
                    {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
                  </div>
                ))}
              </div>
              <p className="mb-2"><strong>Constraints:</strong></p>
              <ul className='list-disc ml-6'>
                {question.constraints.map((constraint, index) => (
                  <li>{constraint}</li>
                ))}
              </ul>

              <p className="mt-3 mb-2"><strong>Follow-up:</strong> {question.follow_up}</p>
              <p className="mt-3 mb-2"><strong>Topics:</strong> {question.topics.join(', ')}</p>
              <p className="mt-3 mb-2"><strong>Hints:</strong> {question.hints.join(', ')}</p>
              <p className="mt-3 mb-2"><strong>Difficulty:</strong> {question.difficulty}</p>
            </div>
          ) : (
            <GenerateQuestionButton onClick={handleGenerateQuestion} />
          )}
        </div>
        <div className="divider divider-horizontal"></div>
        <div className="w-1/2 p-1 flex flex-col h-screen">
          <QuestionWithEditor question={question} />
        </div>
      </div>
    </div>
  );
}
