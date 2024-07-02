'use client';

import React, { useState } from 'react';
import GenerateQuestionButton from './components/generate/GenerateQuestionButton';
import QuestionWithEditor from './components/Editor/QuestionWithEditor';
import Question from '@/app/lib/models/Question';

export default function Home() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateQuestion = async () => {
    setLoading(true);
    const response = await fetch('/api/generate-question', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic: 'arrays' }) // Example topic, you can make this dynamic
    });
    const data = await response.json();
    setQuestion(data);
    setLoading(false);
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/2 p-4 overflow-auto" style={{ position: 'relative' }}>
        {question ? (
          <div>
            <h1 className="text-xl font-bold">{question.title}</h1>
            <p>{question.description}</p>
            <div>
              {question.examples.map((example, index) => (
                <div key={index} className="p-2 my-2 border rounded">
                  <p><strong>Input:</strong> {JSON.stringify(example.input)}</p>
                  <p><strong>Output:</strong> {JSON.stringify(example.output)}</p>
                  {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
                </div>
              ))}
            </div>
            <p><strong>Constraints:</strong> {question.constraints.join(', ')}</p>
            <p><strong>Follow-up:</strong> {question.follow_up}</p>
            <p><strong>Topics:</strong> {question.topics.join(', ')}</p>
            <p><strong>Hints:</strong> {question.hints.join(', ')}</p>
            <p><strong>Difficulty:</strong> {question.difficulty}</p>
          </div>
        ) : (
          <div className="h-full flex items-center justify-center">
            <GenerateQuestionButton onClick={handleGenerateQuestion} />
          </div>
        )}
        {loading && <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-50"><span className="loading loading-dots loading-lg"></span></div>}
      </div>
      <div className="w-1/2 p-4 flex flex-col">
        <QuestionWithEditor question={question} />
      </div>
    </div>
  );
}
