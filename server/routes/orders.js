const express = require('express');
const db = require('../db');
const router = express.Router();
const { authenticateToken } = require('../middlwares/auths');

// Получение всех заказов
router.get('/', authenticateToken, (req, res) => {
    console.log('Received request to get all orders');
    const city = req.user.role === 'admin' ? '%' : req.user.city;

    db.all("SELECT * FROM orders WHERE city LIKE ?", [city], (err, rows) => {
        if (err) {
            console.error('Error fetching orders:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Orders fetched:', rows);
        res.json({ orders: rows });
    });
});

// Добавление нового заказа с проверкой клиента
router.post('/', (req, res) => {
    const { nameClient, phoneNumber, nameEvent, address, characters, summ, prepayment, note, dateOrder, timeOrder, dateRegistr, timeRegistr, status, city } = req.body;
    console.log('Received request to add new order:', req.body);

    db.get("SELECT * FROM clients WHERE phoneNumber = ?", [phoneNumber], (err, client) => {
        if (err) {
            console.error('Error fetching client:', err);
            res.status(500).json({ error: err.message });
            return;
        }

        const createOrder = () => {
            db.run("INSERT INTO orders (nameClient, phoneNumber, nameEvent, address, characters, summ, prepayment, note, dateOrder, timeOrder, dateRegistr, timeRegistr, status, city) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                [nameClient, phoneNumber, nameEvent, address, characters, summ, prepayment, note, dateOrder, timeOrder, dateRegistr, timeRegistr, status, city], 
                function (err) {
                if (err) {
                    console.error('Error adding order:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                console.log('New order added with ID:', this.lastID);
                res.json({ id: this.lastID });
            });
        };

        if (client) {
            const updatedOrderQuantities = client.orderQuantities + 1;
            const updatedOrderSumm = client.orderSumm + summ;
            console.log('Updating existing client:', client.id);
            db.run("UPDATE clients SET orderQuantities = ?, orderSumm = ?, city = ? WHERE id = ?", [updatedOrderQuantities, updatedOrderSumm, city, client.id], (err) => {
                if (err) {
                    console.error('Error updating client:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                createOrder();
            });
        } else {
            console.log('Creating new client');
            db.run("INSERT INTO clients (name, phoneNumber, birthday, orderQuantities, orderSumm, city) VALUES (?, ?, ?, ?, ?, ?)", [nameClient, phoneNumber, "", 1, summ, city], function (err) {
                if (err) {
                    console.error('Error adding client:', err);
                    res.status(500).json({ error: err.message });
                    return;
                }
                createOrder();
            });
        }
    });
});

// Получение заказов сегодня
router.get('/today', authenticateToken, (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    console.log('Received request to get today\'s orders');
    db.all("SELECT * FROM orders WHERE dateOrder = ?", [today], (err, rows) => {
        if (err) {
            console.error('Error fetching today\'s orders:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Today\'s orders fetched:', rows);
        res.json({ orders: rows });
    });
});


// Получение заказа по ID
router.get('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Received request to get order with ID: ${id}`);
    db.get("SELECT * FROM orders WHERE id = ?", [id], (err, row) => {
        if (err) {
            console.error('Error fetching order:', err);
            res.status(500).json({ error: 'Error fetching order' });
            return;
        }

        // Преобразование строки JSON обратно в массив объектов
        if (row && row.employees) {
            try {
                row.employees = JSON.parse(row.employees);
            } catch (e) {
                row.employees = [];
            }
        }

        console.log('Order fetched:', row);
        res.json(row);
    });
});

// Получение заказов для конкретного сотрудника по имени
router.get('/employee/:employeeName', authenticateToken, (req, res) => {
    const { employeeName } = req.params;
    const userRole = req.user.role; // Предполагаем, что роль пользователя доступна в токене
    const userCity = req.user.city; // Предполагаем, что город пользователя доступен в токене

    let query = "SELECT * FROM orders";
    let params = [];

    if (userRole === 'animator') {
        query += " WHERE employees LIKE ?";
        params.push(`%"employee":"${employeeName}"%`);
    } else if (userRole === 'director') {
        query += " WHERE city = ?";
        params.push(userCity);
    }

    console.log('Executing query:', query, params);

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            res.status(500).json({ error: err.message });
            return;
        }

        if (userRole === 'animator') {
            const orders = rows.filter(order => {
                const employees = JSON.parse(order.employees || '[]');
                return employees.some(employee => employee.employee === employeeName);
            });
            console.log('Filtered Orders for Animator:', orders); // Логирование данных для Animator
            res.json({ orders });
        } else {
            console.log('Orders for Director/Admin:', rows); // Логирование данных для Director/Admin
            res.json({ orders: rows });
        }
    });
});


// Обновление заказа
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { 
        nameClient,
        phoneNumber, 
        nameEvent, 
        address, 
        characters, 
        summ, 
        prepayment, 
        note, 
        dateOrder, 
        timeOrder, 
        dateRegistr, 
        timeRegistr, 
        status, 
        city
    } = req.body;

    console.log(`Received request to update order with ID: ${id}`);
    console.log('Request body:', req.body); // Логирование данных для отладки

    db.run("UPDATE orders SET nameClient = ?, phoneNumber = ?, nameEvent = ?, address = ?, characters = ?, summ = ?, prepayment = ?, note = ?, dateOrder = ?, timeOrder = ?, dateRegistr = ?, timeRegistr = ?, status = ?, city = ? WHERE id = ?", 
           [
            nameClient, 
            phoneNumber, 
            nameEvent, 
            address, 
            characters, 
            summ, 
            prepayment, 
            note, 
            dateOrder, 
            timeOrder, 
            dateRegistr, 
            timeRegistr, 
            status, 
            city, 
            id
        ], 
           function (err) {
        if (err) {
            console.error('Error updating order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Order updated with ID:', id);
        res.json({ updatedID: id });
    });
});



// Завершение заказа
router.put('/:id/complete', (req, res) => {
    const { id } = req.params;
    console.log(`Received request to complete order with ID: ${id}`);
    db.run("UPDATE orders SET status = 'завершен' WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Error completing order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Order completed with ID:', id);
        res.json({ updatedID: id });
    });
});

