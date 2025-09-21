import * as React from 'react';

import { uploadFile, type UploadResult } from '@/lib/supabase/storage';
import { toast } from 'sonner';
import { z } from 'zod';

export type UploadedFile = UploadResult;

interface UseUploadFileProps {
  onUploadComplete?: (file: UploadedFile) => void;
  onUploadError?: (error: unknown) => void;
  bucket?: string;
  folder?: string;
}

export function useUploadFile({
  onUploadComplete,
  onUploadError,
  bucket,
  folder,
}: UseUploadFileProps = {}) {
  const [uploadedFile, setUploadedFile] = React.useState<UploadedFile>();
  const [uploadingFile, setUploadingFile] = React.useState<File>();
  const [progress, setProgress] = React.useState<number>(0);
  const [isUploading, setIsUploading] = React.useState(false);

  async function uploadSupabase(file: File) {
    setIsUploading(true);
    setUploadingFile(file);

    try {
      const result = await uploadFile(file, {
        ...(bucket && { bucket }),
        ...(folder && { folder }),
        onProgress: (progressValue) => {
          setProgress(Math.min(progressValue, 100));
        },
      });

      setUploadedFile(result);
      onUploadComplete?.(result);

      return result;
    } catch (error) {
      const errorMessage = getErrorMessage(error);

      const message =
        errorMessage.length > 0
          ? errorMessage
          : 'Something went wrong, please try again later.';

      toast.error(message);
      onUploadError?.(error);

      // Mock upload for unauthenticated users or fallback
      const mockUploadedFile = {
        key: `mock-${Date.now()}`,
        name: file.name,
        size: file.size,
        type: file.type,
        url: URL.createObjectURL(file),
        path: `mock/${file.name}`,
      } as UploadedFile;

      // Simulate upload progress
      let progressValue = 0;
      const simulateProgress = async () => {
        while (progressValue < 100) {
          await new Promise((resolve) => setTimeout(resolve, 50));
          progressValue += 2;
          setProgress(Math.min(progressValue, 100));
        }
      };

      await simulateProgress();
      setUploadedFile(mockUploadedFile);

      return mockUploadedFile;
    } finally {
      setProgress(0);
      setIsUploading(false);
      setUploadingFile(undefined);
    }
  }

  return {
    isUploading,
    progress,
    uploadedFile,
    uploadFile: uploadSupabase,
    uploadingFile,
  };
}

export function getErrorMessage(err: unknown) {
  const unknownError = 'Something went wrong, please try again later.';

  if (err instanceof z.ZodError) {
    const errors = err.issues.map((issue) => {
      return issue.message;
    });

    return errors.join('\n');
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);

  return toast.error(errorMessage);
}
