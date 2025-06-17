# README.md

# Login and Registration Backend

This project is a backend application for handling user login and registration. It is built using TypeScript and Express.js.

## Features

- User registration
- User login
- Token-based authentication

## Project Structure

```
login-registration-backend
├── src
│   ├── app.ts                # Entry point of the application
│   ├── controllers           # Contains the authentication controller
│   │   ├── authController.ts
│   ├── routes                # Contains the authentication routes
│   │   ├── authRoutes.ts
│   ├── models                # Contains the user model
│   │   ├── userModel.ts
│   ├── middleware            # Contains middleware functions
│   │   └── authMiddleware.ts
│   └── types                 # Contains TypeScript interfaces
│       └── index.ts
├── package.json              # NPM configuration file
├── tsconfig.json             # TypeScript configuration file
└── README.md                 # Project documentation
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```
   cd login-registration-backend
   ```

3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. The server will run on `http://localhost:3000`.

## API Endpoints

- **POST /register**: Register a new user
- **POST /login**: Authenticate a user and return a token

## License

This project is licensed under the MIT License.