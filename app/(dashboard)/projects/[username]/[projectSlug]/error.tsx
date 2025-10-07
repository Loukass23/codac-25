'use client'; // Error boundaries must be Client Components

import { AlertTriangle, ArrowLeft, Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Project page error:', error);
  }, [error]);

  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10'>
            <AlertTriangle className='h-8 w-8 text-destructive' />
          </div>
          <CardTitle className='text-2xl'>Something went wrong!</CardTitle>
          <CardDescription className='text-base'>
            There was an error loading this project. This might be due to a
            temporary issue or connection problem.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button onClick={reset} className='flex-1'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Try Again
            </Button>

            <Button asChild variant='outline' className='flex-1'>
              <Link href='/projects'>
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to Projects
              </Link>
            </Button>
          </div>

          <div className='pt-2'>
            <Button asChild variant='ghost' size='sm' className='w-full'>
              <Link href='/' className='flex items-center justify-center'>
                <Home className='w-4 h-4 mr-2' />
                Go Home
              </Link>
            </Button>
          </div>

          <p className='text-xs text-muted-foreground text-center mt-4'>
            If this problem continues, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
