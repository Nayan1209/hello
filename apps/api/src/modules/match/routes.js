function matchKey(a, b) {
  return [a, b].sort().join('::');
}

export function registerMatchRoutes({ addRoute, store, json }) {
  addRoute('GET', /^\/match\/candidates\/([^/]+)$/, async (_req, res, match) => {
    const userId = match[1];
    const candidates = store.profiles.filter((p) => p.userId !== userId);
    return res(200, { candidates });
  });

  addRoute('POST', '/match/swipe', async (req, res) => {
    const { fromUserId, toUserId, action } = await json(req);
    if (!fromUserId || !toUserId || !['like', 'pass'].includes(action)) {
      return res(400, { error: 'fromUserId, toUserId, action(like|pass) are required' });
    }

    store.swipes.push({ fromUserId, toUserId, action, at: new Date().toISOString() });
    if (action === 'like') {
      const reciprocal = store.swipes.find((s) => s.fromUserId === toUserId && s.toUserId === fromUserId && s.action === 'like');
      if (reciprocal) {
        const key = matchKey(fromUserId, toUserId);
        if (!store.matches.find((m) => m.key === key)) {
          store.matches.push({ key, users: [fromUserId, toUserId], createdAt: new Date().toISOString() });
        }
      }
    }

    const isMatch = !!store.matches.find((m) => m.key === matchKey(fromUserId, toUserId));
    return res(201, { isMatch });
  });

  addRoute('GET', /^\/match\/list\/([^/]+)$/, async (_req, res, match) => {
    const userId = match[1];
    return res(200, { matches: store.matches.filter((m) => m.users.includes(userId)) });
  });
}
