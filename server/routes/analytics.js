const express = require('express');
const db = require('../db');
// const { authenticateToken, authorizeRole } = require('../middlwares/auths');
const router = express.Router();

// Получение статистики клиентов
router.get('/clients/stats', (req, res) => {
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

// Получение расширенной статистики заказов
router.get('/orders/stats', async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

        const stats = {};

        const totalOrdersResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(id) AS totalOrders, SUM(summ) AS totalRevenue FROM orders", (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        stats.totalOrders = totalOrdersResult.totalOrders;
        stats.totalRevenue = totalOrdersResult.totalRevenue;

        const newOrdersResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(id) AS newOrders, SUM(summ) AS newRevenue FROM orders WHERE dateOrder >= ?", [oneMonthAgoStr], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        stats.newOrders = newOrdersResult.newOrders;
        stats.newRevenue = newOrdersResult.newRevenue;

        const avgCheckResult = await new Promise((resolve, reject) => {
            db.get("SELECT AVG(summ) AS avgCheck FROM orders", (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        stats.avgCheck = avgCheckResult.avgCheck;

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение статистики клиентов
router.get('/clients/stats/extended', async (req, res) => {
    try {
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        const oneMonthAgoStr = oneMonthAgo.toISOString().split('T')[0];

        const stats = {};

        const newSalesResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(id) AS newSales FROM orders WHERE dateOrder >= ?", [oneMonthAgoStr], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        stats.newSales = newSalesResult.newSales;

        const repeatSalesResult = await new Promise((resolve, reject) => {
            db.get("SELECT COUNT(id) AS repeatSales FROM orders WHERE dateOrder < ?", [oneMonthAgoStr], (err, row) => {
                if (err) reject(err);
                resolve(row);
            });
        });

        stats.repeatSales = repeatSalesResult.repeatSales;

        const topClientsResult = await new Promise((resolve, reject) => {
            db.all("SELECT nameClient, COUNT(id) AS ordersCount FROM orders GROUP BY nameClient ORDER BY ordersCount DESC LIMIT 3", (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        stats.topClients = topClientsResult;

        res.json(stats);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Получение статистики услуг
router.get('/services/stats', async (req, res) => {
    try {
        const topServicesResult = await new Promise((resolve, reject) => {
            db.all("SELECT program, COUNT(id) AS programCount FROM orders GROUP BY program ORDER BY programCount DESC", (err, rows) => {
                if (err) reject(err);
                resolve(rows);
            });
        });

        res.json({ topServices: topServicesResult });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
