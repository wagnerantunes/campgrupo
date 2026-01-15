import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Initialize Database
const initDb = async () => {
    try {
        await query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

// Routes
app.get('/api/config', async (req, res) => {
    try {
        const result = await query('SELECT data FROM site_config WHERE key = $1', ['current_config']);
        if (result.rows.length > 0) {
            res.json(result.rows[0].data);
        } else {
            res.status(404).json({ message: 'Config not found' });
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/config', async (req, res) => {
    try {
        const configData = req.body;
        await query(`
      INSERT INTO site_config (key, data)
      VALUES ($1, $2)
      ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
    `, ['current_config', configData]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.post('/api/upload', upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:3001/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
