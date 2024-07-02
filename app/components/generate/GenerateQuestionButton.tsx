'use client';

import React from 'react';

type GenerateQuestionButtonProps = {
  onClick: () => void;
};

const GenerateQuestionButton: React.FC<GenerateQuestionButtonProps> = ({ onClick }) => {
  return (
    <button className="btn btn-primary" onClick={onClick}>
      Generate Question
    </button>
  );
};

export default GenerateQuestionButton;
