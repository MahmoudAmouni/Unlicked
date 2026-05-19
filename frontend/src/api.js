const BASE = 'http://localhost:3001/api';

export const startSession = (username, password) =>
  fetch(`${BASE}/session/start`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  }).then(r => r.json());

export const stopSession = () =>
  fetch(`${BASE}/session/stop`, { method: 'POST' }).then(r => r.json());

export const resumeSession = () =>
  fetch(`${BASE}/session/resume`, { method: 'POST' }).then(r => r.json());

export const getStatus = () =>
  fetch(`${BASE}/session/status`).then(r => r.json());

export const getProgress = () =>
  fetch(`${BASE}/session/progress`).then(r => r.json());

export const clearProgress = () =>
  fetch(`${BASE}/session/clear`, { method: 'POST' }).then(r => r.json());
