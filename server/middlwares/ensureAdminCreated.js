const bcrypt = require('bcrypt');
const db = require('../db');

const ensureAdminCreated = () => {
    const adminUser = {
        directorName: 'admin',
        password: 'admin123',
        role: 'admin',
        city: 'SomeCity'
    };

    db.get("SELECT * FROM branches WHERE directorName = ?", [adminUser.directorName], async (err, user) => {
        if (err) {
            console.error('Error checking admin existence:', err);
            return;
        }
        if (!user) {
            const hashedPassword = await bcrypt.hash(adminUser.password, 10);
            db.run("INSERT INTO branches (directorName, password, role, city) VALUES (?, ?, ?, ?)", [adminUser.directorName, hashedPassword, adminUser.role, adminUser.city], (err) => {
                if (err) {
                    console.error('Error creating admin:', err);
                } else {
                    console.log('Admin user created');
                }
            });
        } else {
            console.log('Admin user already exists');
        }
    });
};

module.exports = ensureAdminCreated;
