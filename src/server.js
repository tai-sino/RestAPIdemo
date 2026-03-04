require('dotenv').config();
const app = require('./app');
const { initDatabase } = require('./db/sqlite');

const port = Number(process.env.PORT || 3000);

async function bootstrap() {
  try {
    await initDatabase();
    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Server running at http://localhost:${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
}

bootstrap();
