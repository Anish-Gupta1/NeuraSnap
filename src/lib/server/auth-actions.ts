// lib/server/auth-actions.ts
'use server';

import { ID } from 'node-appwrite';
import { createAdminClient } from './appwrite';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function signUpWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;

  const { account } = await createAdminClient();

  await account.create(ID.unique(), email, password, name);
  const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set('my-custom-session', session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  redirect('/');
}

export async function signInWithEmail(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  const { account } = await createAdminClient();
  const session = await account.createEmailPasswordSession(email, password);

  (await cookies()).set('my-custom-session', session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  redirect('/');
}
