# Technical Lesson: Testing with Vitest
## Introduction
In this lesson, we will explore how to test different features of our page.

## Unit Testing
- Testing with Vitest
- Testing different features

## Scenario
Imagine you are working for a group messaging application. The key feature that needs to be added is to both display the users in the group chat and to be able to change the online status of the user. The company also wants you to build a test suite for each of these features.

- Build test suite for display functionality
- Build display for users as well as their online status
- Build test suite for change functionality
- Build editing functionality to change the online status of a user

## Tools and Resources
- Testing Library: [https://testing-library.com/](https://testing-library.com/)

## Instructions

### Set Up
Before we begin coding, let's complete the initial setup for this lesson:

#### Fork and Clone
1. Go to the provided GitHub repository link.
2. Fork the repository to your GitHub account.
3. Clone the forked repository to your local machine.

#### Open and Run File
1. Open the project in VSCode.
2. Run `npm install` to install all necessary dependencies.

## Instructions

### Task 1: Define the Problem
The user should be able to:
- See other users
- Change any user's status
- The company wants a testing suite for each of these features

### Task 2: Determine the Design
- Determine if we need to expand the component tree.
- Determine where to implement new hooks, state, or props.

### Task 3: Develop, Test, and Refine the Code

#### Step 1: Create a Feature Branch
```sh
git checkout -b feature-testing
```

#### Step 2: Start the Server
Run json-server to serve our API:
```sh
npm run server
```
This will run the server on `http://localhost:6001`. Open `http://localhost:6001/users` in your browser and review the existing data structure.

Now, start the React app:
```sh
npm run dev
```
Visit `http://localhost:5173`—you should see the application running.
Take a moment to familiarize yourself with the application and components.

#### Step 3: Testing Users Display - Folder Creation
Before the functionality of the code is complete, we want to first build out our test suite.

**Folder Structure:**
```
src/
└── __tests__/
    ├── App.test.jsx
    ├── setup.jsx
    └── test_suites/
        ├── ChangeStatus.test.jsx
        └── DisplayUsers.test.jsx
```

#### Step 4: Testing Users Display - Setup
Update `setup.jsx`:
```js
import { afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom/vitest'
import fetch from 'node-fetch';

global.fetch = fetch

global.baseUsers = [
    {
      "id": 1,
      "name": "theGrey",
      "profile_image": "./images/theGrey.jpg",
      "status": "Online"
    },
    {
      "id": 2,
      "name": "fr0d0",
      "profile_image": "./images/fr0d0.jpg",
      "status": "Away"
    },
    {
      "id": 3,
      "name": "bor0mir123",
      "profile_image": "./images/bor0mir123.jpg",
      "status": "Offline"
    },
    {
      "id": 4,
      "name": "elf-friend",
      "profile_image": "./images/elf-friend.jpg",
      "status": "Online"
    },
    {
      "id": 5,
      "name": "legolas",
      "profile_image": "./images/legolas.jpg",
      "status": "Online"
    }
]

global.setFetchResponse = (val) => {
    global.fetch = vi.fn(() => Promise.resolve({
        json: () => Promise.resolve(val),
        ok: true,
        status: 200
    }))
}

afterEach(() => {
    cleanup();
})
```

Update `App.test.jsx`:
```js
import './test_suites/DisplayUsers.test'
import './test_suites/ChangeStatus.test'
```

#### Step 5: Testing Users Display - Testing
Update `DisplayUsers.test.jsx`:
```js
import React from 'react';	
import { render } from '@testing-library/react';
import App from '../../components/App';
import '@testing-library/jest-dom';

describe('Our app will', () => {
  test('displays all users on startup', async () => {
    global.setFetchResponse(global.baseUsers)
    let { findAllByTestId } = render(<App />);
    const userItems = await findAllByTestId('user-item');
    expect(userItems).toHaveLength(global.baseUsers.length);

    const userNames = userItems.map((item) => item.querySelector('h4').textContent);
    const baseUsersNames = global.baseUsers.map((user) => user.name);
    expect(userNames).toEqual(baseUsersNames);

    const userProfileImage = userItems.map((item) => item.querySelector('.inline-block-child.profile-image').src.split('/')[-1]);
    const baseUserProfileImages = global.baseUsers.map((user) => user.profile_image.split('/')[-1]);
    expect(userProfileImage).toEqual(baseUserProfileImages);

    const userStatus = userItems.map((item) => item.querySelector('p').textContent);
    const baseUserStatus = global.baseUsers.map((user) => user.status);
    expect(userStatus).toEqual(baseUserStatus);
  });
})
```

#### Step 6: Testing Users Display - Build out functionality
Update `App.jsx`:
```js
import { useState, useEffect } from 'react'
import UserList from './UserList'


function App() {
  const [users, setUsers] = useState([])

  useEffect(()=>{
    fetch('http://localhost:6001/users')
    .then(r => r.json())
    .then(data => setUsers(data))
  },[])

  return (
    <div>
      <UserList users={users}/>
    </div>
  )
}

export default App
```

Commit changes:
```sh
git commit -am "render items on page load"
```

#### Step 7: Testing Status Editing - Testing
Update `ChangeStatus.test.jsx`:
```js
import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import App from '../../components/App';
import '@testing-library/jest-dom';

describe('Our App will', () => {
    test('edit the status of the user', async () => {
        global.setFetchResponse(global.baseUsers)
        const { findAllByTestId } = render(<App />)
        const statusButtons = await findAllByTestId('status-item')
        global.setFetchResponse({id: 1, name: 'theGrey', profile_image: './images/theGrey.jpg', "status": "Offline"})
        fireEvent.click(statusButtons[0])
        expect(fetch).toHaveBeenCalledWith("http://localhost:6001/users/1", {
            method: "patch",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({id: 1, name: 'theGrey', profile_image: './images/theGrey.jpg', "status": "Offline"}),
        })
        const profiles = await findAllByTestId('user-item')
        const changedProfile = profiles[0]
        const status = changedProfile.querySelector("p").textContent
        await waitFor(() => {
            expect(status).toBe("Offline");
        });
    });
})
```

#### Step 8: Testing Status Editing - Build out functionality
Update `App.jsx`:
```js
import { useState, useEffect } from 'react'
import UserList from './UserList'


function App() {
  const [users, setUsers] = useState([])

  useEffect(()=>{
    fetch('http://localhost:6001/users')
    .then(r => r.json())
    .then(data => setUsers(data))
  },[])

  function changeStatus(updatedUser){
    fetch(`http://localhost:6001/users/${updatedUser.id}`,{
      method: "patch",
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
```
Update `UserList.jsx`:
```js
import React, { useState } from "react";

function UserList({users,changeStatus}) {
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
                    <p data-testid="status-item" className="inline-block-child" onClick={() => handleClick(user)}>{user.status}</p>
                </div>
            </div>
        ))
      }
    </ul>
  );
}

export default UserList;
```

Commit changes:
```sh
git commit -am "add edit user functionality to the user object"
```

#### Step 9: Push changes to GitHub and Merge Branches
```sh
git push origin feature-testing
git checkout main
git pull origin main
git branch -d feature-testing
```

## Task 4: Document and Maintain
- Add comments to code.
- Update README.
- Remove unnecessary/commented-out code.
- Ensure `vite.config.js` connects with tests.
- Research different testing methods if unsure.

---
This guide ensures proper implementation and testing using Vitest. 🚀

