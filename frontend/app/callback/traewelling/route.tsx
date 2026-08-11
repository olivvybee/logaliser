import { createTraewellingAuthToken } from '@/lib/logaliser-api';
import { NextRequest } from 'next/server';
import { redirect } from 'next/navigation';

export const GET = async (request: NextRequest) => {
  const params = request.nextUrl.searchParams;
  const code = params.get('code');

  if (!code) {
    return Response.json({ error: 'No code provided.' }, { status: 400 });
  }

  try {
    await createTraewellingAuthToken(code);
  } catch (err) {
    const error = err as Error;
    return Response.json({ error: error.message }, { status: 500 });
  }

  return redirect('/settings');
};
