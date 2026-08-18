import app from './app';
import { connectDB } from './db';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    console.log('Database connected successfully');
  } catch (error: any) {
    console.warn('Database connection failed (continuing anyway):', error.message);
    // Don't exit - let the server start anyway for testing
  }

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
