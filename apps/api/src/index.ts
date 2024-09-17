import Fastify, { FastifyInstance } from 'fastify';
import * as dotenv from 'dotenv';
dotenv.config();
import { createNote, deleteNote, deleteTag, getAllTags, getNoteForId, getNotes, getTagsForNote, getTagSort, saveTags, updateNote, updateTag } from './db';
import { Note } from './models/note';
import { Tag } from './models/tag';
import cors from '@fastify/cors';

const server: FastifyInstance = Fastify({
  logger: true,
});

server.register(cors, {
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
});

server.get('/health-check', async (request, reply) => {
  return { status: 'ok' };
});


server.get('/notes', async (request, reply) => {
  const notes = await getNotes();
  return notes;
});

server.get('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const note = await getNoteForId(id);
  const tags = await getTagsForNote(id);
  if (note) {
    note.tags = tags;
  }
  return note;
});

server.post('/notes', async (request, reply) => {
  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

  const { title, content } = JSON.parse(request.body as string) as {
    title: string;
    content: string;
  };
  const note = await createNote(title, content);
  return note;
});

server.put('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };

  if (!id) {
    reply.code(400).send({ error: 'Invalid note id' });
    return;
  }

  if (!request.body) {
    reply.code(400).send({ error: 'Request body is missing' });
    return;
  }

  const newNote = JSON.parse(request.body as string) as Note;
  newNote.id = id;
  const note = await updateNote(newNote);
  return note;
});

server.delete('/notes/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const note = await deleteNote(id);
  return note;
});

server.get('/tags', async (request, reply) => {
  const tags = await getAllTags();
  return tags;
});

server.put('/tags/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const tag = JSON.parse(request.body as string) as Tag;
  tag.id = +id;
  const result = await updateTag(tag);
  return result;
});

server.delete('/tags/:id', async (request, reply) => {
  const { id } = request.params as { id: number };
  const tag = await deleteTag(id);
  return tag;
});

server.put('/notes/:id/tags', async (request, reply) => {
  const { id } = request.params as { id: number };
  const tags = request.body as Tag[];

  await saveTags(id, tags);
  const updatedNote = await getNoteForId(id);
  return updatedNote;
});

server.get('/tag-sort', async (request, reply) => {
  const tagSort = await getTagSort();
  return { tagSort };
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
