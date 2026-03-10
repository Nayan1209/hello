export function registerProfileRoutes({ addRoute, store, json }) {
  addRoute('POST', '/profile', async (req, res) => {
    const { userId, age, bio, location, interests = [] } = await json(req);
    if (!userId || !age || !bio) return res(400, { error: 'userId, age and bio are required' });

    const profile = { userId, age, bio, location: location ?? '', interests };
    const i = store.profiles.findIndex((p) => p.userId === userId);
    if (i >= 0) store.profiles[i] = profile;
    else store.profiles.push(profile);

    return res(201, { profile });
  });

  addRoute('GET', /^\/profile\/([^/]+)$/, async (_req, res, match) => {
    const userId = match[1];
    const profile = store.profiles.find((p) => p.userId === userId);
    if (!profile) return res(404, { error: 'profile not found' });
    return res(200, { profile });
  });
}
