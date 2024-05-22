import express from 'express';

const router = express.Router();

router.get('/', (req, res) => {
    res.render(
        'forgotpassword', 
        {title: 'PasswordReset',
        style: '../css/login.css',
    });
});

export default router;