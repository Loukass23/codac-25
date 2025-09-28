import { SignInForm } from '@/components/auth/signin-form';
import { CodacLogo } from '@/components/codac-brand/codac-logo';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface SignInPageProps {
  searchParams?: Promise<{
    callbackUrl?: string;
    error?: string;
  }>;
}

export default async function SignInPage({ searchParams }: SignInPageProps) {
  const params = await searchParams;

  return (
    <Card className='w-full p-4' >
      <CardHeader className='space-y-1'>
        <div className="flex justify-center mb-4">
          <CodacLogo size="lg" useGradient />
        </div>
        <CardTitle className='text-2xl font-bold text-center'>
          welcome to codac
        </CardTitle>
        <CardDescription className='text-center'>
          Share your learning journey with the community
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SignInForm callbackUrl={params?.callbackUrl} />
      </CardContent>
    </Card>
  );
}
