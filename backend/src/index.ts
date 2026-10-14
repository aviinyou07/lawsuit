import http from 'http';
import { Server } from 'socket.io';
import { app } from './app.js';
import { config } from './config/index.js';
import { pool } from './database/index.js';
import { setupSocketIO } from './chat/socket.handler.js';

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: config.corsOrigin,
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSocketIO(io);

async function startServer() {
  try {
    // Verify database connection
    const client = await pool.connect();
    console.log('Successfully connected to PostgreSQL database (lawsuit_db)');
    client.release();

    server.listen(config.port, () => {
      console.log(`====================================================`);
      console.log(`⚖️  LAWSUIT BACKEND API SERVER RUNNING ON PORT ${config.port}`);
      console.log(`⚡ Environment: ${config.nodeEnv}`);
      console.log(`🔌 Health check: http://localhost:${config.port}/health`);
      console.log(`💬 Socket.io connected and ready`);
      console.log(`====================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting backend server:', error);
    process.exit(1);
  }
}

startServer();
