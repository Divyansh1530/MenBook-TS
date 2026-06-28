import UserDashboard from '../components/UserDashboard'
import MentorDashboard from '../components/MentorDashboard'
import type { UserDashboardProps } from '../types/user'

function Dashboard({
  user
}:UserDashboardProps) {

  if (user?.role === "mentor") {

    return (
      <MentorDashboard
        user={user}
      />
    )
  }

  return (
    <UserDashboard
      user={user}
    />
  )
}

export default Dashboard