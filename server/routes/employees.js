const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('../middlwares/auths');

// Получение всех сотрудников
router.get('/', authenticateToken, (req, res) => {
    const city = req.user.role === 'admin' ? '%' : req.user.city;
    const name = req.query.name ? `%${req.query.name}%` : '%';

    db.all("SELECT * FROM employees WHERE city LIKE ? AND name LIKE ?", [city, name], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ employees: rows });
    });
});

// Получение данных сотрудника по имени
router.get('/name/:name', authenticateToken, (req, res) => {
    const { name } = req.params;
    db.get("SELECT * FROM employees WHERE name = ?", [name], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (!row) {
            res.status(404).json({ error: "Employee not found" });
            return;
        }
        res.json({ employee: row });
    });
});

// Получение заказов для конкретного сотрудника по имени
router.get('/orders/:employeeName', authenticateToken, (req, res) => {
    const { employeeName } = req.params;
    const userRole = req.user.role; // Предполагаем, что роль пользователя доступна в токене
    const userCity = req.user.city; // Предполагаем, что город пользователя доступен в токене

    let query = "SELECT * FROM orders";
    let params = [];

    if (userRole === 'animator' || userRole === 'admin') {
        query += " WHERE characters LIKE ?";
        params.push(`%"employee":"${employeeName}"%`);
    } else if (userRole === 'director') {
        query += " WHERE city = ? AND characters LIKE ?";
        params.push(userCity, `%"employee":"${employeeName}"%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        const filteredOrders = rows.filter(order => {
            const characters = JSON.parse(order.characters);
            return characters.some(character => character.employee === employeeName);
        });

        res.json({ orders: filteredOrders });
    });
});


// Добавление нового сотрудника
router.post('/', authenticateToken, async (req, res) => {
    const { name, userName, phone, birthday, city, password } = req.body;
    const role = 'animator'; // Установите роль по умолчанию как 'animator'

    // Проверка на латинские символы
    if (!/^[a-zA-Z]+$/.test(name)) {
        return res.status(400).json({ error: 'Имя должно содержать только латинские буквы.' });
    }

    // Преобразование имени в нижний регистр
    const lowerCaseName = name.toLowerCase();

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO employees (name, userName, phone, birthday, city, role, password) VALUES (?, ?, ?, ?, ?, ?, ?)", 
            [lowerCaseName, userName, phone, birthday, city, role, hashedPassword], 
            function(err) {
                if (err) {
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: this.lastID });
            }
        );
    } catch (error) {
        res.status(500).json({ error: "Error hashing password" });
    }
});

// Получение данных сотрудника по имени для проверки
router.get('/check-name/:name', authenticateToken, (req, res) => {
    const { name } = req.params;
    db.get("SELECT * FROM employees WHERE LOWER(name) = ?", [name.toLowerCase()], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ exists: !!row });
    });
});

// Удаление сотрудника
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM employees WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

// Обновление сотрудника
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { userName, phone, birthday } = req.body;

    db.run("UPDATE employees SET userName = ?, phone = ?, birthday = ? WHERE id = ?", 
        [userName, phone, birthday, id], 
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ updatedID: id });
        }
    );
});

module.exports = router;
