const verificationCodes = {};
const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/login', async (req, res) => {
    const { email } = req.body;

    // Your login logic here

    res.status(200).json({ message: 'Login endpoint hit!' });
});

app.post('/api/send-code', async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });

    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 haneli
    verificationCodes[email] = code;

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS
        }
    });

    const mailOptions = {
        from: `"TicketKing 👑" <${process.env.MAIL_USER}>`,
        to: email,
        subject: 'Your TicketKing Login Code',
        text: `Your TicketKing login code is: ${code}. It will expire in a few minutes.`
    };


    try {
        console.log('Trying to send email to:', email);
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
        res.status(200).json({ message: 'Email sent successfully!' });
    } catch (err) {
        console.error('Email send error:', err);
        res.status(500).json({ message: 'Email failed to send' });
    }


});
app.post('/api/verify-code', (req, res) => {
    const { email, code } = req.body;
    console.log(`Verification code for ${email}: ${code}`);

    if (!email || !code) {
        return res.status(400).json({ message: 'Email and code are required' });
    }

    const validCode = verificationCodes[email];

    if (validCode && code === validCode) {
        delete verificationCodes[email]; // kodu artık gerekmediği için sil
        return res.status(200).json({ message: 'Code verified successfully' });
    } else {
        return res.status(401).json({ message: 'Invalid or expired code' });
    }
});


app.listen(3002, () => {
    console.log('✅ Server running at http://localhost:3002');
});
