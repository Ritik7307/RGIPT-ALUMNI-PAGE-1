# QUICK EMAIL SETUP - DO THIS NOW!

## Step 1: Get Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
2. Sign in with your Gmail account
3. Select "Mail" and "Other (Custom name)"
4. Type "RGIPT Alumni Portal"
5. Click "Generate"
6. Copy the 16-character password (like: abcd efgh ijkl mnop)

## Step 2: Create .env File

Create a file named `.env` in this folder with this content:

```
PORT=3000
EMAIL_USER=your-actual-gmail@gmail.com
EMAIL_PASSWORD=the-16-character-password-you-copied-above
ADMIN_EMAIL=24mc3040@rgipt.ac.in
```

Replace:

- `your-actual-gmail@gmail.com` with your real Gmail
- `the-16-character-password-you-copied-above` with the password from step 1

## Step 3: Restart Server

After creating .env file, restart the server by running:

```
node simple-server.js
```

Then try submitting the form again - emails will be sent!
