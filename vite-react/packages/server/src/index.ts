import express, { Express, Request, Response, NextFunction } from "express";
import imaRouter from './ima.js';

const app: Express = express();
const PORT = process.env.PORT || 3000;

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://balneabilidade-praias-sc.com',
  'https://www.balneabilidade-praias-sc.com',
];

const corsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Accept', 'Authorization'],
  credentials: true,
};

app.use((_req, _res, next) => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
  }));
  next();
});

app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0',
  });
});

app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'Balneabilidade API',
    version: '2.0.0',
    endpoints: {
      health: '/health',
      chart: '/api/ima/chart',
    },
  });
});

app.use('/api/ima', imaRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).json({ error: 'Endpoint não encontrado.' });
});

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(JSON.stringify({
    timestamp: new Date().toISOString(),
    error: err.message,
  }));
  
  res.status(500).json({ 
    error: 'Erro interno do servidor.',
  });
});

app.listen(PORT, () => {
  console.log(JSON.stringify({
    timestamp: new Date().toISOString(),
    message: `Server running on port ${PORT}`,
  }));
});

export default app;
