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