const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth').router;
const { authenticate } = require('./routes/auth');
const ordersRoutes = require('./routes/orders');
const clientsRoutes = require('./routes/clients');
const charactersRoutes = require('./routes/characters');
const employeesRoutes = require('./routes/employees');
const analyticsRoutes = require('./routes/analytics');
const eventsRoutes = require('./routes/events');
const branchesRoutes = require('./routes/branches');
const ensureAdminCreated = require('./middlwares/ensureAdminCreated');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/auth', authRoutes);

// Применение middleware аутентификации ко всем маршрутам ниже
app.use(authenticate);

app.use('/api/orders', ordersRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/characters', charactersRoutes);
app.use('/api/employees', employeesRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/events', eventsRoutes);
app.use('/api/branches', branchesRoutes);

// Создание администратора при запуске сервера
ensureAdminCreated();

// Middleware для обслуживания статических файлов из папки сборки React-приложения
app.use(express.static(path.join(__dirname, '../client/build')));

// Любой GET запрос, который не был обработан выше, отправляет файл index.html из папки сборки
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
