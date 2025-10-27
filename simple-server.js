const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

// Store data in memory
let alumniList = [];
let contributionsList = [];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Configure multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = 'uploads/profiles';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'profile-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage, limits: { fileSize: 5 * 1024 * 1024 } });

// Load environment variables if .env exists
require('dotenv').config();

// Email setup
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-password'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: subject,
            html: html
        });
        console.log(`✓ Email sent to ${to}`);
    } catch (error) {
        console.log(`⚠ Email not sent to ${to} (configure email in .env)`);
    }
};

// ALUMNI REGISTRATION
app.post('/api/alumni/register', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, passingYear, branch, linkedin } = req.body;
        const photo = req.file ? `/uploads/profiles/${req.file.filename}` : null;
        
        const newAlumni = {
            _id: Date.now().toString(),
            name,
            email,
            passingYear,
            branch,
            linkedin,
            photo: photo || `https://i.pravatar.cc/150?u=${email}`,
            isVerified: false,
            createdAt: new Date()
        };
        
        alumniList.push(newAlumni);
        console.log(`✓ New alumni registered: ${name} (${email})`);

        // User email
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0369a1;">Welcome to RGIPT Alumni Portal!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for registering with the RGIPT Alumni Directory. Your profile has been submitted successfully.</p>
                <p>Your profile is currently pending verification. Once verified, it will be visible on the directory.</p>
                <br>
                <p>Best regards,<br>RGIPT Alumni Association</p>
            </div>
        `;

        // Admin email  
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Alumni Registration</h2>
                <p>A new alumni has registered:</p>
                <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Passing Year:</strong> ${passingYear}</p>
                    <p><strong>Branch:</strong> ${branch}</p>
                    <p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>
                </div>
                <p>Profile ID: ${newAlumni._id}</p>
            </div>
        `;

        await sendEmail(email, 'RGIPT Alumni Registration', userEmailHtml);
        await sendEmail('24mc3040@rgipt.ac.in', 'New Alumni Registration', adminEmailHtml);

        res.json({ message: 'Registration successful!', alumni: newAlumni });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to register' });
    }
});

// GET VERIFIED ALUMNI
app.get('/api/alumni', (req, res) => {
    const verifiedAlumni = alumniList.filter(a => a.isVerified);
    res.json(verifiedAlumni);
});

// GET PENDING ALUMNI
app.get('/api/alumni/pending', (req, res) => {
    const pendingAlumni = alumniList.filter(a => !a.isVerified);
    res.json(pendingAlumni);
});

// VERIFY ALUMNI
app.post('/api/alumni/verify/:id', async (req, res) => {
    const alumni = alumniList.find(a => a._id === req.params.id);
    if (alumni) {
        alumni.isVerified = true;
        await sendEmail(alumni.email, 'Profile Verified', `<p>Your profile is now verified!</p>`);
        res.json({ message: 'Alumni verified', alumni });
    } else {
        res.status(404).json({ error: 'Alumni not found' });
    }
});

// CONTRIBUTION SUBMIT
app.post('/api/contribution/submit', async (req, res) => {
    try {
        const contributionData = {
            ...req.body,
            _id: Date.now().toString(),
            createdAt: new Date()
        };
        
        contributionsList.push(contributionData);
        console.log(`✓ New contribution: ₹${contributionData.amount} from ${contributionData.email}`);

        // User email
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0369a1;">Thank You for Your Contribution!</h2>
                <p>Dear ${contributionData.fullName || 'Supporter'},</p>
                <p>Thank you for your contribution to RGIPT!</p>
                <p><strong>Amount:</strong> ₹${contributionData.amount}</p>
                <p><strong>Transaction ID:</strong> ${contributionData.transactionId}</p>
                <br>
                <p>Best regards,<br>RGIPT Alumni Association</p>
            </div>
        `;

        // Admin email
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Contribution Received</h2>
                <p><strong>Transaction ID:</strong> ${contributionData.transactionId}</p>
                <p><strong>Amount:</strong> ₹${contributionData.amount}</p>
                <p><strong>Email:</strong> ${contributionData.email}</p>
                <p><strong>Phone:</strong> ${contributionData.phone}</p>
            </div>
        `;

        await sendEmail(contributionData.email, 'Thank You for Your Contribution!', userEmailHtml);
        await sendEmail('24mc3040@rgipt.ac.in', 'New Contribution Received', adminEmailHtml);

        res.json({ message: 'Contribution submitted successfully!', contribution: contributionData });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to submit' });
    }
});

// GET ALL CONTRIBUTIONS
app.get('/api/contribution/all', (req, res) => {
    res.json(contributionsList);
});

// Serve static files
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'index.html')));
app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'admin.html')));
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log('========================================');
    console.log('✓ RGIPT Alumni Portal Server Running');
    console.log('========================================');
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📍 Admin: http://localhost:${PORT}/admin`);
    console.log('========================================');
});

