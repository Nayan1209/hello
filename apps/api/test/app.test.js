import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/app.js';
import { store } from '../src/store.js';

async function requestJson(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const body = await res.json();
  return { status: res.status, body };
}

function resetStore() {
  for (const key of Object.keys(store)) {
    if (Array.isArray(store[key])) store[key].length = 0;
  }
}

test('health endpoint works', async () => {
  resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  const result = await requestJson(baseUrl, '/health');
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);

  await new Promise((resolve) => server.close(resolve));
});

test('full secured flow: auth, profile, match, chat, safety, admin reports', async () => {
  resetStore();
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const baseUrl = `http://127.0.0.1:${server.address().port}`;

  await requestJson(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Admin', phone: '100', password: 'pass', role: 'admin' }) });
  await requestJson(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Asha', phone: '111', password: 'pass' }) });
  await requestJson(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Ravi', phone: '222', password: 'pass' }) });

  const adminLogin = await requestJson(baseUrl, '/auth/login', { method: 'POST', body: JSON.stringify({ phone: '100', password: 'pass' }) });
  const aLogin = await requestJson(baseUrl, '/auth/login', { method: 'POST', body: JSON.stringify({ phone: '111', password: 'pass' }) });
  const bLogin = await requestJson(baseUrl, '/auth/login', { method: 'POST', body: JSON.stringify({ phone: '222', password: 'pass' }) });
  const adminToken = adminLogin.body.token;
  const tokenA = aLogin.body.token;
  const tokenB = bLogin.body.token;

  const aId = aLogin.body.user.id;
  const bId = bLogin.body.user.id;

  await requestJson(baseUrl, '/profile', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ age: 26, bio: 'Engineer', location: 'Pune', community: 'Samajh' })
  });
  await requestJson(baseUrl, '/profile', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ age: 28, bio: 'Designer', location: 'Pune', community: 'Samajh' })
  });

  const candidates = await requestJson(baseUrl, '/match/candidates?location=Pune&minAge=22&maxAge=30', {
    headers: { authorization: `Bearer ${tokenA}` }
  });
  assert.equal(candidates.status, 200);
  assert.equal(candidates.body.candidates.length, 1);

  const like1 = await requestJson(baseUrl, '/match/swipe', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ toUserId: bId, action: 'like' })
  });
  assert.equal(like1.body.isMatch, false);

  const like2 = await requestJson(baseUrl, '/match/swipe', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenB}` },
    body: JSON.stringify({ toUserId: aId, action: 'like' })
  });
  assert.equal(like2.body.isMatch, true);

  const send = await requestJson(baseUrl, '/chat/send', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ toUserId: bId, text: 'Namaste!' })
  });
  assert.equal(send.status, 201);

  const thread = await requestJson(baseUrl, `/chat/thread?withUserId=${bId}`, {
    headers: { authorization: `Bearer ${tokenA}` }
  });
  assert.equal(thread.status, 200);
  assert.equal(thread.body.messages.length, 1);

  const report = await requestJson(baseUrl, '/safety/report', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ targetUserId: bId, reason: 'spam' })
  });
  assert.equal(report.status, 201);

  const reportsByAdmin = await requestJson(baseUrl, '/admin/reports', {
    headers: { authorization: `Bearer ${adminToken}` }
  });
  assert.equal(reportsByAdmin.status, 200);
  assert.equal(reportsByAdmin.body.reports.length, 1);

  const block = await requestJson(baseUrl, '/safety/block', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ targetUserId: bId })
  });
  assert.equal(block.status, 201);

  const blockedChat = await requestJson(baseUrl, '/chat/send', {
    method: 'POST',
    headers: { authorization: `Bearer ${tokenA}` },
    body: JSON.stringify({ toUserId: bId, text: 'Are you there?' })
  });
  assert.equal(blockedChat.status, 403);

  await new Promise((resolve) => server.close(resolve));
});
