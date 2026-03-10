export function registerAuthRoutes({ addRoute, store, json }) {
  addRoute('POST', '/auth/register', async (req, res) => {
    const { name, phone } = await json(req);
    if (!name || !phone) return res(400, { error: 'name and phone are required' });

    const user = { id: `u_${store.users.length + 1}`, name, phone };
    store.users.push(user);
    return res(201, { user });
  });

  addRoute('POST', '/auth/login', async (req, res) => {
    const { phone } = await json(req);
    const user = store.users.find((entry) => entry.phone === phone);
    if (!user) return res(404, { error: 'user not found' });

    return res(200, { token: `demo-token-${user.id}`, user });
  });
}
