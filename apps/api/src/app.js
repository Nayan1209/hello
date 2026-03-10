import { createServer as createHttpServer } from 'node:http';

// In-memory data storage
const users = new Map();
const profiles = new Map();
const swipes = new Map();
const messages = new Map();
let userIdCounter = 1;
let messageIdCounter = 1;

export function createServer() {
  return createHttpServer(async (req, res) => {
    // Helper to set JSON response
    const sendJson = (status, data) => {
      res.writeHead(status, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(data));
    };

    // Helper to read request body
    const readBody = () => {
      return new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          try {
            resolve(body ? JSON.parse(body) : {});
          } catch {
            resolve({});
          }
        });
      });
    };

    // Parse URL and method
    const [pathname, search] = req.url.split('?');
    const method = req.method;

    // Health endpoint
    if (pathname === '/health' && method === 'GET') {
      return sendJson(200, { ok: true });
    }

    // Register endpoint
    if (pathname === '/auth/register' && method === 'POST') {
      const data = await readBody();
      const userId = String(userIdCounter++);
      users.set(userId, {
        id: userId,
        name: data.name,
        phone: data.phone
      });
      return sendJson(200, { user: users.get(userId) });
    }

    // Profile endpoint
    if (pathname === '/profile' && method === 'POST') {
      const data = await readBody();
      profiles.set(data.userId, {
        userId: data.userId,
        age: data.age,
        bio: data.bio,
        location: data.location
      });
      return sendJson(200, { success: true });
    }

    // Match swipe endpoint
    if (pathname === '/match/swipe' && method === 'POST') {
      const data = await readBody();
      const swipeKey = `${data.fromUserId}->${data.toUserId}`;
      swipes.set(swipeKey, {
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        action: data.action
      });

      // Check if it's a mutual match
      const reverseSwipeKey = `${data.toUserId}->${data.fromUserId}`;
      const reverseSwipe = swipes.get(reverseSwipeKey);
      const isMatch = reverseSwipe && reverseSwipe.action === 'like' && data.action === 'like';

      return sendJson(200, { isMatch });
    }

    // Chat send endpoint
    if (pathname === '/chat/send' && method === 'POST') {
      const data = await readBody();
      const messageId = String(messageIdCounter++);
      const threadKey = [data.fromUserId, data.toUserId].sort().join('-');
      
      if (!messages.has(threadKey)) {
        messages.set(threadKey, []);
      }

      const message = {
        id: messageId,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        text: data.text,
        timestamp: new Date().toISOString()
      };

      messages.get(threadKey).push(message);
      return sendJson(201, message);
    }

    // Chat thread endpoint
    if (pathname.startsWith('/chat/thread') && method === 'GET') {
      const params = new URLSearchParams(search);
      const userA = params.get('userA');
      const userB = params.get('userB');
      const threadKey = [userA, userB].sort().join('-');
      
      const threadMessages = messages.get(threadKey) || [];
      return sendJson(200, { messages: threadMessages });
    }

    // 404
    sendJson(404, { error: 'Not found' });
  });
}