import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { Client, Account } from 'node-appwrite';

export async function POST() {
  try {
    const cookieStore = cookies();
    const sessionCookie = (await cookieStore).get('appwrite-session'); // or your custom cookie name

    const client = new Client()
      .setEndpoint(process.env.APPWRITE_ENDPOINT!)
      .setProject(process.env.APPWRITE_PROJECT_ID!)
      .setKey(process.env.APPWRITE_API_KEY!);

    const account = new Account(client);

    // Delete current session (you can use session id if stored)
    await account.deleteSession('current');

    // Clear the session cookie
    const response = NextResponse.json({ success: true });
    response.cookies.set('appwrite-session', '', {
      path: '/',
      expires: new Date(0),
    });

    return response;
  } catch (error) {
    console.error('Sign out error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
