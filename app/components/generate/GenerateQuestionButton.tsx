'use client';

import React, { useState } from 'react';

type GenerateQuestionButtonProps = {
  onClick: (topic: string) => void;
};

const topics = [
  'arrays', 'strings', 'linked lists', 'trees', 'graphs',
  'dynamic programming', 'greedy algorithms', 'sorting', 'searching', 'math'
];

const GenerateQuestionButton: React.FC<GenerateQuestionButtonProps> = ({ onClick }) => {
  const [selectedTopic, setSelectedTopic] = useState(topics[0]);
  return (
    <div className="flex flex-col items-center">
      <h1 className="text-1xl font-bold mb-2">Select a topic</h1>
      <select
        className="select select-bordered w-full max-w-xs mb-4 cursor-pointer text-white text-sm" // Small text
        value={selectedTopic}
        onChange={(e) => setSelectedTopic(e.target.value)}
      >
        {topics.map((topic, index) => (
          <option key={index} value={topic}>
            {topic}
          </option>
        ))}
      </select>
      <button className="btn" onClick={() => onClick(selectedTopic)}>
        Generate Question
      </button>
    </div>
  );
};

export default GenerateQuestionButton;
