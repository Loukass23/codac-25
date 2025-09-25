import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentNotFound() {
  return (
    <div className='container mx-auto px-4 py-8 max-w-4xl'>
      <Card>
        <CardHeader>
          <CardTitle>Document Not Found</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className='text-muted-foreground'>
            The document you&apos;re looking for doesn&apos;t exist or you don&apos;t have
            permission to view it.
          </p>
          <div className='flex space-x-2'>
            <Button asChild variant='ghost'>
              <Link href='/docs'>Browse Documents</Link>
            </Button>
            <Button asChild>
              <Link href='/projects'>Browse Projects</Link>
            </Button>
            <Button variant='outline' asChild>
              <Link href='/community'>Go to Community</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
