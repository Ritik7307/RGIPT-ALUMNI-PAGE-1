const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));

// Database setup
mongoose.connect('mongodb://localhost:27017/rgipt-alumni', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('✓ MongoDB connected successfully'))
.catch(err => console.error('✗ MongoDB connection error:', err.message));

// Configure multer for file uploads
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

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only image files are allowed'));
        }
    }
});

// Simpler email setup - you'll configure this later
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER || 'your-email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'your-password'
    }
});

const sendEmail = async (to, subject, html) => {
    try {
        console.log(`📧 Attempting to send email to ${to}...`);
        await transporter.sendMail({
            from: process.env.EMAIL_USER || 'your-email@gmail.com',
            to: to,
            subject: subject,
            html: html
        });
        console.log(`✓ Email sent successfully to ${to}`);
    } catch (error) {
        console.error(`✗ Error sending email to ${to}:`, error.message);
        throw error;
    }
};

// Database Schemas
const alumniSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passingYear: { type: String, required: true },
    branch: { type: String, required: true },
    linkedin: { type: String, required: true },
    photo: { type: String },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    createdAt: { type: Date, default: Date.now }
});

const contributionSchema = new mongoose.Schema({
    donationType: { type: String, required: true },
    transactionId: { type: String, required: true },
    amount: { type: Number, required: true },
    designatedFund: { type: String },
    fullName: { type: String },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    pan: { type: String },
    batch: { type: String },
    branch: { type: String, required: true },
    employer: { type: String },
    suggestions: { type: String },
    mailingList: { type: Boolean, default: false },
    notified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
});

const Alumni = mongoose.model('Alumni', alumniSchema);
const Contribution = mongoose.model('Contribution', contributionSchema);

// API Routes

// Alumni Registration
app.post('/api/alumni/register', upload.single('photo'), async (req, res) => {
    try {
        const { name, email, passingYear, branch, linkedin } = req.body;
        const photo = req.file ? `/uploads/profiles/${req.file.filename}` : null;
        const verificationToken = Math.random().toString(36).substring(7) + Date.now().toString(36);

        // Check if alumni already exists
        const existingAlumni = await Alumni.findOne({ email });
        if (existingAlumni) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        const newAlumni = new Alumni({
            name,
            email,
            passingYear,
            branch,
            linkedin,
            photo: photo || `https://i.pravatar.cc/150?u=${email}`,
            verificationToken
        });

        await newAlumni.save();
        console.log(`✓ New alumni registered: ${name} (${email})`);

        // Email to user
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0369a1;">Welcome to RGIPT Alumni Portal!</h2>
                <p>Dear ${name},</p>
                <p>Thank you for registering with the RGIPT Alumni Directory. Your profile has been submitted successfully.</p>
                <p>Your profile is currently pending verification by our administrative team. Once verified, your profile will be visible on the alumni directory.</p>
                <p>We will notify you via email once your profile is verified.</p>
                <br>
                <p>Best regards,<br>RGIPT Alumni Association</p>
            </div>
        `;

        // Email to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Alumni Registration - Verification Required</h2>
                <p>A new alumni has registered on the portal. Please verify their credentials:</p>
                <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Passing Year:</strong> ${passingYear}</p>
                    <p><strong>Branch:</strong> ${branch}</p>
                    <p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>
                </div>
                <p>Please log in to the admin panel to verify this alumni.</p>
                <br>
                <p>Profile ID: ${newAlumni._id}</p>
            </div>
        `;

        // Send emails
        const adminEmail = '24mc3040@rgipt.ac.in';
        
        try {
            await sendEmail(email, 'RGIPT Alumni Registration - Verification Pending', userEmailHtml);
        } catch (e) {
            console.log('Note: Email to user not sent - configure email in .env');
        }
        
        try {
            await sendEmail(adminEmail, 'New Alumni Registration - Action Required', adminEmailHtml);
        } catch (e) {
            console.log('Note: Email to admin not sent - configure email in .env');
        }

        res.json({ 
            message: 'Registration successful. Please check your email for confirmation.',
            alumni: newAlumni 
        });
    } catch (error) {
        console.error('Error registering alumni:', error);
        res.status(500).json({ error: 'Failed to register alumni' });
    }
});

// Get all verified alumni
app.get('/api/alumni', async (req, res) => {
    try {
        const alumni = await Alumni.find({ isVerified: true }).sort({ createdAt: -1 });
        res.json(alumni);
    } catch (error) {
        console.error('Error fetching alumni:', error);
        res.status(500).json({ error: 'Failed to fetch alumni' });
    }
});

