import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'camp_secret_key_change_me_in_production';

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
        // Site Config Table
        await query(`
      CREATE TABLE IF NOT EXISTS site_config (
        id SERIAL PRIMARY KEY,
        key TEXT UNIQUE NOT NULL,
        data JSONB NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Admin Users Table
        await query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Leads/Contacts Table
        await query(`
      CREATE TABLE IF NOT EXISTS leads (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT,
        phone TEXT,
        city TEXT,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

        // Create default admin if not exists
        const adminCheck = await query('SELECT * FROM admin_users WHERE username = $1', ['admin']);
        if (adminCheck.rows.length === 0) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash('admin123', salt);
            await query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', ['admin', hash]);
            console.log('Default admin user created (admin/admin123)');
        }

        console.log('Database initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

// Middleware: Authenticate Token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- AUTH ROUTES ---

app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await query('SELECT * FROM admin_users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const user = result.rows[0];
        const validPassword = await bcrypt.compare(password, user.password_hash);

        if (!validPassword) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '24h' });
        res.json({ token, username: user.username });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// --- PUBLIC ROUTES ---

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

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.post('/api/leads', async (req, res) => {
    const { name, email, phone, city, message } = req.body;
    try {
        await query(
            'INSERT INTO leads (name, email, phone, city, message) VALUES ($1, $2, $3, $4, $5)',
            [name, email, phone, city, message]
        );

        // Send Email
        const mailOptions = {
            from: process.env.SMTP_FROM || '"Grupo Camp Site" <no-reply@campgrupo.com.br>',
            to: 'vendas@campgrupo.com.br',
            subject: `Novo Lead do Site: ${name}`,
            text: `
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Cidade: ${city}
Mensagem: ${message}
            `,
            html: `
<h3>Novo Lead Recebido</h3>
<p><strong>Nome:</strong> ${name}</p>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Telefone:</strong> ${phone}</p>
<p><strong>Cidade:</strong> ${city}</p>
<p><strong>Mensagem:</strong> ${message}</p>
            `,
        };

        // Try sending email but don't fail request if it fails (just log error)
        try {
           if (process.env.SMTP_HOST) {
               await transporter.sendMail(mailOptions);
               console.log('Email sent successfully');
           } else {
               console.log('SMTP not configured, email skipped');
           }
        } catch (emailErr) {
            console.error('Error sending email:', emailErr);
        }

        res.json({ success: true, message: 'Lead salvo com sucesso' });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

// --- PROTECTED ROUTES ---

app.post('/api/config', authenticateToken, async (req, res) => {
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

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
    }
    const imageUrl = `http://localhost:${port}/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
});

app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
