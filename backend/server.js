const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const cors = require('cors');
const config = require('./config');
const logger = require('./logger');
const wsEmitter = require('./ws/emitter');
const sessionRouter = require('./routes/session');
const systemRouter = require('./routes/system');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5174',
    config.FRONTEND_URL,
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

app.use('/api', systemRouter);
app.use('/api/session', sessionRouter);

app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ ok: false, error: 'Internal Server Error' });
});

server.listen(config.PORT, () => {
  logger.info(`Backend running on http://localhost:${config.PORT}`);
});

wss.on('connection', (ws) => {
  wsEmitter.register(ws);
});
