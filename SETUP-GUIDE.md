# RGIPT Alumni Portal - Complete Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup MongoDB

#### Option A: Local MongoDB

- Download and install MongoDB from: https://www.mongodb.com/try/download/community
- Start MongoDB service

#### Option B: MongoDB Atlas (Cloud - Recommended)

- Sign up at: https://www.mongodb.com/cloud/atlas
- Create a free cluster
- Get connection string

### 3. Configure Email (Gmail)

1. Enable 2-factor authentication in your Gmail account
2. Generate an App Password: https://myaccount.google.com/apppasswords
3. Create a `.env` file in the project root:

```env
PORT=3000
MONGODB_URI=your-mongodb-connection-string
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=24mc3040@rgipt.ac.in
```

### 4. Start the Server

```bash
npm start
```

## Features Implemented

### ✅ Alumni Registration with Verification

- Alumni can register their profile
- Email sent to both registered email and admin email
- Profile appears only after admin verification
- Database stores all alumni information

### ✅ Contribution/Sponsor Form

- Form submission stored in database
- Email sent to donor and admin
- All contribution details captured

### ✅ Admin Panel

- Access at: `http://localhost:3000/admin`
- View pending alumni for verification
- View all contributions
- Verify alumni with one click

### ✅ Responsive Design

- Works on all devices (mobile, tablet, desktop)
- Uses Tailwind CSS for responsive design

## API Endpoints

### Alumni

- `POST /api/alumni/register` - Register new alumni
- `GET /api/alumni` - Get all verified alumni
- `GET /api/alumni/pending` - Get pending alumni (admin only)
- `POST /api/alumni/verify/:id` - Verify alumni (admin only)

### Contributions

- `POST /api/contribution/submit` - Submit contribution
- `GET /api/contribution/all` - Get all contributions (admin only)

## File Structure

```
rgipt-alumni-page/
├── server.js              # Backend server
├── package.json           # Dependencies
├── admin.html             # Admin panel
├── index.html             # Main website
├── script.js              # Frontend JavaScript
├── style.css              # Custom styles
├── uploads/               # Profile photos
│   └── profiles/          # Alumni photos
└── README-BACKEND.md      # Backend documentation
```

## How It Works

### Alumni Registration Flow

1. Alumni fills registration form and submits
2. Photo uploaded to server (stored in `uploads/profiles/`)
3. Email sent to alumni confirming registration (pending verification)
4. Email sent to admin with profile details for verification
5. Profile visible in directory only after admin verification
6. Upon verification, confirmation email sent to alumni

### Contribution Flow

1. Donor fills contribution form
2. Data stored in database
3. Email sent to donor with transaction details
4. Email sent to admin with all contribution information

## Deployment

### For Production:

1. Use environment variables for all sensitive data
2. Use MongoDB Atlas for cloud database
3. Configure email service (Gmail, SendGrid, etc.)
4. Deploy to platforms like Heroku, Vercel, or AWS

### Environment Variables:

```env
PORT=3000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/dbname
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
ADMIN_EMAIL=admin@rgipt.ac.in
```

## Troubleshooting

### Email Not Sending

- Check your Gmail app password is correct
- Ensure 2-factor authentication is enabled
- Check email credentials in `.env` file

### MongoDB Connection Error

- Verify MongoDB is running (for local)
- Check connection string format
- Ensure network access is allowed (for Atlas)

### Profile Photos Not Uploading

- Check `uploads/profiles/` directory exists
- Verify file permissions
- Check file size (max 5MB)

## Support

For issues or questions, contact the development team.
