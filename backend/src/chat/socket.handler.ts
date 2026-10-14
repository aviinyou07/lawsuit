import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { query } from '../database/index.js';
import { AuthUser } from '../common/auth.middleware.js';

export function setupSocketIO(io: Server) {
  // Authentication middleware for Socket.io
  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.headers.authorization?.split(' ')[1];
    if (!token) {
      return next(new Error('Authentication error: Token required'));
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret) as AuthUser;
      socket.data.user = decoded;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket: Socket) => {
    const user: AuthUser = socket.data.user;
    console.log(`User connected to socket: ${user.userId} (${user.role})`);

    // Join user-specific notification room
    socket.join(`user_${user.userId}`);

    // Join specific chat thread
    socket.on('join_thread', ({ thread_id }: { thread_id: string }) => {
      socket.join(`thread_${thread_id}`);
      console.log(`User ${user.userId} joined thread ${thread_id}`);
    });

    // Send Message
    socket.on(
      'send_message',
      async ({
        thread_id,
        message_text,
        message_type = 'TEXT',
        file_url,
      }: {
        thread_id: string;
        message_text?: string;
        message_type?: string;
        file_url?: string;
      }) => {
        try {
          const insertRes = await query(
            `INSERT INTO chat_messages (thread_id, sender_id, message_type, message_text, file_url)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [thread_id, user.userId, message_type, message_text || null, file_url || null]
          );

          const savedMessage = insertRes.rows[0];

          await query(
            `UPDATE chat_threads SET last_message_at = NOW() WHERE id = $1`,
            [thread_id]
          );

          // Broadcast to everyone in thread
          io.to(`thread_${thread_id}`).emit('new_message', savedMessage);
        } catch (err) {
          console.error('Failed to save chat message', err);
          socket.emit('error', { message: 'Failed to send message' });
        }
      }
    );

    // Typing Indicators
    socket.on('typing_start', ({ thread_id }: { thread_id: string }) => {
      socket.to(`thread_${thread_id}`).emit('user_typing', { userId: user.userId, isTyping: true });
    });

    socket.on('typing_stop', ({ thread_id }: { thread_id: string }) => {
      socket.to(`thread_${thread_id}`).emit('user_typing', { userId: user.userId, isTyping: false });
    });

    // Mark as Read
    socket.on('mark_read', async ({ thread_id, message_ids }: { thread_id: string; message_ids: string[] }) => {
      if (message_ids && message_ids.length > 0) {
        await query(
          `UPDATE chat_messages
           SET is_read = TRUE, read_at = NOW()
           WHERE thread_id = $1 AND sender_id != $2 AND id = ANY($3::uuid[])`,
          [thread_id, user.userId, message_ids]
        );

        socket.to(`thread_${thread_id}`).emit('message_read_receipt', {
          message_ids,
          read_at: new Date().toISOString(),
        });
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected from socket: ${user.userId}`);
    });
  });
}
