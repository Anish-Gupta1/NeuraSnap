// src/app/account/page.tsx
export const dynamic = "force-dynamic";
import { getLoggedInUser, createSessionClient } from '@/lib/server/appwrite';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

async function signOut() {
  'use server';

  const { account } = await createSessionClient();

  (await cookies()).delete('my-custom-session');
  await account.deleteSession('current');

  redirect('/auth');
}

export default async function AccountPage() {
  const user = await getLoggedInUser();

  if (!user) redirect('/auth');

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100 text-gray-800 px-4">
      <div className="bg-white shadow-md rounded-lg p-8 max-w-lg w-full">
        <h1 className="text-2xl font-bold mb-4">Welcome, {user.name} 👋</h1>
        <ul className="space-y-2 text-sm">
          <li><strong>Email:</strong> {user.email}</li>
          <li><strong>ID:</strong> {user.$id}</li>
          <li><strong>Created:</strong> {new Date(user.$createdAt).toLocaleString()}</li>
        </ul>

        <form action={signOut} className="mt-6">
          <button
            type="submit"
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
          >
            Sign Out
          </button>
        </form>
      </div>
    </main>
  );
}
