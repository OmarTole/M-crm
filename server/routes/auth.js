const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../db');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY || 'your_secret_key_here';

// Маршрут для аутентификации
router.post('/login', (req, res) => {
    const { directorName, password } = req.body;

    console.log("Полученные данные:", { directorName, password });

    db.get("SELECT * FROM branches WHERE directorName = ?", [directorName], async (err, user) => {
        if (err) {
            console.error("Ошибка при получении пользователя:", err);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (!user) {
            // Если пользователь не найден в таблице branches, проверяем таблицу employees
            db.get("SELECT * FROM employees WHERE name = ?", [directorName], async (err, employee) => {
                if (err) {
                    console.error("Ошибка при получении сотрудника:", err);
                    res.status(500).json({ error: "Internal server error" });
                    return;
                }

                if (!employee) {
                    console.log("Пользователь не найден");
                    res.status(401).json({ error: "Invalid credentials" });
                    return;
                }

                console.log("Найден сотрудник:", employee);

                const isPasswordValid = await bcrypt.compare(password, employee.password);
                if (!isPasswordValid) {
                    console.log("Неверный пароль");
                    res.status(401).json({ error: "Invalid credentials" });
                    return;
                }

                const token = jwt.sign({ id: employee.id, role: employee.role, name: employee.name, city: employee.city }, SECRET_KEY, { expiresIn: '1h' });
                res.json({ token, city: employee.city });
            });
        } else {
            console.log("Найден пользователь:", user);

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                console.log("Неверный пароль");
                res.status(401).json({ error: "Invalid credentials" });
                return;
            }

            const token = jwt.sign({ id: user.id, role: user.role, city: user.city }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token, city: user.city });
        }
    });
});

// Middleware для проверки аутентификации
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

module.exports = { router, authenticate };
