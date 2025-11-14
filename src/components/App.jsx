import { useState, useEffect } from 'react'
import UserList from './UserList'


function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:6001/users')
    .then(r => r.json())
    .then(data => setUsers(data))
  }, [])

  return (
    <div>
      <UserList users={users}/>
    </div>
  )
}

export default App
