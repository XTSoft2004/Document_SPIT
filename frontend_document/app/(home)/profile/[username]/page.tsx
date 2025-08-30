import { getProfileUser } from '@/actions/user.action'
import { getStatisticalUser } from '@/actions/statistical.actions'
import { ProfilePage } from '@/components/ui/Profile'
import { notFound } from 'next/navigation'

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default async function UserProfilePage({ params }: ProfilePageProps) {
  const { username } = params

  const profileResponse = await getProfileUser(username)

  if (!profileResponse.ok || !profileResponse.data) {
    notFound()
  }

  const statsResponse = await getStatisticalUser(username)

  const userData = profileResponse.data
  const userStats = statsResponse.ok ? statsResponse.data : {
    totalDocuments: 0,
    totalViews: 0,
    totalDownloads: 0,
    totalStars: 0
  }

  return (
    <ProfilePage
      userInfo={userData}
      userStats={userStats}
      username={username}
    />
  )
}