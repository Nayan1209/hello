export function registerSafetyRoutes({ addRoute, store, json, requireUser, requireAdmin }) {
  addRoute('POST', '/safety/block', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { targetUserId } = await json(req);
    if (!targetUserId) return res(400, { error: 'targetUserId is required' });

    const exists = store.blocks.find((entry) => entry.byUserId === user.id && entry.targetUserId === targetUserId);
    if (!exists) store.blocks.push({ byUserId: user.id, targetUserId, createdAt: new Date().toISOString() });

    return res(201, { blocked: true });
  });

  addRoute('POST', '/safety/report', async (req, res) => {
    const user = requireUser(req, res);
    if (!user) return;

    const { targetUserId, reason } = await json(req);
    if (!targetUserId || !reason) return res(400, { error: 'targetUserId and reason are required' });

    const report = {
      id: `r_${store.reports.length + 1}`,
      byUserId: user.id,
      targetUserId,
      reason,
      createdAt: new Date().toISOString(),
      status: 'open'
    };
    store.reports.push(report);
    return res(201, { report });
  });

  addRoute('GET', '/admin/reports', async (req, res) => {
    const admin = requireAdmin(req, res);
    if (!admin) return;

    return res(200, { reports: store.reports });
  });
}
