import dotenv from 'dotenv';
import app from './app';
import Database from './config/database';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;

// Initialize database and start server
const startServer = async () => {
  try {
    // Connect to MongoDB
    const db = Database.getInstance();
    await db.connect();

    // Start server
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/health`);
    });

    return server;
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Start the server
const server = await startServer();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      const db = Database.getInstance();
      await db.disconnect();
      process.exit(0);
    });
  }
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  if (server) {
    server.close(async () => {
      console.log('HTTP server closed');
      const db = Database.getInstance();
      await db.disconnect();
      process.exit(0);
    });
  }
});

export default server;
