function matchKey(a, b) {
  return [a, b].sort().join('::');
}

function isBlocked(store, a, b) {
  return store.blocks.some((entry) => (entry.byUserId === a && entry.targetUserId === b) || (entry.byUserId === b && entry.targetUserId === a));
}

export function registerMatchRoutes({ addRoute, store, json, requireUser }) {
  addRoute('GET', '/match/candidates', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const url = new URL(req.url, 'http://localhost');
    const minAge = Number(url.searchParams.get('minAge') || 18);
    const maxAge = Number(url.searchParams.get('maxAge') || 100);
    const location = url.searchParams.get('location') || '';

    const passedIds = new Set(
      store.swipes.filter((entry) => entry.fromUserId === user.id && entry.action === 'pass').map((entry) => entry.toUserId)
    );

    const candidates = store.profiles.filter((profile) => {
      if (profile.userId === user.id) return false;
      if (profile.age < minAge || profile.age > maxAge) return false;
      if (location && profile.location !== location) return false;
      if (passedIds.has(profile.userId)) return false;
      if (isBlocked(store, user.id, profile.userId)) return false;
      return true;
    });

    return res(200, { candidates });
  });

  addRoute('POST', '/match/swipe', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { toUserId, action } = await json(req);
    if (!toUserId || !['like', 'pass'].includes(action)) {
      return res(400, { error: 'toUserId and action(like|pass) are required' });
    }
    if (isBlocked(store, user.id, toUserId)) return res(403, { error: 'interaction blocked' });

    store.swipes.push({ fromUserId: user.id, toUserId, action, at: new Date().toISOString() });
    if (action === 'like') {
      const reciprocal = store.swipes.find((entry) => entry.fromUserId === toUserId && entry.toUserId === user.id && entry.action === 'like');
      if (reciprocal) {
        const key = matchKey(user.id, toUserId);
        if (!store.matches.find((entry) => entry.key === key)) {
          store.matches.push({ key, users: [user.id, toUserId], createdAt: new Date().toISOString() });
        }
      }
    }

    const isMatchNow = !!store.matches.find((entry) => entry.key === matchKey(user.id, toUserId));
    return res(201, { isMatch: isMatchNow });
  });

  addRoute('GET', '/match/list', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    return res(200, { matches: store.matches.filter((entry) => entry.users.includes(user.id)) });
  });
}
