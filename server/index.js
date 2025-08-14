import { buildApp } from './app.js';
import { PORT } from './config/env.js';

const app = buildApp(); 
app.listen(PORT, () => {
  console.log(`Server running on :${PORT}`);
});
