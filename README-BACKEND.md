# RGIPT Alumni Portal - Backend Setup

## Installation

1. Install Node.js dependencies:

```bash
npm install
```

2. Set up environment variables:

Create a `.env` file in the root directory with the following variables:

```
PORT=3000
MONGODB_URI=mongodb://localhost:27017/rgipt-alumni
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=24mc3040@rgipt.ac.in
```

3. Install MongoDB (if not already installed):

- Download from: https://www.mongodb.com/try/download/community
- Or use MongoDB Atlas (cloud): https://www.mongodb.com/cloud/atlas

4. Start the server:

```bash
npm start
```

Or for development with auto-restart:

```bash
npm run dev
```

## API Endpoints

### Alumni

- `POST /api/alumni/register` - Register new alumni
- `GET /api/alumni` - Get all verified alumni
- `GET /api/alumni/pending` - Get pending alumni (admin)
- `POST /api/alumni/verify/:id` - Verify alumni (admin)

### Contribution

- `POST /api/contribution/submit` - Submit contribution
- `GET /api/contribution/all` - Get all contributions (admin)

## Email Configuration

For Gmail:

1. Enable 2-factor authentication
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Use the app password in EMAIL_PASSWORD

## Deployment

For production deployment, consider using:

- MongoDB Atlas for database
- Environment variables in hosting platform
- SSL certificate for secure connections
