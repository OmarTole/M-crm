const express = require('express');
const db = require('../db');
const router = express.Router();

// Получение всех событий
router.get('/', (req, res) => {
    db.all("SELECT * FROM events", (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ events: rows });
    });
});

// Добавление нового события
router.post('/', (req, res) => {
    const { name } = req.body;
    db.run("INSERT INTO events (name) VALUES (?)", [name], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID });
    });
});

// Удаление события
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM events WHERE id = ?", id, function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

module.exports = router;
