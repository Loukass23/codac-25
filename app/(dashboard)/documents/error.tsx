'use client';

import { Home, RefreshCw } from 'lucide-react';
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
    console.error('Documents page error:', error);
  }, [error]);
  return (
    <div className='min-h-[60vh] flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <CardTitle>Failed to load Documents</CardTitle>
          <CardDescription>
            There was an error loading this Documents. This might be due to a
            temporary issue or connection problem.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button onClick={() => window.location.reload()} className='flex-1'>
              <RefreshCw className='w-4 h-4 mr-2' />
              Reload Page
            </Button>

            <Button asChild variant='outline' className='flex-1'>
              <Link href='/'>
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
