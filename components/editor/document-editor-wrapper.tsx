'use client';

import { Document } from '@prisma/client';
import { notFound } from 'next/navigation';
import { type Value } from 'platejs';
import { use } from 'react';
import { toast } from 'sonner';

import { updateDocument } from '@/actions/projects/update-document';
import { jsonToPlateValue } from '@/lib/plate/utils';

import { DocumentDiscussionWithComments } from '../../data/documents/get-document';

import { PlateEditor } from './plate-editor2';
import { TDiscussionConfig } from './plugins/discussion-plugin-config';
import { TComment } from '../ui/comment';
import { UserData } from './plugins/discussion-kit';


interface DocumentEditorWrapperProps {
  _documentPromise: Promise<Document>;
  _documentDiscussionsPromise: Promise<DocumentDiscussionWithComments[]>;
  userId: string;
}

export function DocumentEditorWrapper({
  _documentPromise,
  _documentDiscussionsPromise,
  userId
}: DocumentEditorWrapperProps) {

  const document = use(_documentPromise);
  if (!document) {
    notFound();
  }

  const discussions = use(_documentDiscussionsPromise);
  const users = discussions.map((discussion) => discussion.user);
  const discussionsData = discussions.map((discussion) => {
    return {
      id: discussion.id,
      comments: discussion.comments as unknown as TComment[],
      createdAt: discussion.createdAt,
      isResolved: discussion.isResolved,
      updatedAt: discussion.updatedAt,
      documentContent: discussion.documentContent as string,
      documentId: discussion.documentId,
      userId: discussion.userId,
      user: discussion.user,
    };
  });

  const discussionPluginOptions: TDiscussionConfig = {
    currentUserId: userId,
    currentUser: {
      id: users[0]?.id || '',
      name: users[0]?.name || '',
      avatarUrl: users[0]?.avatar || '',
    },
    documentId: document.id,
    discussions: discussionsData,
    users: users.reduce((acc, user) => {
      acc[user.id] = {
        id: user.id,
        name: user.name || '',
        avatarUrl: user.avatar || '',
      };
      return acc;
    }, {} as Record<string, UserData>),

  }



  const initialValue = jsonToPlateValue(document.content);

  const handleSave = async (value: Value) => {
    try {
      const result = await updateDocument({
        id: document.id,
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
  // return <DiscussionEditorExample documentId={document.id} initialValue={initialValue} onSave={handleSave} />
  return <PlateEditor discussionPluginOptions={discussionPluginOptions} initialValue={initialValue} onSave={handleSave} />;
  // return (
  //   <DocumentEditorWithComments
  //     documentId={documentId}
  //     initialValue={initialValue}
  //     currentUser={currentUser}
  //     onSave={handleSave}
  //   />
  // );
}
