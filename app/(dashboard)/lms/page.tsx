import { redirect } from 'next/navigation';

import { getLMSDocumentBySlug } from '@/data/documents/get-lms-documents';
import { requireServerAuth } from '@/lib/auth/auth-server';

export default async function LMSPage() {
  const user = await requireServerAuth();

  // Try to find the welcome document
  const welcomeDoc = await getLMSDocumentBySlug('welcome');

  if (welcomeDoc) {
    redirect('/lms/welcome');
  }

  // If no welcome document, redirect to a default LMS page
  redirect('/lms');
}
