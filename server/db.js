const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
    db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, username TEXT, password TEXT, role TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS events (id INTEGER PRIMARY KEY, name TEXT)");
    db.run("CREATE TABLE IF NOT EXISTS programs (id INTEGER PRIMARY KEY, name TEXT)");
    db.run(`CREATE TABLE IF NOT EXISTS branches (
        id INTEGER PRIMARY KEY, directorName TEXT, 
        contact TEXT, city TEXT, password TEXT, role TEXT DEFAULT 'director'
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY, name TEXT, userName TEXT, phone TEXT, 
        birthday TEXT, city TEXT, password TEXT, role TEXT, orders TEXT)`);
    db.run(`CREATE TABLE IF NOT EXISTS characters (
        id INTEGER PRIMARY KEY, program_id INTEGER, name TEXT, employee TEXT,
        FOREIGN KEY(program_id) REFERENCES programs(id))
    `);
    db.run(`CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY, nameClient TEXT, phoneNumber TEXT, nameEvent TEXT, address TEXT, 
        characters TEXT, summ INTEGER, prepayment INTEGER, note TEXT, dateOrder TEXT, timeOrder TEXT, 
        dateRegistr TEXT, timeRegistr TEXT, status TEXT, city TEXT
    )`);
    db.run(`CREATE TABLE IF NOT EXISTS clients (
        id INTEGER PRIMARY KEY, name TEXT, phoneNumber TEXT, 
        birthday TEXT, orderQuantities INTEGER, orderSumm INTEGER, city TEXT
    )`);
});

module.exports = db;
