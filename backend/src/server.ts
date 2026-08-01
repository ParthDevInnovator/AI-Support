import * as dotenv from 'dotenv';
import path from 'path';

// Load .env explicitly from the root workspace
dotenv.config({ path: path.join(__dirname, '../../.env') });

import app from './app';

const PORT = process.env.PORT || 4000;

const server = app.listen(PORT, () => {
    console.log(`🚀 API Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV}`);
});

export default server;
