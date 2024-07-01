import Question from '@/app/lib/models/Question';

export default async function HomePage() {
    const questions = await Question.getAllQuestions();

    return (
        <div className="p-4">
            <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li>Questions</li>
                </ul>
            </div>
            <h1 className="text-2xl font-bold mb-4">Questions</h1>
            <ul className="space-y-2">
                {questions.length > 0 ? (
                    questions.map((question: any) => (
                        <li key={question.data.id}>
                            <a href={`/questions/${question.data.id}`} className="block p-4 border rounded hover:bg-gray-100">
                                {question.data.title}
                            </a>
                        </li>
                    ))
                ) : (
                    <li>No questions available</li>
                )}
            </ul>
        </div>
    );
}
