// import React from 'react';

// const QuestionDisplay = ({ question }: { question: any }) => {
//     return (
//         <div>
//             <h2 className="text-xl font-bold">{question.title}</h2>
//             <p dangerouslySetInnerHTML={{ __html: question.description }}></p>
//             <h3 className="text-lg font-semibold">Examples</h3>
//             {question.examples.map((example, index) => (
//                 <div key={index}>
//                     <p><strong>Input:</strong> {JSON.stringify(example.input)}</p>
//                     <p><strong>Output:</strong> {JSON.stringify(example.output)}</p>
//                     {example.explanation && <p><strong>Explanation:</strong> {example.explanation}</p>}
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default QuestionDisplay;
