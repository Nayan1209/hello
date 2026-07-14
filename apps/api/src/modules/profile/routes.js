export function registerProfileRoutes({ addRoute, store, json, requireUser }) {
  addRoute('POST', '/profile', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { age, bio, location, interests = [], community } = await json(req);
    if (!age || !bio) return res(400, { error: 'age and bio are required' });

    const profile = { userId: user.id, age, bio, location: location ?? '', interests, community: community ?? '' };
    const index = store.profiles.findIndex((entry) => entry.userId === user.id);
    if (index >= 0) store.profiles[index] = profile;
    else store.profiles.push(profile);

    return res(201, { profile });
  });

  addRoute('GET', /^\/profile\/([^/]+)$/, async (_req, res, match) => {
    const profile = store.profiles.find((entry) => entry.userId === match[1]);
    if (!profile) return res(404, { error: 'profile not found' });
    return res(200, { profile });
  });
}
