const express = require('express');
const jwt = require('jsonwebtoken');
const admin = require('../firebaseAdmin');
const router = express.Router();

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET;

// POST /auth/google
router.post('/google', async (req, res) => {
    const { token } = req.body;
    if (!token) return res.status(400).json({ error: 'Token is required' });

    try {
        // Verify Firebase Token
        const decodedToken = await admin.auth().verifyIdToken(token);
        const { uid, email, name, picture } = decodedToken;

        // Generate JWT
        const jwtToken = jwt.sign({ uid, email, name, picture }, JWT_SECRET, {
            expiresIn: '7d',
        });

        res.json({ jwt: jwtToken });
    } catch (error) {
        console.error('Error verifying token:', error);
        res.status(401).json({ error: 'Invalid Firebase Token' });
    }
});

module.exports = router;
