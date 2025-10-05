import { redirect } from 'next/navigation';


export default async function LMSPage() {
  redirect('/lms/welcome');

  // If no welcome document, show the LMS content with folder navigation
  // The layout will handle showing the folder navigation and content
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-bold mb-4'>Learning Management System</h1>
      <p className='text-muted-foreground'>
        Welcome to your learning content. Use the folder navigation on the left
        to browse your courses and materials.
      </p>
    </div>
  );
}
