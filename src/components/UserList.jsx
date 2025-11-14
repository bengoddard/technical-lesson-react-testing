import React, { useState } from "react";

function UserList({ users, changeStatus }) {

  function handleClick(user){
    let updatedUser = {...user}
    if (user.status == "Online"){
        updatedUser.status = "Offline"
    }
    else{
        updatedUser.status = "Online"
    }
    changeStatus(updatedUser)
    console.log(updatedUser)
  }

  return (
    <ul>
      {
        users.map((user)=>(
            <div data-testid="user-item" key={user.id}>
                <div>
                    <img className="inline-block-child profile-image" src={user.profile_image} alt={"user image"} />
                    <h4 className="inline-block-child">{user.name}</h4>
                    <h2 className="inline-block-child">{"|"}</h2>
                    <img className="active-image inline-block-child" src = {user.status=="Online" ? "./Pan_Green_Circle.png":"./Red-Circle-Transparent.png"}/>
                    <p data-testid="status-item" className="inline-block-child" onClick={()=>{handleClick(user)}}>{user.status}</p>
                </div>
            </div>
        ))
      }
    </ul>
  );
}

export default UserList;
