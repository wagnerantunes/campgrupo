import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { query } from './db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(); // Use project root for consistency

// --- SECURITY MIDDLEWARE & LIGHT SANITIZATION ---

/**
 * Very light sanitization to prevent basic script injections 
 * without breaking URLs or professional content.
 */
const sanitizeString = (str: string): string => {
    return str
        .replace(/<script/gi, '&lt;script')
        .replace(/<\/script/gi, '&lt;/script')
        .replace(/on\w+=/gi, 'blocked='); // Blocks onmouseover, onclick, etc.
};

const sanitizeDeep = (obj: any): any => {
    if (typeof obj !== 'object' || obj === null) return obj;
    if (Array.isArray(obj)) return obj.map(item => sanitizeDeep(item));
    const newObj: any = {};
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            newObj[key] = sanitizeString(obj[key]);
        } else if (typeof obj[key] === 'object') {
            newObj[key] = sanitizeDeep(obj[key]);
        } else {
            newObj[key] = obj[key];
        }
    }
    return newObj;
};

const xssSanitizer = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (req.body && typeof req.body === 'object' && req.path === '/api/leads') {
        req.body = sanitizeDeep(req.body);
    }
    next();
};

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
    contentSecurityPolicy: false,
    // @ts-ignore - types are outdated but this is valid for helmet 7+
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));

// Rate Limiting general
const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 500, // limite cada IP a 500 requisições por janela (aumentado para uso normal)
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

app.use(express.json({ limit: '10mb' })); // Increased limit for larger configs
app.use(xssSanitizer); // Sanitização profunda de todos os inputs
app.use(generalLimiter);
app.use('/uploads', express.static(path.join(ROOT_DIR, 'uploads')));

// Health Check
app.get('/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(ROOT_DIR, 'uploads');
        if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'image/jpeg', 
            'image/png', 
            'image/gif', 
            'image/webp', 
            'image/svg+xml', 
            'image/x-icon', 
            'image/vnd.microsoft.icon',
            'application/xml', // Sometimes SVGs are detected as this
            'text/xml'
        ];
        
        console.log(`[Upload Attempt] Filename: ${file.originalname}, Mimetype: ${file.mimetype}`);
        
        if (allowedTypes.includes(file.mimetype) || file.originalname.toLowerCase().endsWith('.svg') || file.originalname.toLowerCase().endsWith('.webp')) {
            cb(null, true);
        } else {
            console.warn(`[Upload Rejected] Unsupported type: ${file.mimetype}`);
            cb(new Error(`Tipo de arquivo não suportado (${file.mimetype}). Use JPG, PNG, GIF, WEBP ou SVG.`));
        }
    }
});

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

        // Ensure ONLY the specific admin user exists
        const targetUsername = 'wagnerantunes84@gmail.com';
        const targetPassword = 'GGX5A27@CampGrupo2021';

        // Remove all other users
        await query('DELETE FROM admin_users WHERE username != $1', [targetUsername]);

        // Check if our specific user exists
        const userCheck = await query('SELECT count(*) FROM admin_users WHERE username = $1', [targetUsername]);
        if (parseInt(userCheck.rows[0].count) === 0) {
            const hashedPass = await bcrypt.hash(targetPassword, 10);
            await query('INSERT INTO admin_users (username, password_hash) VALUES ($1, $2)', [targetUsername, hashedPass]);
            console.log(`User ${targetUsername} created`);
        } else {
            // Update password just in case it was changed
            const hashedPass = await bcrypt.hash(targetPassword, 10);
            await query('UPDATE admin_users SET password_hash = $1 WHERE username = $2', [hashedPass, targetUsername]);
            console.log(`Password for ${targetUsername} updated`);
        }

        console.log('Database initialized with master credentials');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

initDb();

// Middleware: Authenticate Token
const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Token de autenticação ausente' });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
        if (err) return res.status(403).json({ message: 'Sessão expirada ou inválida. Faça login novamente.' });
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
        console.log('--- RECEIVED CONFIG UPDATE REQUEST ---');

        // Validate if it's an object
        if (typeof configData !== 'object' || configData === null) {
            throw new Error('Invalid config data: Expected object');
        }

        const queryText = `
            INSERT INTO site_config (key, data)
            VALUES ($1, $2)
            ON CONFLICT (key) DO UPDATE SET data = $2, updated_at = CURRENT_TIMESTAMP
        `;

        await query(queryText, ['current_config', configData]);
        console.log('✅ Config saved to Database successfully');
        res.json({ success: true });
    } catch (err) {
        console.error('❌ DATABASE ERROR on /api/config:', err);
        res.status(500).json({
            error: 'Erro ao salvar no banco de dados',
            details: (err as Error).message
        });
    }
});

app.post('/api/upload', authenticateToken, (req, res) => {
    console.log('--- REQUISIÇÃO DE UPLOAD RECEBIDA NO BACKEND ---');
    upload.single('image')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            console.error('Multer Error:', err);
            return res.status(400).json({ message: `Erro no upload: ${err.message}` });
        } else if (err) {
            console.error('Upload Error:', err);
            return res.status(400).json({ message: err.message });
        }

        if (!req.file) {
            return res.status(400).json({ message: 'Nenhum arquivo enviado' });
        }

        console.log('--- FILE UPLOADED ---');
        console.log('Original Name:', req.file.originalname);
        console.log('Mime Type:', req.file.mimetype);
        console.log('Size:', req.file.size);

        // Usa a BASE_URL vinda do .env para a URL real
        const imageUrl = `${BASE_URL}/uploads/${req.file.filename}`;
        res.json({ url: imageUrl, filename: req.file.filename });
    });
});

// MEDIA MANAGER ROUTES
app.get('/api/media', authenticateToken, (req, res) => {
    const uploadsDir = path.join(ROOT_DIR, 'uploads');
    fs.readdir(uploadsDir, (err, files) => {
        if (err) {
            return res.status(500).json({ error: 'Erro ao listar arquivos' });
        }
        const media = files
            .filter(file => !file.startsWith('.'))
            .map(file => ({
                filename: file,
                url: `${BASE_URL}/uploads/${file}`,
                time: fs.statSync(path.join(uploadsDir, file)).mtime
            }))
            .sort((a, b) => b.time.getTime() - a.time.getTime());
        res.json(media);
    });
});

app.delete('/api/media/:filename', authenticateToken, (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(ROOT_DIR, 'uploads', filename);

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
        return res.status(400).json({ error: 'Filename inválido' });
    }

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Delete error:', err);
            return res.status(500).json({ error: 'Erro ao deletar arquivo' });
        }
        console.log(`✅ Deleted: ${filename}`);
        res.json({ success: true });
    });
});

app.get('/api/leads', authenticateToken, async (req, res) => {
    try {
        const result = await query('SELECT * FROM leads ORDER BY created_at DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.delete('/api/leads/:id', authenticateToken, async (req, res) => {
    try {
        const { id } = req.params;
        await query('DELETE FROM leads WHERE id = $1', [id]);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: (err as Error).message });
    }
});

app.listen(port, () => {
    const maskedDb = (process.env.DATABASE_URL || '').replace(/:([^:@]+)@/, ':****@');
    console.log(`🚀 Server running at ${BASE_URL} (Port: ${port})`);
    console.log(`📡 DB URL: ${maskedDb}`);
});
