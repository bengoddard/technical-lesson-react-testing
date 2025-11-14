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