// Admin route to verify alumni
app.post('/api/alumni/verify/:id', async (req, res) => {
    try {
        const alumni = await Alumni.findById(req.params.id);
        if (!alumni) {
            return res.status(404).json({ error: 'Alumni not found' });
        }

        alumni.isVerified = true;
        await alumni.save();

        // Send verification confirmation email
        const confirmEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #059669;">Profile Verified Successfully!</h2>
                <p>Dear ${alumni.name},</p>
                <p>Great news! Your alumni profile has been verified by our administrative team.</p>
                <p>Your profile is now visible on the RGIPT Alumni Directory. You can view it at our website.</p>
                <br>
                <p>Thank you for being part of the RGIPT community!</p>
                <br>
                <p>Best regards,<br>RGIPT Alumni Association</p>
            </div>
        `;

        try {
            await sendEmail(alumni.email, 'RGIPT Alumni Profile Verified', confirmEmailHtml);
        } catch (e) {
            console.log('Note: Verification email not sent - configure email in .env');
        }

        res.json({ message: 'Alumni verified successfully', alumni });
    } catch (error) {
        console.error('Error verifying alumni:', error);
        res.status(500).json({ error: 'Failed to verify alumni' });
    }
});

// Get all pending alumni (for admin)
app.get('/api/alumni/pending', async (req, res) => {
    try {
        const alumni = await Alumni.find({ isVerified: false }).sort({ createdAt: -1 });
        res.json(alumni);
    } catch (error) {
        console.error('Error fetching pending alumni:', error);
        res.status(500).json({ error: 'Failed to fetch pending alumni' });
    }
});

// Contribution/Sponsor Form Submission
app.post('/api/contribution/submit', async (req, res) => {
    try {
        const contributionData = req.body;
        
        const newContribution = new Contribution(contributionData);
        await newContribution.save();
        console.log(`✓ New contribution received: ₹${contributionData.amount} from ${contributionData.email}`);

        // Email to user
        const userEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #0369a1;">Thank You for Your Contribution!</h2>
                <p>Dear ${contributionData.fullName || 'Valued Supporter'},</p>
                <p>Thank you for your generous contribution to RGIPT! Your support truly makes a difference.</p>
                <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p><strong>Transaction ID:</strong> ${contributionData.transactionId}</p>
                    <p><strong>Amount:</strong> ₹${contributionData.amount}</p>
                    <p><strong>Donation Type:</strong> ${contributionData.donationType === 'anonymous' ? 'Anonymous' : 'With Recognition'}</p>
                </div>
                <p>We have received your contribution details. Our team will process this shortly and you will receive a confirmation receipt.</p>
                <br>
                <p>Best regards,<br>RGIPT Alumni Association</p>
            </div>
        `;

        // Email to admin
        const adminEmailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">New Contribution Received</h2>
                <p>A new contribution has been submitted on the portal:</p>
                <div style="background-color: #f9fafb; padding: 20px; margin: 20px 0; border-radius: 8px;">
                    <p><strong>Transaction ID:</strong> ${contributionData.transactionId}</p>
                    <p><strong>Amount:</strong> ₹${contributionData.amount}</p>
                    <p><strong>Donation Type:</strong> ${contributionData.donationType === 'anonymous' ? 'Anonymous' : 'With Recognition'}</p>
                    <p><strong>Name:</strong> ${contributionData.fullName || 'Anonymous'}</p>
                    <p><strong>Email:</strong> ${contributionData.email}</p>
                    <p><strong>Phone:</strong> ${contributionData.phone}</p>
                    <p><strong>Batch:</strong> ${contributionData.batch || 'N/A'}</p>
                    <p><strong>Branch:</strong> ${contributionData.branch}</p>
                    ${contributionData.pan ? `<p><strong>PAN:</strong> ${contributionData.pan}</p>` : ''}
                    <p><strong>Designated Fund:</strong> ${contributionData.designatedFund || 'General'}</p>
                </div>
                <p>Please process this contribution and send the receipt to the donor.</p>
            </div>
        `;

        // Send emails
        const adminEmail = '24mc3040@rgipt.ac.in';
        
        try {
            await sendEmail(contributionData.email, 'Thank You for Your Contribution to RGIPT!', userEmailHtml);
        } catch (e) {
            console.log('Note: Email to donor not sent - configure email in .env');
        }
        
        try {
            await sendEmail(adminEmail, 'New Contribution Received - Action Required', adminEmailHtml);
        } catch (e) {
            console.log('Note: Email to admin not sent - configure email in .env');
        }

        newContribution.notified = true;
        await newContribution.save();

        res.json({ 
            message: 'Contribution submitted successfully. Thank you for your support!',
            contribution: newContribution 
        });
    } catch (error) {
        console.error('Error submitting contribution:', error);
        res.status(500).json({ error: 'Failed to submit contribution' });
    }
});

// Get all contributions (for admin)
app.get('/api/contribution/all', async (req, res) => {
    try {
        const contributions = await Contribution.find().sort({ createdAt: -1 });
        res.json(contributions);
    } catch (error) {
        console.error('Error fetching contributions:', error);
        res.status(500).json({ error: 'Failed to fetch contributions' });
    }
});

// Serve admin panel
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Serve static files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Serve other static files
app.use(express.static(__dirname));

app.listen(PORT, () => {
    console.log('========================================');
    console.log('✓ RGIPT Alumni Portal Server Running');
    console.log('========================================');
    console.log(`📍 Local:    http://localhost:${PORT}`);
    console.log(`📍 Admin:    http://localhost:${PORT}/admin`);
    console.log('========================================');
    console.log('⚠ Note: Configure .env file for email');
    console.log('========================================');
});


