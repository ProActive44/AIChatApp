# Real-Time Chat App Backend

## Authentication APIs

### Signup
- **POST** `/api/auth/signup`
- **Body:** `{ email, password, username }`
- **Response:** `{ token, user }`

### Login
- **POST** `/api/auth/login`
- **Body:** `{ email, password }`
- **Response:** `{ token, user }`

### Logout
- **POST** `/api/auth/logout`
- **Header:** `Authorization: Bearer <token>`
- **Response:** `{ message }`

## User Profile APIs

- **GET** `/api/user/profile`
- **PUT** `/api/user/profile`

## Tech Stack

- Node.js, Express, MongoDB, Socket.io, JWT, bcrypt

## Running Locally

```bash
npm install
npm run dev
```

## Running Tests

```bash
npm install
npm run test
```