const logger = require('../logger');

const clients = new Set();

function register(ws) {
  clients.add(ws);
  logger.info(`WebSocket client connected. Total clients: ${clients.size}`);

  ws.on('close', () => {
    clients.delete(ws);
    logger.info(`WebSocket client disconnected. Total clients: ${clients.size}`);
  });

  ws.on('error', (err) => {
    logger.error(`WebSocket error: ${err.message}`);
    clients.delete(ws);
  });
}

function emit(type, payload = {}) {
  const message = JSON.stringify({
    type,
    payload,
    ts: Date.now(),
  });

  let count = 0;
  for (const client of clients) {
    if (client.readyState === 1) {
      client.send(message);
      count++;
    }
  }
}

module.exports = { register, emit };
