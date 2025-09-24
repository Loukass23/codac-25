'use client';

import { type Value } from 'platejs';
import { toast } from 'sonner';

import { updateDocument } from '@/actions/projects/update-document';

import { PlateEditor } from './plate-editor';

type CurrentUser = {
  id: string;
  name: string | null;
  avatar: string | null;
};

interface DocumentEditorWrapperProps {
  documentId: string;
  initialValue: Value;
  currentUser: CurrentUser;
}

export function DocumentEditorWrapper({
  documentId,
  initialValue,
  currentUser,
}: DocumentEditorWrapperProps) {
  const handleSave = async (value: Value) => {
    try {
      const result = await updateDocument({
        id: documentId,
        content: value,
      });

      if (result.success) {
        toast.success('Document saved successfully');
      } else {
        toast.error(result.error || 'Failed to save document');
      }
    } catch (error) {
      console.error('Error saving document:', error);
      toast.error('Failed to save document');
    }
  };

  return <PlateEditor initialValue={initialValue} onSave={handleSave} />;
  // return (
  //   <DocumentEditorWithComments
  //     documentId={documentId}
  //     initialValue={initialValue}
  //     currentUser={currentUser}
  //     onSave={handleSave}
  //   />
  // );
}
