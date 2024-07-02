import Question from '@/app/lib/models/Question';

export default async function QuestionPage({ params }: { params: { id: string } }) {
    const question = await Question.findById(params.id);

    if (!question) {
        return (
            <div className="p-4">
                <div className="breadcrumbs text-sm mb-4">
                    <ul>
                        <li><a href="/">Home</a></li>
                        <li><a href="/questions">Questions</a></li>
                        <li>Question Not Found</li>
                    </ul>
                </div>
                <p>Question not found</p>
            </div>
        );
    }

    return (
        <div className="p-4">
            <div className="breadcrumbs text-sm mb-4">
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/questions">Questions</a></li>
                    <li>{question.data.title}</li>
                </ul>
            </div>
            <div className="flex space-x-4">
                <div className="w-1/2">
                    <h2 className="text-xl font-bold mb-4">{question.data.title}</h2>
                    <div dangerouslySetInnerHTML={{ __html: question.data.description }} />
                    {/* Add more question details here */}
                </div>
                <div className="w-1/2">
                    {/* Add your code editor component here */}
                </div>
            </div>
        </div>
    );
}
