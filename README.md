# MLC Voter Enrollment Platform

A real-time graduate MLC election enrollment and management platform.

## Features
1. **Coordinator Mobile Web App**: A mobile-first interface for ground coordinators to enroll voters securely.
2. **Super Admin Dashboard**: A high-level control panel to manage the entire campaign, provision coordinators, and review enrollments.

## Prerequisites
- Node.js (v16+)
- PostgreSQL (`mlc_voter_db` must be configured, with credentials set in `index.js`)

## Running the Backend

The backend is built with Node.js and Express, connecting to a PostgreSQL database.

For production, set `NODE_ENV=production`, a random `JWT_SECRET` of at least 32 characters, and use the Supabase Session Pooler connection string on port `6543` with `pgbouncer=true`. The backend refuses a direct Supabase database URI in production.

1. Open a terminal.
2. Navigate to the project root:
   ```bash
   cd c:/Users/HP/Desktop/mlc-voter-app
   ```
3. Install backend dependencies (if not already installed):
   ```bash
   npm install
   ```
4. Start the backend server:
   ```bash
   node index.js
   ```
   The backend will run on `http://localhost:5000`.
