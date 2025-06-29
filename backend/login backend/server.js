const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/userAuth', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});

const User = mongoose.model('User', userSchema);

// Configure Nodemailer
const transporter = nodemailer.createTransport({
    service: 'Gmail', // Use your email service provider
    auth: {
        user: process.env.EMAIL, // Email address (from .env)
        pass: process.env.EMAIL_PASSWORD, // Email password (from .env)
    },
});

// Sign-Up Endpoint
app.post('/api/auth/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save the new user to the database
        const newUser = new User({ name, email, password: hashedPassword });
        await newUser.save();

        // Send a welcome email
        const mailOptions = {
            from: process.env.EMAIL, // Sender's email
            to: email, // Recipient's email
            subject: `Welcome to Our Service, ${name}!`,
            html: `
                <html>
                    <body style="font-family: 'Nunito', sans-serif; background-color: #F5F5F5; padding: 20px; margin: 0;">
                        <div style="max-width: 600px; margin: auto; background-color: #FFFFFF; border: 1px solid #E6E6E6; border-radius: 12px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); overflow: hidden;">
                            <div style="background-color: #86B817; padding: 20px; text-align: center; color: #FFFFFF;">
                                <h2 style="margin: 0; font-weight: 700;">Welcome, ${name}!</h2>
                                <p style="margin: 0; font-size: 16px;">We’re excited to have you on board!</p>
                            </div>
                            <div style="padding: 30px;">
                                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                                    Thank you for creating an account with us. You’ve taken the first step towards an amazing experience.
                                </p>
                                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                                    Here’s how to get started:
                                </p>
                                <ul style="font-size: 16px; color: #555; line-height: 1.8; padding-left: 20px;">
                                    <li><strong>Complete your profile:</strong> Personalize your account for a tailored experience.</li>
                                    <li><strong>Explore our services:</strong> Discover a world of opportunities and exciting features.</li>
                                    <li><strong>Exclusive offers:</strong> Unlock deals and rewards available only to our members.</li>
                                </ul>
                                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                                    For any questions, feel free to <a href="mailto:support@yourservice.com" style="color: #FE8800; text-decoration: none;">contact us</a>. We’re here to help!
                                </p>
                                <p style="font-size: 16px; color: #555; line-height: 1.6;">
                                    Welcome again to our community, ${name}. Let’s embark on this exciting journey together!
                                </p>
                            </div>
                            <div style="text-align: center; padding: 20px; background-color: #F5F5F5;">
                                <p style="margin: 0; font-size: 14px; color: #777;">Best regards,</p>
                                <p style="margin: 0; font-size: 16px; color: #555; font-weight: 700;">The Team</p>
                            </div>
                            <footer style="text-align: center; padding: 15px; background-color: #14141F; color: #FFFFFF; font-size: 12px;">
                                <p style="margin: 0;">If you did not create this account, please ignore this email.</p>
                                <p style="margin: 0;">&copy; 2025 Your Service. All rights reserved.</p>
                            </footer>
                        </div>
                    </body>
                </html>
            `,
        };
        
            
        
        
        
        

        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                console.error('Failed to send welcome email:', err);
                res.status(500).json({ error: 'Failed to send welcome email' });
            } else {
                console.log('Welcome email sent:', info.response);
                res.status(201).json({ message: 'User registered successfully!' });
            }
        });
        

        res.status(201).json({ message: 'User registered successfully!' });
    } catch (err) {
        if (err.code === 11000) {
            res.status(400).json({ error: 'Email already exists!' });
        } else {
            res.status(500).json({ error: 'Server error' });
        }
    }
});

// Sign-In Endpoint
app.post('/api/auth/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ error: 'Invalid email or password' });

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(401).json({ error: 'Invalid email or password' });

        res.status(200).json({ message: 'Login successful!' });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
