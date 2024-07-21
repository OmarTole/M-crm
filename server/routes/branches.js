// const express = require('express');
// const db = require('../db');
// const bcrypt = require('bcrypt');
// const router = express.Router();

// // Получение всех филиалов
// router.get('/', (req, res) => {
//     db.all("SELECT * FROM branches", (err, rows) => {
//         if (err) {
//             console.error("Ошибка получения филиалов:", err);
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({ branches: rows });
//     });
// });

// // Получение уникальных городов
// router.get('/cities', (req, res) => {
//     db.all("SELECT DISTINCT city FROM branches", (err, rows) => {
//         if (err) {
//             console.error("Ошибка получения городов:", err);
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         const cities = rows.map(row => row.city);
//         res.json({ cities });
//     });
// });

// // Добавление нового филиала
// router.post('/', async (req, res) => {
//     const { directorName, contact, city, password } = req.body;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         db.run("INSERT INTO branches (directorName, contact, city, password) VALUES (?, ?, ?, ?)",
//             [directorName, contact, city, hashedPassword],
//             function (err) {
//                 if (err) {
//                     console.error("Ошибка добавления филиала:", err);
//                     res.status(500).json({ error: err.message });
//                     return;
//                 }
//                 res.json({ id: this.lastID });
//             }
//         );
//     } catch (error) {
//         console.error("Ошибка хеширования пароля:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Обновление информации о филиале
// router.put('/:id', async (req, res) => {
//     const { directorName, contact, city, password } = req.body;
//     const { id } = req.params;
//     try {
//         const hashedPassword = await bcrypt.hash(password, 10);
//         db.run("UPDATE branches SET directorName = ?, contact = ?, city = ?, password = ? WHERE id = ?",
//             [directorName, contact, city, hashedPassword, id],
//             function (err) {
//                 if (err) {
//                     console.error("Ошибка обновления филиала:", err);
//                     res.status(500).json({ error: err.message });
//                     return;
//                 }
//                 res.json({ updatedID: id });
//             }
//         );
//     } catch (error) {
//         console.error("Ошибка хеширования пароля:", error);
//         res.status(500).json({ error: error.message });
//     }
// });

// // Удаление филиала
// router.delete('/:id', (req, res) => {
//     const { id } = req.params;
//     db.run("DELETE FROM branches WHERE id = ?", [id], function (err) {
//         if (err) {
//             console.error("Ошибка удаления филиала:", err);
//             res.status(500).json({ error: err.message });
//             return;
//         }
//         res.json({ deletedID: id });
//     });
// });

// module.exports = router;


const express = require('express');
const db = require('../db');
const bcrypt = require('bcrypt');
const router = express.Router();
const { authenticateToken } = require('../middlwares/auths');

// Получение всех филиалов
router.get('/', authenticateToken, (req, res) => {
    db.all("SELECT * FROM branches", (err, rows) => {
        if (err) {
            console.error("Ошибка получения филиалов:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ branches: rows });
    });
});

// Получение уникальных городов
router.get('/cities', authenticateToken, (req, res) => {
    db.all("SELECT DISTINCT city FROM branches", (err, rows) => {
        if (err) {
            console.error("Ошибка получения городов:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        const cities = rows.map(row => row.city);
        res.json({ cities });
    });
});

// Добавление нового филиала
router.post('/', authenticateToken, async (req, res) => {
    const { directorName, contact, city, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        db.run("INSERT INTO branches (directorName, contact, city, password) VALUES (?, ?, ?, ?)",
            [directorName, contact, city, hashedPassword],
            function (err) {
                if (err) {
                    console.error("Ошибка добавления филиала:", err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                res.json({ id: this.lastID });
            }
        );
    } catch (error) {
        console.error("Ошибка хеширования пароля:", error);
        res.status(500).json({ error: error.message });
    }
});

// Обновление информации о филиале (только пароль)
router.put('/:id', authenticateToken, async (req, res) => {
    const { password } = req.body;
    const { id } = req.params;
    try {
        if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            db.run("UPDATE branches SET password = ? WHERE id = ?",
                [hashedPassword, id],
                function (err) {
                    if (err) {
                        console.error("Ошибка обновления филиала:", err);
                        res.status(500).json({ error: err.message });
                        return;
                    }
                    res.json({ updatedID: id });
                }
            );
        } else {
            res.status(400).json({ error: "Password is required" });
        }
    } catch (error) {
        console.error("Ошибка хеширования пароля:", error);
        res.status(500).json({ error: error.message });
    }
});

// Удаление филиала
router.delete('/:id', authenticateToken, (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM branches WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Ошибка удаления филиала:", err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deletedID: id });
    });
});

module.exports = router;
