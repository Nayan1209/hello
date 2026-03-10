function inSameMatch(store, a, b) {
  return store.matches.some((m) => m.users.includes(a) && m.users.includes(b));
}

export function registerChatRoutes({ addRoute, store, json }) {
  addRoute('POST', '/chat/send', async (req, res) => {
    const { fromUserId, toUserId, text } = await json(req);
    if (!fromUserId || !toUserId || !text) return res(400, { error: 'fromUserId, toUserId and text are required' });
    if (!inSameMatch(store, fromUserId, toUserId)) return res(403, { error: 'users are not matched' });

    const message = { id: `m_${store.messages.length + 1}`, fromUserId, toUserId, text, sentAt: new Date().toISOString() };
    store.messages.push(message);
    return res(201, { message });
  });

  addRoute('GET', '/chat/thread', async (req, res) => {
    const url = new URL(req.url, 'http://localhost');
    const userA = url.searchParams.get('userA');
    const userB = url.searchParams.get('userB');
    if (!userA || !userB) return res(400, { error: 'userA and userB are required' });

    const messages = store.messages.filter(
      (m) => (m.fromUserId === userA && m.toUserId === userB) || (m.fromUserId === userB && m.toUserId === userA)
    );
    return res(200, { messages });
  });
}
