const express = require('express');
const router = express.Router();
const verifyToken = require('../middlewares/verifyToken');

router.get('/verifyauth', verifyToken, (req, res) => {
    res.json({
        message: 'User is authenticated',
        user: req.user
    });
});

module.exports = router;