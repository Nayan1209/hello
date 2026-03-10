import http from 'node:http';
import { store } from './store.js';
import { registerAuthRoutes } from './modules/auth/routes.js';
import { registerProfileRoutes } from './modules/profile/routes.js';
import { registerMatchRoutes } from './modules/match/routes.js';
import { registerChatRoutes } from './modules/chat/routes.js';

function createJsonReader(req) {
  return new Promise((resolve) => {
    let data = '';
    req.on('data', (chunk) => { data += chunk; });
    req.on('end', () => {
      if (!data) return resolve({});
      try { return resolve(JSON.parse(data)); } catch { return resolve({}); }
    });
  });
}

export function createServer() {
  const routes = [];

  const addRoute = (method, pathMatcher, handler) => {
    routes.push({ method, pathMatcher, handler });
  };

  const ctx = {
    store,
    addRoute,
    json: createJsonReader
  };

  addRoute('GET', '/health', async (_req, res) => res(200, { ok: true }));
  registerAuthRoutes(ctx);
  registerProfileRoutes(ctx);
  registerMatchRoutes(ctx);
  registerChatRoutes(ctx);

  return http.createServer(async (req, response) => {
    const url = new URL(req.url, 'http://localhost');
    const path = url.pathname;
    const method = req.method;

    const send = (status, body) => {
      response.writeHead(status, { 'content-type': 'application/json' });
      response.end(JSON.stringify(body));
    };

    for (const route of routes) {
      if (route.method !== method) continue;

      if (typeof route.pathMatcher === 'string' && route.pathMatcher === path) {
        return route.handler(req, send);
      }

      if (route.pathMatcher instanceof RegExp) {
        const match = path.match(route.pathMatcher);
        if (match) return route.handler(req, send, match);
      }
    }

    return send(404, { error: 'not found' });
  });
}
