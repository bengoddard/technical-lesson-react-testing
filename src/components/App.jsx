import { useState, useEffect } from 'react'
import UserList from './UserList'


function App() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('http://localhost:6001/users')
    .then(r => r.json())
    .then(data => setUsers(data))
  }, [])

  function changeStatus(updatedUser){
    fetch(`http://localhost:6001/users/${updatedUser.id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
      }
    )
    .then(r => r.json())
    .then(data => {
      setUsers(users.map((user => {
        if(user.id == updatedUser.id){
          return data
        }
        return user
      })))
    })
  }

  return (
    <div>
      <UserList users={users} changeStatus={changeStatus}/>
    </div>
  )
}

export default App
