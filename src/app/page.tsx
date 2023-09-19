import { getAuthSession } from '@/lib/auth';

export default async function Home() {
  const session = await getAuthSession();

  return <>{session?.user && <h1>HOME</h1>}</>;
}
