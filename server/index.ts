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
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'camp_secret_key_change_me_in_production';
const BASE_URL = process.env.BASE_URL || `http://localhost:${port}`;

// Configuração de CORS - Permitir o domínio da Hostinger
const allowedOrigins = [
    'http://localhost:5173',
    'https://campgrupo.com.br',
    'https://www.campgrupo.com.br'
];

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Rate Limiting general
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limite cada IP a 100 requisições por janela
    message: 'Muitas requisições deste IP, tente novamente mais tarde.'
});

// Stricter limiter for sensitive routes
const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 10, // limite cada IP a 10 tentativas
    message: 'Bloqueado por segurança devido a excesso de tentativas. Tente novamente em 1 hora.'
});

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Não permitido pelo CORS'));
        }
    },
    credentials: true
}));

app.use(express.json({ limit: '10kb' })); // Proteção contra payloads gigantes
app.use(generalLimiter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

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

        // SECURITY: Remove default 'admin' user if it exists
        await query('DELETE FROM admin_users WHERE username = $1', ['admin']);
        
        console.log('Database initialized (restricted access)');
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

app.post('/api/login', strictLimiter, async (req, res) => {
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
        console.error('Auth Error:', err);
        res.status(500).json({ error: 'Erro interno no servidor' });
    }
});

// --- PUBLIC ROUTES ---

app.get('/api/config', async (req, res) => {
    try {
        const result = await query('SELECT data FROM site_config WHERE key = $1', ['current_config']);
        if (result.rows.length > 0) {
            res.json(result.rows[0].data);
        } else {
            // Em caso de não existir, retorne um objeto vazio para o front lidar com os defaults
            res.json({});
        }
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '465'),
    secure: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

app.post('/api/leads', strictLimiter, async (req, res) => {
    const { name, email, phone, city, message } = req.body;
    try {
        await query(
            'INSERT INTO leads (name, email, phone, city, message) VALUES ($1, $2, $3, $4, $5)',
            [name, email, phone, city, message]
        );

        // Fetch dynamic config for BCC
        let bccEmail = undefined;
        try {
            const configResult = await query('SELECT data FROM site_config WHERE key = $1', ['current_config']);
            if (configResult.rows.length > 0) {
                bccEmail = configResult.rows[0].data?.seo?.bccEmail;
            }
        } catch (e) {
            console.error('Error fetching config for BCC:', e);
        }

        // Send Email
        const mailOptions: any = {
            from: process.env.SMTP_FROM || '"Grupo Camp Site" <no-reply@campgrupo.com.br>',
            to: process.env.SMTP_TO || 'vendas@campgrupo.com.br',
            subject: `Novo Lead do Site: ${name}`,
            text: `
Nome: ${name}
Email: ${email}
Telefone: ${phone}
Cidade: ${city}
Mensagem: ${message}
            `,
            html: `
<div style="font-family: sans-serif; padding: 20px; color: #333;">
    <h3 style="color: #002D58;">Novo Lead Recebido</h3>
    <p><strong>Nome:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Telefone:</strong> ${phone}</p>
    <p><strong>Cidade:</strong> ${city}</p>
    <p><strong>Mensagem:</strong> ${message}</p>
</div>
            `,
        };

        if (bccEmail) {
            mailOptions.bcc = bccEmail;
        }

        try {
            if (process.env.SMTP_HOST) {
                await transporter.sendMail(mailOptions);
            }
        } catch (emailErr) {
            console.error('Error sending email:', emailErr);
        }

        res.json({ success: true, message: 'Lead salvo com sucesso' });
    } catch (err) {
        console.error('Lead Error:', err);
        res.status(500).json({ error: 'Erro ao processar contato' });
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
    // Usa a BASE_URL vinda do .env para a URL real
    const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
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
    console.log(`Server running at ${BASE_URL} (Port: ${port})`);
});

