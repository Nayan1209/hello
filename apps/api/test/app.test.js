import test from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from '../src/app.js';

async function requestJson(baseUrl, path, options = {}) {
  const res = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: { 'content-type': 'application/json', ...(options.headers || {}) }
  });
  const body = await res.json();
  return { status: res.status, body };
}

test('health endpoint works', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const result = await requestJson(baseUrl, '/health');
  assert.equal(result.status, 200);
  assert.equal(result.body.ok, true);

  await new Promise((resolve) => server.close(resolve));
});

test('register, profile, match and chat flow works', async () => {
  const server = createServer();
  await new Promise((resolve) => server.listen(0, resolve));
  const port = server.address().port;
  const baseUrl = `http://127.0.0.1:${port}`;

  const a = await requestJson(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Asha', phone: '111' }) });
  const b = await requestJson(baseUrl, '/auth/register', { method: 'POST', body: JSON.stringify({ name: 'Ravi', phone: '222' }) });

  const aId = a.body.user.id;
  const bId = b.body.user.id;

  await requestJson(baseUrl, '/profile', { method: 'POST', body: JSON.stringify({ userId: aId, age: 26, bio: 'Engineer', location: 'Pune' }) });
  await requestJson(baseUrl, '/profile', { method: 'POST', body: JSON.stringify({ userId: bId, age: 28, bio: 'Designer', location: 'Mumbai' }) });

  const like1 = await requestJson(baseUrl, '/match/swipe', { method: 'POST', body: JSON.stringify({ fromUserId: aId, toUserId: bId, action: 'like' }) });
  assert.equal(like1.body.isMatch, false);

  const like2 = await requestJson(baseUrl, '/match/swipe', { method: 'POST', body: JSON.stringify({ fromUserId: bId, toUserId: aId, action: 'like' }) });
  assert.equal(like2.body.isMatch, true);

  const send = await requestJson(baseUrl, '/chat/send', { method: 'POST', body: JSON.stringify({ fromUserId: aId, toUserId: bId, text: 'Namaste!' }) });
  assert.equal(send.status, 201);

  const thread = await requestJson(baseUrl, `/chat/thread?userA=${aId}&userB=${bId}`);
  assert.equal(thread.status, 200);
  assert.equal(thread.body.messages.length, 1);

  await new Promise((resolve) => server.close(resolve));
});
