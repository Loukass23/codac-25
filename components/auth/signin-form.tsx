'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface SignInFormProps {
  callbackUrl?: string;
}

function getErrorMessage(error: string | undefined): string {
  switch (error) {
    case 'CredentialsSignin':
      return 'Sign in failed. Check the details you provided are correct.';
    case 'SessionRequired':
      return 'Please sign in to access this page.';
    default:
      return 'An error occurred during sign in.';
  }
}

export function SignInForm({
  callbackUrl: initialCallbackUrl,
}: SignInFormProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isCredentialsLoading, setIsCredentialsLoading] = useState(false);

  // Get parameters from URL
  const callbackUrl =
    initialCallbackUrl || searchParams.get('callbackUrl') || '/';
  const urlError = searchParams.get('error');
  const [error, setError] = useState<string | undefined>(urlError || undefined);

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated' && session) {
      router.replace(callbackUrl);
    }
  }, [session, status, router, callbackUrl]);

  // Update error state when URL error changes
  useEffect(() => {
    if (urlError) {
      setError(urlError);
    }
  }, [urlError]);

  const handleCredentialsSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setIsCredentialsLoading(true);
    setError(undefined);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError(result.error);
      } else if (result?.ok) {
        router.push(callbackUrl);
      }
    } catch {
      setError('An error occurred during sign in.');
    } finally {
      setIsCredentialsLoading(false);
    }
  };

  // Show loading while checking authentication status
  if (status === 'loading') {
    return (
      <div className='flex justify-center items-center py-8'>
        <Icons.spinner className='h-6 w-6 animate-spin' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      <Alert
        variant='default'
        className='border-blue-500 bg-blue-50 dark:bg-blue-950'
      >
        <AlertDescription className='text-sm text-blue-900 dark:text-blue-100'>
          Beta access is currently limited to existing users only.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert variant='destructive'>
          <AlertDescription>{getErrorMessage(error)}</AlertDescription>
        </Alert>
      )}

      {/* Credentials Form */}
      <form onSubmit={handleCredentialsSubmit} className='space-y-4'>
        <div className='space-y-2'>
          <Label htmlFor='email'>Email</Label>
          <Input
            id='email'
            name='email'
            type='email'
            placeholder='Enter your email address'
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            disabled={isCredentialsLoading}
          />
        </div>
        <div className='space-y-2'>
          <Label htmlFor='password'>Password</Label>
          <Input
            id='password'
            name='password'
            type='password'
            placeholder='Enter your password'
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            disabled={isCredentialsLoading}
          />
        </div>
        <Button
          type='submit'
          className='w-full'
          disabled={isCredentialsLoading}
        >
          {isCredentialsLoading && (
            <Icons.spinner className='mr-2 h-4 w-4 animate-spin' />
          )}
          Sign In
        </Button>
      </form>
    </div>
  );
}
