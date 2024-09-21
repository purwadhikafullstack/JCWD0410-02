import ProfilePage from '@/features/profile';
import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

const Profile = async () => {
  const session = await auth();
  if (session?.user.role !== 'USER') {
    return redirect('/register');
  }
  return <ProfilePage />;
};

export default Profile;
