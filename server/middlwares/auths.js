const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        console.log(err); // Логирование ошибки для отладки
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

const authorizeRole = (...roles) => (req, res, next) => {
    if (!roles.includes(req.user.role)) {
        return res.sendStatus(403);
    }
    next();
};

const ensureAdminCreated = () => {
    const adminUser = {
        username: 'admin',
        password: 'admin_password',
        role: 'admin'
    };

    db.get("SELECT * FROM users WHERE username = ?", [adminUser.username], async (err, user) => {
        if (err) {
            console.error('Error checking admin existence:', err);
            return;
        }
        if (!user) {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            db.run("INSERT INTO users (username, password, role) VALUES (?, ?, ?)", [adminUser.username, hashedPassword, adminUser.role], (err) => {
                if (err) {
                    console.error('Error creating admin:', err);
                } else {
                    console.log('Admin user created');
                }
            });
        } else {
            console.log('Admin user already exists');
        }
    });
};

module.exports = { authenticateToken, authorizeRole, ensureAdminCreated };
