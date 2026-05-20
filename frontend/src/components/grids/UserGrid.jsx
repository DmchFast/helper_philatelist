import UserCard from '../cards/UserCard'
import './UserGrid.css'

function UserGrid({ users, onUserClick }) {
  return (
    <section className="user-grid" aria-label="Список пользователей">
      {users.map((user) => (
        <UserCard key={user.id} user={user} onOpenProfile={onUserClick} />
      ))}
    </section>
  )
}

export default UserGrid