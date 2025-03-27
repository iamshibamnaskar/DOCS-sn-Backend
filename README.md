# Backend API for DOCS-sn

## Prerequisites

- Node.js (v14 or higher)
- npm (Node Package Manager)
- Firebase Admin SDK credentials
- Google OAuth credentials

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
PORT=5000
JWT_SECRET=your_jwt_secret
CLIENT_ID=your_google_client_id
CLIENT_SECRET=your_google_client_secret
FIREBASE_CONFIG=your_firebase_config_json
```

### Environment Variables Explanation

- `PORT`: The port number on which the server will run (default: 5000)
- `JWT_SECRET`: Secret key for JWT token generation and verification
- `CLIENT_ID`: Google OAuth client ID
- `CLIENT_SECRET`: Google OAuth client secret
- `FIREBASE_CONFIG`: Firebase Admin SDK configuration JSON (stringified)

## Running the Application

### Development Mode
```bash
npm run dev
```
This will start the server with nodemon for automatic reloading during development.

### Production Mode
```bash
npm start
```

