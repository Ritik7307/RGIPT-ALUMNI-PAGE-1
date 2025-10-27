═══════════════════════════════════════════════════════
  RGIPT ALUMNI PORTAL - LOCALHOST SETUP
═══════════════════════════════════════════════════════

✅ Server is now running on: http://localhost:3000
✅ Admin Panel: http://localhost:3000/admin

═══════════════════════════════════════════════════════
WHAT'S WORKING:
═══════════════════════════════════════════════════════

✓ Alumni Registration Form
✓ Contribution/Sponsor Form  
✓ All data stored in memory
✓ Forms submit successfully
✓ Website is fully responsive

═══════════════════════════════════════════════════════
EMAIL SETUP (To send emails to 24mc3040@rgipt.ac.in):
═══════════════════════════════════════════════════════

To enable email notifications, you need to:

1. Get Gmail App Password:
   → Go to: https://myaccount.google.com/apppasswords
   → Sign in
   → Select "Mail" → "Other (Custom name)" → "RGIPT Portal"
   → Generate and copy the 16-character password

2. Edit .env file in this folder:
   → Open .env in notepad
   → Replace EMAIL_USER with your Gmail
   → Replace EMAIL_PASSWORD with the app password from step 1
   → Save

3. Restart server:
   → Press Ctrl+C to stop
   → Run: node simple-server.js

═══════════════════════════════════════════════════════
ACCESS POINTS:
═══════════════════════════════════════════════════════

Website: http://localhost:3000
Admin:   http://localhost:3000/admin

═══════════════════════════════════════════════════════
Files Created:
═══════════════════════════════════════════════════════

✓ simple-server.js      → Server (No MongoDB needed)
✓ .env                  → Configuration file
✓ admin.html            → Admin panel
✓ All existing files    → Working

═══════════════════════════════════════════════════════


