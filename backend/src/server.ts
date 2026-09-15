import app from './app';
import { connectDB } from './db';
import { runMigrations } from './db/migrate';

const PORT = parseInt(process.env.PORT || '5000', 10);

const startServer = async () => {
  try {
    await connectDB();
    await runMigrations();
  } catch (error: any) {
    // Log loudly but keep the process alive so /api/health still answers and
    // the platform logs show the real cause instead of a crash loop.
    console.error('Database initialisation failed:', error.message);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();
