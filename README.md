# Tech Connect

Tech Connect is a modern, responsive web application designed for users to share posts, connect with friends, and chat in real-time. Built with a sleek user interface, it features dark and light modes, smooth micro-animations, and a robust social feed.

## Features
- **User Authentication**: Secure sign up and login with email & password, plus OTP verification logic via Nodemailer.
- **Dynamic Feed**: Browse all posts, sort by most liked or most commented, and filter through search.
- **Post Sharing**: Share your thoughts with text and image uploads.
- **Social Interaction**: Like and comment on posts. Follow and unfollow other users.
- **Real-Time Chat**: Search for users and start a chat. Messages are polled in the background to feel like real-time communication.
- **Profile Customization**: View follower/following counts, see a user's recent posts, and personalize your own profile.
- **Responsive Design**: Tailored experiences for both desktop (sidebars) and mobile devices (bottom navigation).
- **Theming**: Instantly switch between Light and Dark mode globally.

## Tech Stack
- **Frontend**: React.js (Vite), React Router, Context API
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **Styling**: Vanilla CSS with modern grid/flexbox layouts and CSS Variables.

## Running Locally

### 1. Prerequisites
- Node.js (v18+ recommended)
- A running MongoDB instance or MongoDB Atlas cluster URI
- SMTP Credentials (if using the email OTP features)

### 2. Backend Setup
1. Navigate to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file based on `.env.example` and populate your secrets (like `MONGO_URI`, `JWT_SECRET`, `SMTP_USER`, etc.).
4. Start the server: `npm run dev` (Runs on port 5000)

### 3. Frontend Setup
1. Navigate to the `frontend` folder: `cd frontend`
2. Install dependencies: `npm install`
3. Start the Vite dev server: `npm run dev` (Runs on port 5174)

## Architecture Overview
- The **Frontend** uses a centralized layout wrapper (`page-shell`) to manage the layout dynamically across routes. The `AuthContext` provides global user state, and `ThemeContext` provides global light/dark mode configuration.
- The **Backend** exposes RESTful endpoints separated into domains (`auth.js`, `posts.js`, `users.js`, `messages.js`). It securely handles password hashing using `bcryptjs` and session tokens using `jsonwebtoken`. Image uploads are supported via `multer`.
