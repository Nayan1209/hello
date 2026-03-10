function inSameMatch(store, a, b) {
  return store.matches.some((entry) => entry.users.includes(a) && entry.users.includes(b));
}

function isBlocked(store, a, b) {
  return store.blocks.some((entry) => (entry.byUserId === a && entry.targetUserId === b) || (entry.byUserId === b && entry.targetUserId === a));
}

export function registerChatRoutes({ addRoute, store, json, requireUser }) {
  addRoute('POST', '/chat/send', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { toUserId, text } = await json(req);
    if (!toUserId || !text) return res(400, { error: 'toUserId and text are required' });
    if (!inSameMatch(store, user.id, toUserId)) return res(403, { error: 'users are not matched' });
    if (isBlocked(store, user.id, toUserId)) return res(403, { error: 'chat blocked' });

    const message = {
      id: `m_${store.messages.length + 1}`,
      fromUserId: user.id,
      toUserId,
      text,
      sentAt: new Date().toISOString()
    };
    store.messages.push(message);
    return res(201, { message });
  });

  addRoute('GET', '/chat/thread', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const url = new URL(req.url, 'http://localhost');
    const withUserId = url.searchParams.get('withUserId');
    if (!withUserId) return res(400, { error: 'withUserId is required' });

    const messages = store.messages.filter(
      (entry) => (entry.fromUserId === user.id && entry.toUserId === withUserId) || (entry.fromUserId === withUserId && entry.toUserId === user.id)
    );

    return res(200, { messages });
  });
}
