// lib/server/actions/signOut.ts
'use server';

import { cookies } from 'next/headers';
import { createSessionClient } from '../appwrite';
import { redirect } from 'next/navigation';

export async function signOut() {
  const { account } = await createSessionClient();
  if( !account ) {
    console.error('No account found to sign out.');
    return;
  }

  (await cookies()).delete('my-custom-session'); // clear cookie
  await account.deleteSession('current');        // clear Appwrite session

  redirect('/auth'); // go to auth page after logout
}
