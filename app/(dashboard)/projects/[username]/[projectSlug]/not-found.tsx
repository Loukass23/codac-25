import { ArrowLeft, FileX, Home, Search } from 'lucide-react';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

export default function NotFound() {
  return (
    <div className='min-h-[80vh] flex items-center justify-center p-4'>
      <Card className='w-full max-w-lg'>
        <CardHeader className='text-center'>
          <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted'>
            <FileX className='h-8 w-8 text-muted-foreground' />
          </div>
          <CardTitle className='text-2xl'>Project Not Found</CardTitle>
          <CardDescription className='text-base'>
            The project you&apos;re looking for doesn&apos;t exist or may have
            been removed.
          </CardDescription>
        </CardHeader>
        <CardContent className='space-y-3'>
          <div className='flex flex-col sm:flex-row gap-3'>
            <Button asChild className='flex-1'>
              <Link href='/projects'>
                <Search className='w-4 h-4 mr-2' />
                Browse Projects
              </Link>
            </Button>

            <Button asChild variant='outline' className='flex-1'>
              <Link href='/'>
                <Home className='w-4 h-4 mr-2' />
                Go Home
              </Link>
            </Button>
          </div>

          <div className='pt-2'>
            <Button asChild variant='ghost' size='sm' className='w-full'>
              <Link
                href='/projects'
                className='flex items-center justify-center'
              >
                <ArrowLeft className='w-4 h-4 mr-2' />
                Back to All Projects
              </Link>
            </Button>
          </div>

          <p className='text-xs text-muted-foreground text-center mt-4'>
            If you believe this is an error, please check the URL or contact
            support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
