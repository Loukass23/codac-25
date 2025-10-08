import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Registration is disabled during beta
  return NextResponse.json(
    {
      error: 'Registration is currently disabled. We are in beta and only existing users can sign in.'
    },
    { status: 403 }
  );
}
