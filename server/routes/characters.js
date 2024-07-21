const express = require('express');
const db = require('../db');
const router = express.Router();
const { authenticateToken } = require('../middlwares/auths');

// Получение всех персонажей
router.get('/', authenticateToken, (req, res) => {
    db.all("SELECT * FROM characters", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ characters: rows });
    });
});

// Добавление нового персонажа
router.post('/', authenticateToken, (req, res) => {
    const { name } = req.body;

    db.run("INSERT INTO characters (name) VALUES (?)", [name], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Удаление персонажа
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM characters WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

// Изменение персонажа
router.put('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    db.run("UPDATE characters SET name = ? WHERE id = ?", [name, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updatedID: id });
    });
});

// Получение статистики по персонажам для обычных пользователей
router.get('/stats', authenticateToken, (req, res) => {
    const { searchTerm = '', startDate, endDate, city } = req.query;

    let characterQuery = "SELECT * FROM characters WHERE name LIKE ?";
    let characterParams = [`%${searchTerm}%`];

    let orderQuery = "SELECT characters.name, COUNT(orders.id) AS count FROM characters LEFT JOIN orders ON orders.characters LIKE '%' || characters.name || '%' WHERE orders.dateOrder BETWEEN ? AND ? AND orders.city = ? GROUP BY characters.name";
    let orderParams = [startDate || '1970-01-01', endDate || new Date().toISOString().split('T')[0], city];

    if (!startDate && !endDate) {
        orderQuery = "SELECT characters.name, 0 AS count FROM characters WHERE characters.name LIKE ?";
        orderParams = [`%${searchTerm}%`];
    }

    db.all(characterQuery, characterParams, (err, characters) => {
        if (err) {
            console.error('Error fetching characters:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        db.all(orderQuery, orderParams, (err, orderCounts) => {
            if (err) {
                console.error('Error fetching character stats:', err);
                res.status(500).json({ error: err.message });
                return;
            }

            const characterStats = characters.map(character => {
                const orderCount = orderCounts.find(order => order.name === character.name);
                return {
                    ...character,
                    count: orderCount ? orderCount.count : 0
                };
            });

            res.json({ characters: characterStats });
        });
    });
});

// Получение статистики по персонажам для админа (учитывает все города)
router.get('/stats/admin', authenticateToken, (req, res) => {
    const { searchTerm = '', startDate, endDate } = req.query;

    let characterQuery = "SELECT * FROM characters WHERE name LIKE ?";
    let characterParams = [`%${searchTerm}%`];

    let orderQuery = "SELECT characters.name, COUNT(orders.id) AS count FROM characters LEFT JOIN orders ON orders.characters LIKE '%' || characters.name || '%' WHERE orders.dateOrder BETWEEN ? AND ? GROUP BY characters.name";
    let orderParams = [startDate || '1970-01-01', endDate || new Date().toISOString().split('T')[0]];

    if (!startDate && !endDate) {
        orderQuery = "SELECT characters.name, 0 AS count FROM characters WHERE characters.name LIKE ?";
        orderParams = [`%${searchTerm}%`];
    }

    db.all(characterQuery, characterParams, (err, characters) => {
        if (err) {
            console.error('Error fetching characters:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        db.all(orderQuery, orderParams, (err, orderCounts) => {
            if (err) {
                console.error('Error fetching character stats:', err);
                res.status(500).json({ error: err.message });
                return;
            }

            const characterStats = characters.map(character => {
                const orderCount = orderCounts.find(order => order.name === character.name);
                return {
                    ...character,
                    count: orderCount ? orderCount.count : 0
                };
            });

            res.json({ characters: characterStats });
        });
    });
});



module.exports = router;