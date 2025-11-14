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