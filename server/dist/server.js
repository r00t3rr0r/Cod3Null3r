import dotenv from 'dotenv';
import express from 'express';
import basicRoutes from './routes/index';
import authRoutes from './routes/authRoutes';
import projectRoutes from './routes/projectRoutes';
import taskRoutes from './routes/taskRoutes';
import specificationRoutes from './routes/specificationRoutes';
import appCreationRoutes from './routes/appCreationRoutes';
import codeFileRoutes from './routes/codeFileRoutes';
import { connectDB } from './config/database';
import cors from 'cors';
// Load environment variables
dotenv.config();
if (!process.env.DATABASE_URL) {
    console.error("Error: DATABASE_URL variables in .env missing.");
    process.exit(-1);
}
const app = express();
const port = process.env.PORT || 3000;
// Pretty-print JSON responses
app.enable('json spaces');
// We want to be consistent with URL paths, so we enable strict routing
app.enable('strict routing');
app.use(cors({}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Database connection
connectDB();
// Basic Routes
app.use(basicRoutes);
// Authentication Routes
app.use('/api/auth', authRoutes);
// Project Routes
app.use('/api/projects', projectRoutes);
// Task and Epic Routes
app.use('/api', taskRoutes);
// Specification Routes
app.use('/api/specifications', specificationRoutes);
// App Creation Routes
app.use('/api/app-creation', appCreationRoutes);
// Code File Routes
app.use('/api', codeFileRoutes);
// If no routes handled the request, it's a 404
app.use((req, res) => {
    res.status(404).send("Page not found.");
});
// Error handling
app.use((err, req, res) => {
    console.error(`Unhandled application error: ${err.message}`);
    console.error(err.stack);
    res.status(500).send("There was an error serving your request.");
});
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map