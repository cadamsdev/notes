import Fastify, { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
dotenv.config();
import { getNotes } from './db';

const server: FastifyInstance = Fastify({
  logger: true,
});

server.get('/', async (request, reply) => {
  const notes = await getNotes();
  return notes;
});

const start = async () => {
  try {
    await server.listen({ port: 3001 });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
