import app from './app.js';
import { PORT } from './config/env.js';
import { initDb } from './config/db.js';

initDb()
  .then(() => app.listen(PORT, () => console.log(`Server running on port ${PORT}`)))
  .catch(err => { console.error('DB init failed:', err.message); process.exit(1); });
