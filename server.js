require('dotenv').config();
const app    = require('./app');
const initDB = require('./src/config/initDB');

const PORT = process.env.PORT || 3000;

const start = async () => {
    try {
        // Auto-create tables if they don't exist
        await initDB();

        app.listen(PORT, () => {
            console.log(`🚀 GaavConnect Auth Service running on port ${PORT}`);
            console.log(`   Environment : ${process.env.NODE_ENV || 'development'}`);
            console.log(`   Health check: http://localhost:${PORT}/health`);
        });

    } catch (error) {
        console.error('❌ Failed to initialise database:', error.message);
        process.exit(1);
    }
};

start();
