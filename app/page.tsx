import Image from "next/image";
import Question from "@/app/lib/models/Question"

export default async function Home() {
  // await Question.syncFromDisk();
  // const questions = await Question.getAllQuestions();
  // console.log(questions); // List all questions

  const question = await Question.create('64843dae-77c6-47b9-9031-d6047a2fe298');
  console.log('Questions fetched', question.data);
  // await question.setTitle('Two Sum Array'); // Sets the title and saves to the database
  const title = question.data.title; // Gets the title from the data
  // await question.setTitle('Two Sum Array'); // Sets the title and saves to the database
  // const title = question.data.title; // Gets the title from the data

  // console.log(title); // Two Sum Array
  // handleSyncQuestions();
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1>{title}</h1>
    </main>
  );
}
