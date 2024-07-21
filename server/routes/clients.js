const express = require('express');
const db = require('../db');
const router = express.Router();
const { authenticateToken } = require('../middlwares/auths');

// Получение всех клиентов
router.get('/', authenticateToken, (req, res) => {
    const city = req.user.role === 'admin' ? '%' : req.user.city;

    db.all("SELECT * FROM clients WHERE city LIKE ?", [city], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ clients: rows });
    });
});

// Получение статистики клиентов
router.get('/stats', authenticateToken, (req, res) => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

    db.get("SELECT COUNT(id) AS totalClients FROM clients", (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        const totalClients = row.totalClients;

        db.get("SELECT COUNT(id) AS newClients FROM clients WHERE dateRegistr >= ?", [oneMonthAgoStr], (err, row) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            const newClients = row.newClients;
            res.json({ totalClients, newClients });
        });
    });
});

// Обновление клиента
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name, phoneNumber, birthday, orderQuantities, orderSumm, city } = req.body;
    db.run("UPDATE clients SET name = ?, phoneNumber = ?, birthday = ?, orderQuantities = ?, orderSumm = ?, city = ? WHERE id = ?", [name, phoneNumber, birthday, orderQuantities, orderSumm, city, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

module.exports = router;
