import crypto from 'node:crypto';

export function registerAuthRoutes({ addRoute, store, json, requireUser }) {
  addRoute('POST', '/auth/register', async (req, res) => {
    const { name, phone, password, role = 'member' } = await json(req);
    if (!name || !phone || !password) return res(400, { error: 'name, phone and password are required' });
    if (store.users.some((entry) => entry.phone === phone)) return res(409, { error: 'phone already registered' });

    const user = { id: `u_${store.users.length + 1}`, name, phone, password, role };
    store.users.push(user);
    return res(201, { user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  });

  addRoute('POST', '/auth/login', async (req, res) => {
    const { phone, password } = await json(req);
    const user = store.users.find((entry) => entry.phone === phone && entry.password === password);
    if (!user) return res(401, { error: 'invalid credentials' });

    const token = `token_${crypto.randomUUID()}`;
    store.sessions.push({ token, userId: user.id, createdAt: new Date().toISOString() });

    return res(200, { token, user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  });

  addRoute('GET', '/auth/me', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    return res(200, { user: { id: user.id, name: user.name, phone: user.phone, role: user.role } });
  });
}
