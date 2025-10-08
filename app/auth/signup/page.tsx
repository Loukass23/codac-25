import { CodacLogo } from '@/components/codac-brand/codac-logo';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import Link from 'next/link';

interface SignUpPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
  }>;
}

export default async function SignUpPage({ searchParams }: SignUpPageProps) {
  const params = await searchParams;
  const callbackUrl = params?.callbackUrl || '/';

  return (
    <Card className='w-full p-4'>
      <CardHeader className='space-y-1'>
        <div className='flex justify-center mb-4'>
          <CodacLogo size='lg' useGradient />
        </div>
        <CardTitle className='text-2xl font-bold text-center'>
          Beta Access Only
        </CardTitle>
        <CardDescription className='text-center'>
          New registrations are currently disabled
        </CardDescription>
      </CardHeader>
      <CardContent className='space-y-6'>
        <Alert>
          <Icons.info className='h-4 w-4' />
          <AlertTitle>Registration Temporarily Closed</AlertTitle>
          <AlertDescription>
            We&apos;re currently in beta and not accepting new account
            registrations. If you already have an account, please sign in below.
          </AlertDescription>
        </Alert>

        <div className='text-center'>
          <Link
            href={`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`}
          >
            <Button className='w-full'>Sign in to existing account</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