// Удаление заказа
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    console.log(`Received request to delete order with ID: ${id}`);
    db.run("DELETE FROM orders WHERE id = ?", [id], function (err) {
        if (err) {
            console.error('Error deleting order:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Order deleted with ID:', id);
        res.json({ deletedID: id });
    });
});

// Получение заказов по дате или диапазону дат
router.get('/by/date', authenticateToken, (req, res) => {
    const { startDate, endDate } = req.query;
    console.log('Received request to get orders by date range:', { startDate, endDate });

    let query = "SELECT * FROM orders WHERE dateOrder BETWEEN ? AND ?";
    let params = [startDate, endDate || startDate];

    db.all(query, params, (err, rows) => {
        if (err) {
            console.error('Error fetching orders by date:', err);
            res.status(500).json({ error: err.message });
            return;
        }
        console.log('Orders fetched by date range:', rows);
        res.json({ orders: rows });
    });
});

// Получение заказов по дате и городу
router.get('/by/dateCity', authenticateToken, (req, res) => {
    const { date, city } = req.query;
    console.log('Received request to get orders by date and city:', { date, city });

    if (!date || !city) {
        console.log('Missing date or city');
        return res.status(400).json({ error: 'Дата и город обязательны' });
    }

    db.all("SELECT * FROM orders WHERE dateOrder = ? AND city = ?", [date, city], (err, rows) => {
        if (err) {
            console.error('Error fetching orders by date and city:', err.message);
            return res.status(500).json({ error: err.message });
        }

        console.log('Orders fetched by date and city:', rows);
        res.json({ orders: rows });
    });
});



// Добавьте этот маршрут в конец файла
router.use((req, res) => {
    console.log('Unhandled request:', req.method, req.url);
    res.status(404).json({ error: 'Not Found' });
});

module.exports = router;

