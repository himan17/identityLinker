import app from './app';
import config from './config';
import { db } from './config/db';
const port = config.port;

const startServer = async () => {
  try {
    await db.authenticate();
    console.log('Database connected...');
    await db.sync();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

startServer();
